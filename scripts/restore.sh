#!/bin/bash

# Script de restauration pour SeneMedecine
# Usage: ./restore.sh [archive_file] [options]

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
ARCHIVE_FILE="$1"
FORCE_RESTORE="${2:-false}"
TEMP_DIR="/tmp/senemedecine_restore_$$"
BACKUP_BEFORE_RESTORE="${BACKUP_BEFORE_RESTORE:-true}"

# Configuration
DB_CONTAINER="senemedecine_postgres_1"
REDIS_CONTAINER="senemedecine_redis_1"
ORTHANC_CONTAINER="senemedecine_orthanc_1"

# Vérifier les arguments
check_arguments() {
    if [ -z "$ARCHIVE_FILE" ]; then
        log_error "Fichier d'archive requis"
        show_help
        exit 1
    fi
    
    if [ ! -f "$ARCHIVE_FILE" ]; then
        log_error "Fichier d'archive non trouvé: $ARCHIVE_FILE"
        exit 1
    fi
    
    log_success "Fichier d'archive trouvé: $ARCHIVE_FILE"
}

# Vérifier l'intégrité de l'archive
verify_archive_integrity() {
    log_info "Vérification de l'intégrité de l'archive..."
    
    local checksum_file="${ARCHIVE_FILE}.sha256"
    
    if [ -f "$checksum_file" ]; then
        if sha256sum -c "$checksum_file"; then
            log_success "Intégrité de l'archive vérifiée"
        else
            log_error "Échec de la vérification d'intégrité"
            if [ "$FORCE_RESTORE" != "true" ]; then
                exit 1
            else
                log_warning "Poursuite forcée malgré l'échec de vérification"
            fi
        fi
    else
        log_warning "Fichier de checksum non trouvé, vérification ignorée"
    fi
}

# Extraire l'archive
extract_archive() {
    log_info "Extraction de l'archive..."
    
    mkdir -p "$TEMP_DIR"
    
    if tar -xzf "$ARCHIVE_FILE" -C "$TEMP_DIR"; then
        log_success "Archive extraite dans: $TEMP_DIR"
    else
        log_error "Échec de l'extraction de l'archive"
        exit 1
    fi
}

# Lire les métadonnées de sauvegarde
read_backup_metadata() {
    local metadata_file="$TEMP_DIR/backup_metadata.json"
    
    if [ -f "$metadata_file" ]; then
        log_info "Lecture des métadonnées de sauvegarde..."
        
        if command -v jq &> /dev/null; then
            local backup_type=$(jq -r '.backup_type' "$metadata_file")
            local backup_date=$(jq -r '.date' "$metadata_file")
            local backup_version=$(jq -r '.version' "$metadata_file")
            
            echo ""
            echo "📋 Informations de sauvegarde:"
            echo "  Type: $backup_type"
            echo "  Date: $backup_date"
            echo "  Version: $backup_version"
            echo ""
        else
            log_warning "jq non installé, métadonnées non lisibles"
        fi
    else
        log_warning "Fichier de métadonnées non trouvé"
    fi
}

# Créer une sauvegarde avant restauration
backup_before_restore() {
    if [ "$BACKUP_BEFORE_RESTORE" = "true" ]; then
        log_info "Création d'une sauvegarde de sécurité avant restauration..."
        
        local backup_script="./scripts/backup.sh"
        if [ -f "$backup_script" ]; then
            "$backup_script" full local
            log_success "Sauvegarde de sécurité créée"
        else
            log_warning "Script de sauvegarde non trouvé, sauvegarde de sécurité ignorée"
        fi
    else
        log_info "Sauvegarde de sécurité désactivée"
    fi
}

# Vérifier que Docker est disponible
check_docker() {
    if ! command -v docker &> /dev/null; then
        log_error "Docker n'est pas installé ou accessible"
        exit 1
    fi
    
    if ! docker-compose ps &> /dev/null; then
        log_error "Docker Compose n'est pas accessible"
        exit 1
    fi
    
    log_success "Docker et Docker Compose sont accessibles"
}

# Arrêter les services
stop_services() {
    log_info "Arrêt des services..."
    
    docker-compose down
    
    log_success "Services arrêtés"
}

