#!/bin/bash

# Script de sauvegarde pour SeneMedecine
# Usage: ./backup.sh [type] [destination]

set -e

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Variables
BACKUP_TYPE="${1:-full}"
DESTINATION="${2:-local}"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="backups"
TEMP_DIR="/tmp/senemedecine_backup_$$"

# Configuration
DB_CONTAINER="senemedecine_postgres_1"
REDIS_CONTAINER="senemedecine_redis_1"
ORTHANC_CONTAINER="senemedecine_orthanc_1"

# Créer les répertoires nécessaires
setup_directories() {
    mkdir -p "$BACKUP_DIR"
    mkdir -p "$TEMP_DIR"
    log_info "Répertoires de sauvegarde créés"
}

# Vérifier que Docker est disponible
check_docker() {
    if ! command -v docker &> /dev/null; then
        log_error "Docker n'est pas installé ou accessible"
        exit 1
    fi
    
    if ! docker-compose ps &> /dev/null; then
        log_error "Docker Compose n'est pas accessible ou les services ne sont pas démarrés"
        exit 1
    fi
    
    log_success "Docker et Docker Compose sont accessibles"
}

# Sauvegarder la base de données PostgreSQL
backup_database() {
    log_info "Sauvegarde de la base de données PostgreSQL..."
    
    local db_backup_file="$TEMP_DIR/database_${TIMESTAMP}.sql"
    
    # Vérifier que le conteneur PostgreSQL est en cours d'exécution
    if ! docker-compose ps postgres | grep -q "Up"; then
        log_error "Le conteneur PostgreSQL n'est pas en cours d'exécution"
        return 1
    fi
    
    # Effectuer la sauvegarde
    docker-compose exec -T postgres pg_dumpall -U senemedecine > "$db_backup_file"
    
    if [ $? -eq 0 ] && [ -s "$db_backup_file" ]; then
        log_success "Base de données sauvegardée: $db_backup_file"
        
        # Compresser la sauvegarde
        gzip "$db_backup_file"
        log_success "Sauvegarde compressée: ${db_backup_file}.gz"
    else
        log_error "Échec de la sauvegarde de la base de données"
        return 1
    fi
}

# Sauvegarder Redis
backup_redis() {
    log_info "Sauvegarde de Redis..."
    
    local redis_backup_file="$TEMP_DIR/redis_${TIMESTAMP}.rdb"
    
    # Vérifier que le conteneur Redis est en cours d'exécution
    if ! docker-compose ps redis | grep -q "Up"; then
        log_warning "Le conteneur Redis n'est pas en cours d'exécution, sauvegarde ignorée"
        return 0
    fi
    
    # Forcer une sauvegarde Redis
    docker-compose exec -T redis redis-cli BGSAVE
    
    # Attendre que la sauvegarde soit terminée
    sleep 5
    
    # Copier le fichier RDB
    docker cp "${REDIS_CONTAINER}:/data/dump.rdb" "$redis_backup_file"
    
    if [ -f "$redis_backup_file" ]; then
        log_success "Redis sauvegardé: $redis_backup_file"
        gzip "$redis_backup_file"
        log_success "Sauvegarde Redis compressée: ${redis_backup_file}.gz"
    else
        log_warning "Échec de la sauvegarde Redis"
    fi
}

# Sauvegarder les données Orthanc
backup_orthanc() {
    log_info "Sauvegarde des données Orthanc..."
    
    local orthanc_backup_dir="$TEMP_DIR/orthanc_${TIMESTAMP}"
    mkdir -p "$orthanc_backup_dir"
    
    # Vérifier que le conteneur Orthanc est en cours d'exécution
    if ! docker-compose ps orthanc | grep -q "Up"; then
        log_warning "Le conteneur Orthanc n'est pas en cours d'exécution, sauvegarde ignorée"
        return 0
    fi
    
    # Copier les données Orthanc
    docker cp "${ORTHANC_CONTAINER}:/var/lib/orthanc/db" "$orthanc_backup_dir/"
    
    if [ -d "$orthanc_backup_dir/db" ]; then
        log_success "Données Orthanc sauvegardées: $orthanc_backup_dir"
        
        # Compresser les données Orthanc
        tar -czf "${orthanc_backup_dir}.tar.gz" -C "$TEMP_DIR" "orthanc_${TIMESTAMP}"
        rm -rf "$orthanc_backup_dir"
        log_success "Données Orthanc compressées: ${orthanc_backup_dir}.tar.gz"
    else
        log_warning "Échec de la sauvegarde des données Orthanc"
    fi
}

