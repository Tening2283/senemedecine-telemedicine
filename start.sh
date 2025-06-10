#!/bin/bash

# Script de démarrage rapide pour SeneMedecine
# Usage: ./start.sh [dev|prod|stop|clean]

set -e

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages
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

# Vérifier si Docker est installé
check_docker() {
    if ! command -v docker &> /dev/null; then
        log_error "Docker n'est pas installé. Veuillez l'installer d'abord."
        exit 1
    fi

    if ! command -v docker-compose &> /dev/null; then
        log_error "Docker Compose n'est pas installé. Veuillez l'installer d'abord."
        exit 1
    fi
}

# Créer le fichier .env s'il n'existe pas
setup_env() {
    if [ ! -f .env ]; then
        log_info "Création du fichier .env à partir de .env.example..."
        cp .env.example .env
        log_warning "Veuillez éditer le fichier .env selon vos besoins avant de continuer."
        log_warning "Appuyez sur Entrée pour continuer..."
        read
    fi
}

# Démarrage en mode développement
start_dev() {
    log_info "Démarrage de SeneMedecine en mode développement..."
    
    setup_env
    
    log_info "Construction et démarrage des conteneurs..."
    docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build -d
    
    log_info "Attente du démarrage des services..."
    sleep 10
    
    log_success "SeneMedecine est maintenant disponible !"
    echo ""
    echo "🌐 Frontend: http://localhost:3000"
    echo "🔧 Backend API: http://localhost:3001"
    echo "📚 Documentation API: http://localhost:3001/api"
    echo "🏥 Orthanc DICOM: http://localhost:8042"
    echo "🗄️  Adminer (DB): http://localhost:8080"
    echo "📧 MailHog: http://localhost:8025"
    echo ""
    echo "📋 Comptes de test:"
    echo "   Admin: admin@senemedecine.sn / admin123"
    echo "   Médecin: medecin@hopital-dakar.sn / medecin123"
    echo "   Secrétaire: secretaire@hopital-dakar.sn / secretaire123"
    echo ""
    echo "📊 Pour voir les logs: docker-compose logs -f"
}

# Démarrage en mode production
start_prod() {
    log_info "Démarrage de SeneMedecine en mode production..."
    
    setup_env
    
    log_warning "Assurez-vous d'avoir configuré les variables de production dans .env"
    log_warning "Appuyez sur Entrée pour continuer..."
    read
    
    log_info "Construction et démarrage des conteneurs..."
    docker-compose --profile production up --build -d
    
    log_info "Attente du démarrage des services..."
    sleep 15
    
    log_success "SeneMedecine est maintenant disponible en production !"
    echo ""
    echo "🌐 Application: http://localhost"
    echo "🔧 Backend API: http://localhost/api"
    echo "🏥 Orthanc DICOM: http://localhost:8042"
}

# Arrêt des services
stop_services() {
    log_info "Arrêt de SeneMedecine..."
    
    docker-compose -f docker-compose.yml -f docker-compose.dev.yml down
    docker-compose --profile production down
    
    log_success "Services arrêtés."
}

# Nettoyage complet
clean_all() {
    log_warning "Cette action va supprimer tous les conteneurs, volumes et images de SeneMedecine."
    log_warning "Êtes-vous sûr ? (y/N)"
    read -r response
    
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        log_info "Nettoyage en cours..."
        
        # Arrêter tous les services
        docker-compose -f docker-compose.yml -f docker-compose.dev.yml down -v --remove-orphans
        docker-compose --profile production down -v --remove-orphans
        
        # Supprimer les images
        docker images | grep senemedecine | awk '{print $3}' | xargs -r docker rmi -f
        
        # Supprimer les volumes orphelins
        docker volume prune -f
        
        log_success "Nettoyage terminé."
    else
        log_info "Nettoyage annulé."
    fi
}

# Afficher l'aide
show_help() {
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commandes disponibles:"
    echo "  dev     Démarrer en mode développement (par défaut)"
    echo "  prod    Démarrer en mode production"
    echo "  stop    Arrêter tous les services"
    echo "  clean   Nettoyer complètement (conteneurs, volumes, images)"
    echo "  help    Afficher cette aide"
    echo ""
    echo "Exemples:"
    echo "  $0 dev      # Démarrage développement"
    echo "  $0 prod     # Démarrage production"
    echo "  $0 stop     # Arrêt des services"
    echo "  $0 clean    # Nettoyage complet"
}

# Fonction principale
main() {
    check_docker
    
    case "${1:-dev}" in
        "dev")
            start_dev
            ;;
        "prod")
            start_prod
            ;;
        "stop")
            stop_services
            ;;
        "clean")
            clean_all
            ;;
        "help"|"-h"|"--help")
            show_help
            ;;
        *)
            log_error "Commande inconnue: $1"
            show_help
            exit 1
            ;;
    esac
}

# Exécuter la fonction principale avec tous les arguments
main "$@"