# Restaurer la base de données PostgreSQL
restore_database() {
    local db_file=$(find "$TEMP_DIR" -name "database_*.sql.gz" | head -n1)
    
    if [ -f "$db_file" ]; then
        log_info "Restauration de la base de données PostgreSQL..."
        
        # Démarrer uniquement PostgreSQL
        docker-compose up -d postgres
        
        # Attendre que PostgreSQL soit prêt
        log_info "Attente de la disponibilité de PostgreSQL..."
        sleep 10
        
        # Vérifier la connectivité
        local max_attempts=30
        local attempt=1
        
        while [ $attempt -le $max_attempts ]; do
            if docker-compose exec -T postgres pg_isready -U senemedecine; then
                break
            fi
            
            if [ $attempt -eq $max_attempts ]; then
                log_error "PostgreSQL non accessible après $max_attempts tentatives"
                return 1
            fi
            
            sleep 2
            attempt=$((attempt + 1))
        done
        
        # Restaurer la base de données
        log_info "Restauration des données..."
        zcat "$db_file" | docker-compose exec -T postgres psql -U senemedecine
        
        if [ $? -eq 0 ]; then
            log_success "Base de données restaurée"
        else
            log_error "Échec de la restauration de la base de données"
            return 1
        fi
    else
        log_warning "Aucun fichier de base de données trouvé dans l'archive"
    fi
}

# Restaurer Redis
restore_redis() {
    local redis_file=$(find "$TEMP_DIR" -name "redis_*.rdb.gz" | head -n1)
    
    if [ -f "$redis_file" ]; then
        log_info "Restauration de Redis..."
        
        # Décompresser le fichier Redis
        local redis_rdb_file="${redis_file%.gz}"
        gunzip -c "$redis_file" > "$redis_rdb_file"
        
        # Arrêter Redis s'il est en cours d'exécution
        docker-compose stop redis || true
        
        # Copier le fichier RDB
        docker cp "$redis_rdb_file" "${REDIS_CONTAINER}:/data/dump.rdb" || true
        
        # Redémarrer Redis
        docker-compose up -d redis
        
        log_success "Redis restauré"
    else
        log_warning "Aucun fichier Redis trouvé dans l'archive"
    fi
}

# Restaurer les données Orthanc
restore_orthanc() {
    local orthanc_file=$(find "$TEMP_DIR" -name "orthanc_*.tar.gz" | head -n1)
    
    if [ -f "$orthanc_file" ]; then
        log_info "Restauration des données Orthanc..."
        
        # Extraire les données Orthanc
        local orthanc_temp_dir="$TEMP_DIR/orthanc_restore"
        mkdir -p "$orthanc_temp_dir"
        tar -xzf "$orthanc_file" -C "$orthanc_temp_dir"
        
        # Arrêter Orthanc s'il est en cours d'exécution
        docker-compose stop orthanc || true
        
        # Copier les données
        local orthanc_data_dir=$(find "$orthanc_temp_dir" -name "db" -type d | head -n1)
        if [ -d "$orthanc_data_dir" ]; then
            docker cp "$orthanc_data_dir" "${ORTHANC_CONTAINER}:/var/lib/orthanc/"
            log_success "Données Orthanc restaurées"
        else
            log_warning "Répertoire de données Orthanc non trouvé"
        fi
        
        # Redémarrer Orthanc
        docker-compose up -d orthanc
    else
        log_warning "Aucun fichier Orthanc trouvé dans l'archive"
    fi
}

# Restaurer les fichiers uploadés
restore_uploads() {
    local uploads_file=$(find "$TEMP_DIR" -name "uploads_*.tar.gz" | head -n1)
    
    if [ -f "$uploads_file" ]; then
        log_info "Restauration des fichiers uploadés..."
        
        # Sauvegarder les uploads existants
        if [ -d "backend/uploads" ]; then
            mv "backend/uploads" "backend/uploads.backup.$(date +%s)"
        fi
        
        # Extraire les nouveaux uploads
        tar -xzf "$uploads_file" -C backend/
        
        if [ -d "backend/uploads" ]; then
            log_success "Fichiers uploadés restaurés"
        else
            log_error "Échec de la restauration des fichiers uploadés"
        fi
    else
        log_warning "Aucun fichier d'uploads trouvé dans l'archive"
    fi
}

