#!/bin/bash

# Script de déploiement pour SeneMedecine
# Usage: ./deploy.sh [environment] [version]

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
ENVIRONMENT="${1:-staging}"
VERSION="${2:-latest}"
PROJECT_NAME="senemedecine"
DOCKER_REGISTRY="${DOCKER_REGISTRY:-}"
BACKUP_ENABLED="${BACKUP_ENABLED:-true}"

# Configuration par environnement
case "$ENVIRONMENT" in
    "development"|"dev")
        COMPOSE_FILE="docker-compose.yml -f docker-compose.dev.yml"
        DOMAIN="localhost"
        ;;
    "staging")
        COMPOSE_FILE="docker-compose.yml -f docker-compose.staging.yml"
        DOMAIN="${STAGING_DOMAIN:-staging.senemedecine.sn}"
        ;;
    "production"|"prod")
        COMPOSE_FILE="docker-compose.yml -f docker-compose.prod.yml"
        DOMAIN="${PRODUCTION_DOMAIN:-senemedecine.sn}"
        ;;
    *)
        log_error "Environnement non supporté: $ENVIRONMENT"
        exit 1
        ;;
esac

# Vérifications préalables
check_prerequisites() {
    log_info "Vérification des prérequis pour l'environnement $ENVIRONMENT..."
    
    # Vérifier Docker
    if ! command -v docker &> /dev/null; then
        log_error "Docker n'est pas installé"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        log_error "Docker Compose n'est pas installé"
        exit 1
    fi
    
    # Vérifier les fichiers de configuration
    if [ ! -f ".env" ]; then
        log_error "Fichier .env manquant"
        exit 1
    fi
    
    # Vérifier les certificats SSL pour la production
    if [ "$ENVIRONMENT" = "production" ] && [ ! -d "nginx/ssl" ]; then
        log_warning "Certificats SSL manquants pour la production"
    fi
    
    log_success "Prérequis vérifiés"
}

# Sauvegarde avant déploiement
backup_data() {
    if [ "$BACKUP_ENABLED" = "true" ]; then
        log_info "Création d'une sauvegarde avant déploiement..."
        
        # Créer le répertoire de sauvegarde
        BACKUP_DIR="backups/pre-deploy-$(date +%Y%m%d_%H%M%S)"
        mkdir -p "$BACKUP_DIR"
        
        # Sauvegarder la base de données si elle existe
        if docker-compose ps postgres | grep -q "Up"; then
            log_info "Sauvegarde de la base de données..."
            docker-compose exec -T postgres pg_dumpall -U senemedecine > "$BACKUP_DIR/database.sql"
            log_success "Base de données sauvegardée"
        fi
        
        # Sauvegarder les uploads
        if [ -d "backend/uploads" ]; then
            log_info "Sauvegarde des fichiers uploadés..."
            cp -r backend/uploads "$BACKUP_DIR/"
            log_success "Fichiers uploadés sauvegardés"
        fi
        
        log_success "Sauvegarde créée dans $BACKUP_DIR"
    else
        log_info "Sauvegarde désactivée"
    fi
}

# Construction des images
build_images() {
    log_info "Construction des images Docker..."
    
    # Construire les images avec le tag de version
    docker-compose -f $COMPOSE_FILE build \
        --build-arg VERSION="$VERSION" \
        --build-arg BUILD_DATE="$(date -u +'%Y-%m-%dT%H:%M:%SZ')" \
        --build-arg VCS_REF="$(git rev-parse --short HEAD)"
    
    # Taguer les images si un registre est configuré
    if [ -n "$DOCKER_REGISTRY" ]; then
        log_info "Tagage des images pour le registre $DOCKER_REGISTRY..."
        
        docker tag "${PROJECT_NAME}_backend:latest" "$DOCKER_REGISTRY/${PROJECT_NAME}_backend:$VERSION"
        docker tag "${PROJECT_NAME}_frontend:latest" "$DOCKER_REGISTRY/${PROJECT_NAME}_frontend:$VERSION"
        
        log_success "Images taguées"
    fi
    
    log_success "Images construites"
}

# Publication des images
push_images() {
    if [ -n "$DOCKER_REGISTRY" ]; then
        log_info "Publication des images vers $DOCKER_REGISTRY..."
        
        docker push "$DOCKER_REGISTRY/${PROJECT_NAME}_backend:$VERSION"
        docker push "$DOCKER_REGISTRY/${PROJECT_NAME}_frontend:$VERSION"
        
        log_success "Images publiées"
    else
        log_info "Aucun registre configuré, publication ignorée"
    fi
}

# Déploiement des services
deploy_services() {
    log_info "Déploiement des services..."
    
    # Arrêter les anciens services
    log_info "Arrêt des anciens services..."
    docker-compose -f $COMPOSE_FILE down --remove-orphans
    
    # Nettoyer les volumes orphelins si nécessaire
    if [ "$ENVIRONMENT" != "production" ]; then
        docker volume prune -f
    fi
    
    # Démarrer les nouveaux services
    log_info "Démarrage des nouveaux services..."
    docker-compose -f $COMPOSE_FILE up -d --remove-orphans
    
    log_success "Services déployés"
}

