#!/bin/bash

# Script de validation du code pour SeneMedecine
# Ce script vérifie la qualité du code avant les commits

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

# Variables
BACKEND_DIR="backend"
FRONTEND_DIR="frontend"
ERRORS=0

# Fonction pour vérifier si une commande existe
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Fonction pour exécuter une commande et capturer les erreurs
run_check() {
    local name="$1"
    local command="$2"
    local dir="$3"
    
    log_info "Exécution de $name..."
    
    if [ -n "$dir" ]; then
        cd "$dir"
    fi
    
    if eval "$command"; then
        log_success "$name réussi"
    else
        log_error "$name échoué"
        ERRORS=$((ERRORS + 1))
    fi
    
    if [ -n "$dir" ]; then
        cd - > /dev/null
    fi
}

# Vérification des prérequis
check_prerequisites() {
    log_info "Vérification des prérequis..."
    
    if ! command_exists node; then
        log_error "Node.js n'est pas installé"
        exit 1
    fi
    
    if ! command_exists npm; then
        log_error "npm n'est pas installé"
        exit 1
    fi
    
    log_success "Prérequis vérifiés"
}

# Installation des dépendances si nécessaire
install_dependencies() {
    log_info "Vérification des dépendances..."
    
    # Backend
    if [ ! -d "$BACKEND_DIR/node_modules" ]; then
        log_info "Installation des dépendances backend..."
        cd "$BACKEND_DIR"
        npm ci
        cd ..
    fi
    
    # Frontend
    if [ ! -d "$FRONTEND_DIR/node_modules" ]; then
        log_info "Installation des dépendances frontend..."
        cd "$FRONTEND_DIR"
        npm ci
        cd ..
    fi
    
    log_success "Dépendances vérifiées"
}

# Validation du code TypeScript
validate_typescript() {
    log_info "=== VALIDATION TYPESCRIPT ==="
    
    # Backend TypeScript
    run_check "TypeScript Backend" "npm run build" "$BACKEND_DIR"
    
    # Frontend TypeScript
    run_check "TypeScript Frontend" "npm run build" "$FRONTEND_DIR"
}

# Validation ESLint
validate_eslint() {
    log_info "=== VALIDATION ESLINT ==="
    
    # Backend ESLint
    run_check "ESLint Backend" "npm run lint" "$BACKEND_DIR"
    
    # Frontend ESLint
    run_check "ESLint Frontend" "npm run lint" "$FRONTEND_DIR"
}

# Validation Prettier
validate_prettier() {
    log_info "=== VALIDATION PRETTIER ==="
    
    # Backend Prettier
    run_check "Prettier Backend" "npm run format:check" "$BACKEND_DIR"
    
    # Frontend Prettier
    run_check "Prettier Frontend" "npm run format:check" "$FRONTEND_DIR"
}

# Exécution des tests
run_tests() {
    log_info "=== EXÉCUTION DES TESTS ==="
    
    # Tests Backend
    run_check "Tests Backend" "npm run test" "$BACKEND_DIR"
    
    # Tests Frontend
    run_check "Tests Frontend" "npm run test -- --watchAll=false" "$FRONTEND_DIR"
}

# Vérification de la sécurité
security_audit() {
    log_info "=== AUDIT DE SÉCURITÉ ==="
    
    # Audit Backend
    run_check "Audit Sécurité Backend" "npm audit --audit-level moderate" "$BACKEND_DIR"
    
    # Audit Frontend
    run_check "Audit Sécurité Frontend" "npm audit --audit-level moderate" "$FRONTEND_DIR"
}

# Vérification des fichiers Docker
validate_docker() {
    log_info "=== VALIDATION DOCKER ==="
    
    if command_exists docker; then
        # Validation du docker-compose
        run_check "Docker Compose Validation" "docker-compose config" ""
        
        # Validation des Dockerfiles
        if command_exists hadolint; then
            run_check "Dockerfile Backend" "hadolint backend/Dockerfile" ""
            run_check "Dockerfile Frontend" "hadolint frontend/Dockerfile" ""
        else
            log_warning "hadolint non installé, validation Dockerfile ignorée"
        fi
    else
        log_warning "Docker non installé, validation Docker ignorée"
    fi
}

# Vérification de la documentation
validate_documentation() {
    log_info "=== VALIDATION DOCUMENTATION ==="
    
    # Vérifier que les fichiers README existent
    local required_docs=("README.md" "docs/api.md" "docs/architecture.md" "CONTRIBUTING.md")
    
    for doc in "${required_docs[@]}"; do
        if [ -f "$doc" ]; then
            log_success "Documentation trouvée: $doc"
        else
            log_error "Documentation manquante: $doc"
            ERRORS=$((ERRORS + 1))
        fi
    done
}

# Vérification des variables d'environnement
validate_env() {
    log_info "=== VALIDATION ENVIRONNEMENT ==="
    
    if [ -f ".env.example" ]; then
        log_success "Fichier .env.example trouvé"
    else
        log_error "Fichier .env.example manquant"
        ERRORS=$((ERRORS + 1))
    fi
    
    if [ -f ".env" ]; then
        log_warning "Fichier .env présent (ne devrait pas être commité)"
    fi
}

# Fonction principale
main() {
    echo "🔍 Validation du code SeneMedecine"
    echo "=================================="
    
    local start_time=$(date +%s)
    
    # Vérifications
    check_prerequisites
    install_dependencies
    
    # Validation selon les arguments
    case "${1:-all}" in
        "typescript"|"ts")
            validate_typescript
            ;;
        "lint")
            validate_eslint
            ;;
        "format")
            validate_prettier
            ;;
        "test")
            run_tests
            ;;
        "security")
            security_audit
            ;;
        "docker")
            validate_docker
            ;;
        "docs")
            validate_documentation
            ;;
        "env")
            validate_env
            ;;
        "quick")
            validate_typescript
            validate_eslint
            ;;
        "all"|*)
            validate_typescript
            validate_eslint
            validate_prettier
            run_tests
            security_audit
            validate_docker
            validate_documentation
            validate_env
            ;;
    esac
    
    local end_time=$(date +%s)
    local duration=$((end_time - start_time))
    
    echo ""
    echo "=================================="
    
    if [ $ERRORS -eq 0 ]; then
        log_success "✅ Toutes les validations ont réussi ! (${duration}s)"
        exit 0
    else
        log_error "❌ $ERRORS validation(s) ont échoué ! (${duration}s)"
        exit 1
    fi
}

# Afficher l'aide
show_help() {
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commandes disponibles:"
    echo "  all         Toutes les validations (par défaut)"
    echo "  quick       Validations rapides (TypeScript + ESLint)"
    echo "  typescript  Validation TypeScript uniquement"
    echo "  lint        Validation ESLint uniquement"
    echo "  format      Validation Prettier uniquement"
    echo "  test        Tests uniquement"
    echo "  security    Audit de sécurité uniquement"
    echo "  docker      Validation Docker uniquement"
    echo "  docs        Validation documentation uniquement"
    echo "  env         Validation environnement uniquement"
    echo "  help        Afficher cette aide"
    echo ""
    echo "Exemples:"
    echo "  $0              # Toutes les validations"
    echo "  $0 quick        # Validations rapides"
    echo "  $0 test         # Tests uniquement"
}

# Gestion des arguments
if [ "$1" = "help" ] || [ "$1" = "-h" ] || [ "$1" = "--help" ]; then
    show_help
    exit 0
fi

# Exécuter la fonction principale
main "$@"