# Restaurer les logs
restore_logs() {
    local logs_file=$(find "$TEMP_DIR" -name "logs_*.tar.gz" | head -n1)
    
    if [ -f "$logs_file" ]; then
        log_info "Restauration des logs..."
        
        # Sauvegarder les logs existants
        if [ -d "logs" ]; then
            mv "logs" "logs.backup.$(date +%s)"
        fi
        
        # Extraire les nouveaux logs
        tar -xzf "$logs_file" -C .
        
        if [ -d "logs" ]; then
            log_success "Logs restaurés"
        else
            log_warning "Échec de la restauration des logs"
        fi
    else
        log_warning "Aucun fichier de logs trouvé dans l'archive"
    fi
}

# Redémarrer tous les services
start_services() {
    log_info "Démarrage de tous les services..."
    
    docker-compose up -d
    
    # Attendre que les services soient prêts
    log_info "Attente de la disponibilité des services..."
    sleep 30
    
    # Vérifier la santé des services
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if curl -f -s "http://localhost:3001/health" > /dev/null; then
            log_success "Services démarrés et opérationnels"
            return 0
        fi
        
        if [ $attempt -eq $max_attempts ]; then
            log_warning "Services démarrés mais santé non vérifiée"
            return 0
        fi
        
        sleep 5
        attempt=$((attempt + 1))
    done
}

# Nettoyer les fichiers temporaires
cleanup_temp() {
    if [ -d "$TEMP_DIR" ]; then
        rm -rf "$TEMP_DIR"
        log_info "Fichiers temporaires nettoyés"
    fi
}

# Confirmer la restauration
confirm_restore() {
    if [ "$FORCE_RESTORE" = "true" ]; then
        return 0
    fi
    
    echo ""
    log_warning "⚠️  ATTENTION: Cette opération va remplacer les données existantes!"
    echo ""
    read -p "Êtes-vous sûr de vouloir continuer? (oui/non): " -r
    
    if [[ ! $REPLY =~ ^[Oo][Uu][Ii]$ ]]; then
        log_info "Restauration annulée par l'utilisateur"
        exit 0
    fi
}

# Afficher l'aide
show_help() {
    echo "Usage: $0 <archive_file> [force]"
    echo ""
    echo "Arguments:"
    echo "  archive_file    Fichier d'archive à restaurer"
    echo "  force          Forcer la restauration sans confirmation"
    echo ""
    echo "Variables d'environnement:"
    echo "  BACKUP_BEFORE_RESTORE    Créer une sauvegarde avant restauration (true/false)"
    echo ""
    echo "Exemples:"
    echo "  $0 backups/senemedecine_full_20231201_120000.tar.gz"
    echo "  $0 backups/senemedecine_full_20231201_120000.tar.gz force"
    echo "  BACKUP_BEFORE_RESTORE=false $0 backup.tar.gz"
}

# Fonction principale
main() {
    echo "🔄 Restauration SeneMedecine"
    echo "============================"
    echo "Archive: $ARCHIVE_FILE"
    echo "Force: $FORCE_RESTORE"
    echo ""
    
    local start_time=$(date +%s)
    
    # Trap pour nettoyer en cas d'erreur
    trap cleanup_temp EXIT
    
    # Étapes de restauration
    check_arguments
    verify_archive_integrity
    extract_archive
    read_backup_metadata
    confirm_restore
    backup_before_restore
    check_docker
    stop_services
    
    # Restaurer les composants
    restore_database
    restore_redis
    restore_orthanc
    restore_uploads
    restore_logs
    
    # Redémarrer les services
    start_services
    
    local end_time=$(date +%s)
    local duration=$((end_time - start_time))
    
    log_success "✅ Restauration terminée en ${duration}s"
    echo ""
    echo "🌐 Application disponible sur: http://localhost:3000"
    echo "🔧 API disponible sur: http://localhost:3001"
    echo "📚 Vérifiez les logs pour d'éventuelles erreurs"
}

# Gestion des arguments
case "${1:-}" in
    "help"|"-h"|"--help"|"")
        show_help
        exit 0
        ;;
    *)
        main "$@"
        ;;
esac