# Sauvegarder les fichiers uploadés
backup_uploads() {
    log_info "Sauvegarde des fichiers uploadés..."
    
    local uploads_backup_file="$TEMP_DIR/uploads_${TIMESTAMP}.tar.gz"
    
    if [ -d "backend/uploads" ] && [ "$(ls -A backend/uploads)" ]; then
        tar -czf "$uploads_backup_file" -C backend uploads/
        log_success "Fichiers uploadés sauvegardés: $uploads_backup_file"
    else
        log_info "Aucun fichier uploadé à sauvegarder"
    fi
}

# Sauvegarder les logs
backup_logs() {
    log_info "Sauvegarde des logs..."
    
    local logs_backup_file="$TEMP_DIR/logs_${TIMESTAMP}.tar.gz"
    
    if [ -d "logs" ] && [ "$(ls -A logs)" ]; then
        tar -czf "$logs_backup_file" logs/
        log_success "Logs sauvegardés: $logs_backup_file"
    else
        log_info "Aucun log à sauvegarder"
    fi
}

# Créer l'archive finale
create_final_archive() {
    log_info "Création de l'archive finale..."
    
    local final_archive="$BACKUP_DIR/senemedecine_${BACKUP_TYPE}_${TIMESTAMP}.tar.gz"
    
    # Créer un fichier de métadonnées
    cat > "$TEMP_DIR/backup_metadata.json" << EOF
{
  "backup_type": "$BACKUP_TYPE",
  "timestamp": "$TIMESTAMP",
  "date": "$(date -Iseconds)",
  "version": "$(git rev-parse --short HEAD 2>/dev/null || echo 'unknown')",
  "environment": "${ENVIRONMENT:-unknown}",
  "components": {
    "database": $([ -f "$TEMP_DIR/database_${TIMESTAMP}.sql.gz" ] && echo "true" || echo "false"),
    "redis": $([ -f "$TEMP_DIR/redis_${TIMESTAMP}.rdb.gz" ] && echo "true" || echo "false"),
    "orthanc": $([ -f "$TEMP_DIR/orthanc_${TIMESTAMP}.tar.gz" ] && echo "true" || echo "false"),
    "uploads": $([ -f "$TEMP_DIR/uploads_${TIMESTAMP}.tar.gz" ] && echo "true" || echo "false"),
    "logs": $([ -f "$TEMP_DIR/logs_${TIMESTAMP}.tar.gz" ] && echo "true" || echo "false")
  }
}
EOF
    
    # Créer l'archive finale
    tar -czf "$final_archive" -C "$TEMP_DIR" .
    
    if [ -f "$final_archive" ]; then
        local archive_size=$(du -h "$final_archive" | cut -f1)
        log_success "Archive finale créée: $final_archive ($archive_size)"
        
        # Calculer le checksum
        local checksum=$(sha256sum "$final_archive" | cut -d' ' -f1)
        echo "$checksum  $(basename "$final_archive")" > "${final_archive}.sha256"
        log_success "Checksum créé: ${final_archive}.sha256"
        
        return 0
    else
        log_error "Échec de la création de l'archive finale"
        return 1
    fi
}

# Uploader vers un stockage distant
upload_to_remote() {
    local archive_file="$1"
    
    case "$DESTINATION" in
        "s3")
            if [ -n "$AWS_S3_BUCKET" ]; then
                log_info "Upload vers S3: $AWS_S3_BUCKET"
                aws s3 cp "$archive_file" "s3://$AWS_S3_BUCKET/backups/"
                aws s3 cp "${archive_file}.sha256" "s3://$AWS_S3_BUCKET/backups/"
                log_success "Archive uploadée vers S3"
            else
                log_error "Variable AWS_S3_BUCKET non définie"
            fi
            ;;
        "ftp")
            if [ -n "$FTP_SERVER" ] && [ -n "$FTP_USER" ] && [ -n "$FTP_PASS" ]; then
                log_info "Upload vers FTP: $FTP_SERVER"
                curl -T "$archive_file" "ftp://$FTP_USER:$FTP_PASS@$FTP_SERVER/backups/"
                curl -T "${archive_file}.sha256" "ftp://$FTP_USER:$FTP_PASS@$FTP_SERVER/backups/"
                log_success "Archive uploadée vers FTP"
            else
                log_error "Variables FTP non définies"
            fi
            ;;
        "rsync")
            if [ -n "$RSYNC_DESTINATION" ]; then
                log_info "Synchronisation via rsync: $RSYNC_DESTINATION"
                rsync -avz "$archive_file" "$RSYNC_DESTINATION"
                rsync -avz "${archive_file}.sha256" "$RSYNC_DESTINATION"
                log_success "Archive synchronisée via rsync"
            else
                log_error "Variable RSYNC_DESTINATION non définie"
            fi
            ;;
        "local")
            log_info "Sauvegarde locale uniquement"
            ;;
        *)
            log_warning "Destination inconnue: $DESTINATION"
            ;;
    esac
}