# Vérification de la santé des services
health_check() {
    log_info "Vérification de la santé des services..."
    
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        log_info "Tentative $attempt/$max_attempts..."
        
        # Vérifier le backend
        if curl -f -s "http://localhost:3001/health" > /dev/null; then
            log_success "Backend opérationnel"
            break
        fi
        
        if [ $attempt -eq $max_attempts ]; then
            log_error "Le backend n'est pas opérationnel après $max_attempts tentatives"
            return 1
        fi
        
        sleep 10
        attempt=$((attempt + 1))
    done
    
    # Vérifier les autres services
    local services=("postgres" "orthanc" "redis")
    
    for service in "${services[@]}"; do
        if docker-compose -f $COMPOSE_FILE ps "$service" | grep -q "Up"; then
            log_success "Service $service opérationnel"
        else
            log_warning "Service $service non opérationnel"
        fi
    done
    
    log_success "Vérification de santé terminée"
}

# Migration de la base de données
run_migrations() {
    log_info "Exécution des migrations de base de données..."
    
    # Attendre que la base de données soit prête
    sleep 10
    
    # Exécuter les migrations
    docker-compose -f $COMPOSE_FILE exec -T backend npm run migration:run
    
    log_success "Migrations exécutées"
}

# Nettoyage post-déploiement
cleanup() {
    log_info "Nettoyage post-déploiement..."
    
    # Supprimer les images non utilisées
    docker image prune -f
    
    # Supprimer les conteneurs arrêtés
    docker container prune -f
    
    log_success "Nettoyage terminé"
}

# Rollback en cas d'échec
rollback() {
    log_error "Échec du déploiement, rollback en cours..."
    
    # Arrêter les services défaillants
    docker-compose -f $COMPOSE_FILE down
    
    # Restaurer la sauvegarde si elle existe
    local latest_backup=$(ls -t backups/pre-deploy-* 2>/dev/null | head -n1)
    
    if [ -n "$latest_backup" ] && [ -f "$latest_backup/database.sql" ]; then
        log_info "Restauration de la sauvegarde $latest_backup..."
        
        # Redémarrer la base de données
        docker-compose -f $COMPOSE_FILE up -d postgres
        sleep 10
        
        # Restaurer les données
        docker-compose -f $COMPOSE_FILE exec -T postgres psql -U senemedecine < "$latest_backup/database.sql"
        
        log_success "Sauvegarde restaurée"
    fi
    
    log_error "Rollback terminé"
    exit 1
}

# Notification de déploiement
notify_deployment() {
    local status="$1"
    local message="Déploiement SeneMedecine $ENVIRONMENT ($VERSION): $status"
    
    # Slack notification (si configuré)
    if [ -n "$SLACK_WEBHOOK_URL" ]; then
        curl -X POST -H 'Content-type: application/json' \
            --data "{\"text\":\"$message\"}" \
            "$SLACK_WEBHOOK_URL" || true
    fi
    
    # Email notification (si configuré)
    if [ -n "$NOTIFICATION_EMAIL" ]; then
        echo "$message" | mail -s "Déploiement SeneMedecine" "$NOTIFICATION_EMAIL" || true
    fi
    
    log_info "Notification envoyée: $message"
}

# Affichage de l'aide
show_help() {
    echo "Usage: $0 [environment] [version]"
    echo ""
    echo "Environnements:"
    echo "  development, dev    Environnement de développement"
    echo "  staging            Environnement de staging"
    echo "  production, prod   Environnement de production"
    echo ""
    echo "Exemples:"
    echo "  $0 staging v1.2.0    # Déployer la version v1.2.0 en staging"
    echo "  $0 production        # Déployer la dernière version en production"
    echo ""
    echo "Variables d'environnement:"
    echo "  DOCKER_REGISTRY      Registre Docker pour les images"
    echo "  BACKUP_ENABLED       Activer les sauvegardes (true/false)"
    echo "  SLACK_WEBHOOK_URL    URL webhook Slack pour notifications"
    echo "  NOTIFICATION_EMAIL   Email pour notifications"
}

# Fonction principale
main() {
    echo "🚀 Déploiement SeneMedecine"
    echo "=========================="
    echo "Environnement: $ENVIRONMENT"
    echo "Version: $VERSION"
    echo "Domaine: $DOMAIN"
    echo ""
    
    local start_time=$(date +%s)
    
    # Trap pour gérer les erreurs
    trap rollback ERR
    
    # Étapes de déploiement
    check_prerequisites
    backup_data
    build_images
    push_images
    deploy_services
    run_migrations
    health_check
    cleanup
    
    local end_time=$(date +%s)
    local duration=$((end_time - start_time))
    
    log_success "✅ Déploiement réussi en ${duration}s !"
    echo ""
    echo "🌐 Application disponible sur: http://$DOMAIN"
    echo "🔧 API disponible sur: http://$DOMAIN/api"
    echo "📚 Documentation: http://$DOMAIN/api/docs"
    
    notify_deployment "SUCCÈS"
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

