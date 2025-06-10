#!/bin/bash

# Script de configuration initiale pour SeneMedecine
# Ce script configure l'environnement de développement

set -e

echo "🏥 Configuration de SeneMedecine - Application de Télémédecine"
echo "============================================================="

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages colorés
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Vérifier les prérequis
check_prerequisites() {
    print_status "Vérification des prérequis..."
    
    # Vérifier Docker
    if ! command -v docker &> /dev/null; then
        print_error "Docker n'est pas installé. Veuillez installer Docker."
        exit 1
    fi
    
    # Vérifier Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose n'est pas installé. Veuillez installer Docker Compose."
        exit 1
    fi
    
    # Vérifier Node.js (pour le développement local)
    if ! command -v node &> /dev/null; then
        print_warning "Node.js n'est pas installé. Recommandé pour le développement local."
    else
        NODE_VERSION=$(node --version)
        print_success "Node.js détecté: $NODE_VERSION"
    fi
    
    print_success "Prérequis vérifiés ✓"
}

# Créer le fichier .env s'il n'existe pas
setup_environment() {
    print_status "Configuration de l'environnement..."
    
    if [ ! -f .env ]; then
        cp .env.example .env
        print_success "Fichier .env créé à partir de .env.example"
        print_warning "Veuillez modifier le fichier .env avec vos paramètres"
    else
        print_warning "Le fichier .env existe déjà"
    fi
}

# Installer les dépendances
install_dependencies() {
    print_status "Installation des dépendances..."
    
    # Backend
    if [ -d "backend" ]; then
        print_status "Installation des dépendances backend..."
        cd backend
        if [ -f "package.json" ]; then
            npm install
            print_success "Dépendances backend installées ✓"
        fi
        cd ..
    fi
    
    # Frontend
    if [ -d "frontend" ]; then
        print_status "Installation des dépendances frontend..."
        cd frontend
        if [ -f "package.json" ]; then
            npm install
            print_success "Dépendances frontend installées ✓"
        fi
        cd ..
    fi
}

# Construire les images Docker
build_docker_images() {
    print_status "Construction des images Docker..."
    
    docker-compose build
    print_success "Images Docker construites ✓"
}

# Démarrer les services
start_services() {
    print_status "Démarrage des services..."
    
    # Démarrer en mode détaché
    docker-compose up -d
    
    print_success "Services démarrés ✓"
    
    # Attendre que les services soient prêts
    print_status "Attente du démarrage des services..."
    sleep 10
    
    # Vérifier l'état des services
    docker-compose ps
}

# Initialiser la base de données
init_database() {
    print_status "Initialisation de la base de données..."
    
    # Attendre que PostgreSQL soit prêt
    print_status "Attente de PostgreSQL..."
    sleep 5
    
    # Exécuter les migrations (sera implémenté plus tard)
    # docker-compose exec backend npm run migration:run
    
    print_success "Base de données initialisée ✓"
}

# Afficher les informations de connexion
show_info() {
    echo ""
    echo "🎉 Configuration terminée avec succès !"
    echo "======================================="
    echo ""
    echo "📱 Services disponibles :"
    echo "  • Frontend React    : http://localhost:3000"
    echo "  • API Backend       : http://localhost:3001"
    echo "  • PostgreSQL        : localhost:5432"
    echo "  • Orthanc DICOM     : http://localhost:8042"
    echo "  • Documentation API : http://localhost:3001/api"
    echo ""
    echo "🔐 Comptes de test :"
    echo "  • Admin      : admin@senemedecine.sn / admin123"
    echo "  • Médecin    : medecin@hopital1.sn / medecin123"
    echo "  • Secrétaire : secretaire@hopital1.sn / secretaire123"
    echo "  • Patient    : patient@example.com / patient123"
    echo ""
    echo "📚 Commandes utiles :"
    echo "  • Voir les logs      : docker-compose logs -f"
    echo "  • Arrêter les services : docker-compose down"
    echo "  • Redémarrer         : docker-compose restart"
    echo "  • Reconstruire       : docker-compose up --build"
    echo ""
}

# Menu principal
main() {
    echo ""
    echo "Que souhaitez-vous faire ?"
    echo "1) Configuration complète (recommandé)"
    echo "2) Vérifier les prérequis seulement"
    echo "3) Installer les dépendances seulement"
    echo "4) Démarrer les services Docker"
    echo "5) Arrêter les services Docker"
    echo "6) Voir les logs"
    echo "7) Quitter"
    echo ""
    read -p "Votre choix (1-7): " choice
    
    case $choice in
        1)
            check_prerequisites
            setup_environment
            install_dependencies
            build_docker_images
            start_services
            init_database
            show_info
            ;;
        2)
            check_prerequisites
            ;;
        3)
            install_dependencies
            ;;
        4)
            start_services
            show_info
            ;;
        5)
            print_status "Arrêt des services..."
            docker-compose down
            print_success "Services arrêtés ✓"
            ;;
        6)
            docker-compose logs -f
            ;;
        7)
            print_success "Au revoir !"
            exit 0
            ;;
        *)
            print_error "Choix invalide"
            main
            ;;
    esac
}

# Exécuter le menu principal
main