# Nettoyer les anciennes sauvegardes
cleanup_old_backups() {
    log_info "Nettoyage des anciennes sauvegardes..."
    
    # Garder les 7 dernières sauvegardes
    local backups_to_keep=7
    
    ls -t "$BACKUP_DIR"/senemedecine_*.tar.gz 2>/dev/null | tail -n +$((backups_to_keep + 1)) | while read -r old_backup; do
        log_info "Suppression de l'ancienne sauvegarde: $(basename "$old_backup")"
        rm -f "$old_backup"
        rm -f "${old_backup}.sha256"
    done
    
    log_success "Nettoyage terminé"
}

# Nettoyer les fichiers temporaires
cleanup_temp() {
    if [ -d "$TEMP_DIR" ]; then
        rm -rf "$TEMP_DIR"
        log_info "Fichiers temporaires nettoyés"
    fi
}

# Afficher l'aide
show_help() {
    echo "Usage: $0 [type] [destination]"
    echo ""
    echo "Types de sauvegarde:"
    echo "  full        Sauvegarde complète (par défaut)"
    echo "  database    Base de données uniquement"
    echo "  files       Fichiers uniquement"
    echo "  config      Configuration uniquement"
    echo ""
    echo "Destinations:"
    echo "  local       Stockage local (par défaut)"
    echo "  s3          Amazon S3 (nécessite AWS_S3_BUCKET)"
    echo "  ftp         Serveur FTP (nécessite FTP_SERVER, FTP_USER, FTP_PASS)"
    echo "  rsync       Synchronisation rsync (nécessite RSYNC_DESTINATION)"
    echo ""
    echo "Variables d'environnement:"
    echo "  AWS_S3_BUCKET       Bucket S3 pour les sauvegardes"
    echo "  FTP_SERVER          Serveur FTP"
    echo "  FTP_USER            Utilisateur FTP"
    echo "  FTP_PASS            Mot de passe FTP"
    echo "  RSYNC_DESTINATION   Destination rsync"
    echo ""
    echo "Exemples:"
    echo "  $0                    # Sauvegarde complète locale"
    echo "  $0 database s3        # Sauvegarde DB vers S3"
    echo "  $0 full rsync         # Sauvegarde complète via rsync"
}

# Fonction principale
main() {
    echo "💾 Sauvegarde SeneMedecine"
    echo "========================="
    echo "Type: $BACKUP_TYPE"
    echo "Destination: $DESTINATION"
    echo "Timestamp: $TIMESTAMP"
    echo ""
    
    local start_time=$(date +%s)
    
    # Trap pour nettoyer en cas d'erreur
    trap cleanup_temp EXIT
    
    # Étapes de sauvegarde
    setup_directories
    check_docker
    
    case "$BACKUP_TYPE" in
        "full")
            backup_database
            backup_redis
            backup_orthanc
            backup_uploads
            backup_logs
            ;;
        "database")
            backup_database
            ;;
        "files")
            backup_uploads
            backup_logs
            ;;
        "config")
            log_info "Sauvegarde de configuration non implémentée"
            ;;
        *)
            log_error "Type de sauvegarde non supporté: $BACKUP_TYPE"
            exit 1
            ;;
    esac
    
    # Créer l'archive finale
    local final_archive="$BACKUP_DIR/senemedecine_${BACKUP_TYPE}_${TIMESTAMP}.tar.gz"
    if create_final_archive; then
        # Upload si nécessaire
        if [ "$DESTINATION" != "local" ]; then
            upload_to_remote "$final_archive"
        fi
        
        # Nettoyage
        cleanup_old_backups
        
        local end_time=$(date +%s)
        local duration=$((end_time - start_time))
        
        log_success "✅ Sauvegarde terminée en ${duration}s"
        echo ""
        echo "📁 Archive: $final_archive"
        echo "🔐 Checksum: ${final_archive}.sha256"
        echo "📊 Taille: $(du -h "$final_archive" | cut -f1)"
    else
        log_error "❌ Échec de la sauvegarde"
        exit 1
    fi
}

# Gestion des arguments
case "${1:-}" in
    "help"|"-h"|"--help")
        show_help
        exit 0
        ;;
    *)
        main "$@"
        ;;
esac

