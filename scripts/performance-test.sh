#!/bin/bash

# Script de tests de performance pour SeneMedecine
# Usage: ./performance-test.sh [type] [environment]

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
TEST_TYPE="${1:-load}"
ENVIRONMENT="${2:-local}"
RESULTS_DIR="performance/results"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# Configuration par environnement
case "$ENVIRONMENT" in
    "local")
        BASE_URL="http://localhost:3001"
        ;;
    "staging")
        BASE_URL="${STAGING_URL:-https://staging.senemedecine.sn}"
        ;;
    "production")
        BASE_URL="${PRODUCTION_URL:-https://senemedecine.sn}"
        ;;
    *)
        log_error "Environnement non supporté: $ENVIRONMENT"
        exit 1
        ;;
esac

# Vérifier si K6 est installé
check_k6() {
    if ! command -v k6 &> /dev/null; then
        log_error "K6 n'est pas installé"
        log_info "Installation: https://k6.io/docs/getting-started/installation/"
        exit 1
    fi
    
    log_success "K6 trouvé: $(k6 version)"
}

# Créer le répertoire de résultats
setup_results_dir() {
    mkdir -p "$RESULTS_DIR"
    log_info "Répertoire de résultats: $RESULTS_DIR"
}

# Vérifier que l'API est accessible
check_api_health() {
    log_info "Vérification de l'accessibilité de l'API: $BASE_URL"
    
    if curl -f -s "$BASE_URL/health" > /dev/null; then
        log_success "API accessible"
    else
        log_error "API non accessible à $BASE_URL"
        exit 1
    fi
}

# Exécuter les tests de performance
run_performance_tests() {
    local test_file="performance/k6-test.js"
    local output_file="$RESULTS_DIR/${TEST_TYPE}_${ENVIRONMENT}_${TIMESTAMP}"
    
    log_info "Exécution des tests de performance: $TEST_TYPE sur $ENVIRONMENT"
    log_info "Fichier de test: $test_file"
    log_info "Résultats: $output_file"
    
    # Options K6 selon le type de test
    local k6_options=""
    
    case "$TEST_TYPE" in
        "smoke")
            k6_options="--vus 1 --duration 30s"
            ;;
        "load")
            k6_options="--vus 10 --duration 5m"
            ;;
        "stress")
            k6_options="--vus 20 --duration 10m"
            ;;
        "spike")
            k6_options="--vus 50 --duration 2m"
            ;;
        "volume")
            k6_options="--vus 100 --duration 30m"
            ;;
        *)
            log_warning "Type de test non reconnu, utilisation des options par défaut"
            k6_options="--vus 10 --duration 5m"
            ;;
    esac
    
    # Exécuter K6 avec les options appropriées
    k6 run \
        $k6_options \
        --out json="${output_file}.json" \
        --out csv="${output_file}.csv" \
        --summary-export="${output_file}_summary.json" \
        -e BASE_URL="$BASE_URL" \
        -e TEST_TYPE="$TEST_TYPE" \
        "$test_file"
    
    log_success "Tests de performance terminés"
}

# Générer un rapport HTML
generate_html_report() {
    local summary_file="$RESULTS_DIR/${TEST_TYPE}_${ENVIRONMENT}_${TIMESTAMP}_summary.json"
    local html_file="$RESULTS_DIR/${TEST_TYPE}_${ENVIRONMENT}_${TIMESTAMP}_report.html"
    
    if [ -f "$summary_file" ]; then
        log_info "Génération du rapport HTML..."
        
        cat > "$html_file" << EOF
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rapport de Performance SeneMedecine - $TEST_TYPE</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { background: #2E8B57; color: white; padding: 20px; border-radius: 5px; }
        .metric { background: #f5f5f5; padding: 15px; margin: 10px 0; border-radius: 5px; }
        .success { color: #28a745; }
        .warning { color: #ffc107; }
        .error { color: #dc3545; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🚀 Rapport de Performance SeneMedecine</h1>
        <p><strong>Type:</strong> $TEST_TYPE | <strong>Environnement:</strong> $ENVIRONMENT | <strong>Date:</strong> $(date)</p>
        <p><strong>URL:</strong> $BASE_URL</p>
    </div>
    
    <div class="metric">
        <h2>📊 Résumé des Métriques</h2>
        <p>Les résultats détaillés sont disponibles dans les fichiers JSON et CSV.</p>
        <p><strong>Fichiers générés:</strong></p>
        <ul>
            <li>JSON: ${TEST_TYPE}_${ENVIRONMENT}_${TIMESTAMP}.json</li>
            <li>CSV: ${TEST_TYPE}_${ENVIRONMENT}_${TIMESTAMP}.csv</li>
            <li>Résumé: ${TEST_TYPE}_${ENVIRONMENT}_${TIMESTAMP}_summary.json</li>
        </ul>
    </div>
    
    <div class="metric">
        <h2>🎯 Objectifs de Performance</h2>
        <table>
            <tr><th>Métrique</th><th>Objectif</th><th>Description</th></tr>
            <tr><td>Temps de réponse (p95)</td><td>&lt; 500ms</td><td>95% des requêtes doivent être traitées en moins de 500ms</td></tr>
            <tr><td>Taux d'erreur</td><td>&lt; 1%</td><td>Moins de 1% des requêtes doivent échouer</td></tr>
            <tr><td>Disponibilité</td><td>&gt; 99.9%</td><td>Le service doit être disponible plus de 99.9% du temps</td></tr>
            <tr><td>Débit</td><td>&gt; 100 req/s</td><td>Le système doit supporter au moins 100 requêtes par seconde</td></tr>
        </table>
    </div>
    
    <div class="metric">
        <h2>📈 Recommandations</h2>
        <ul>
            <li>Analyser les requêtes les plus lentes dans les logs</li>
            <li>Vérifier l'utilisation des ressources (CPU, mémoire, base de données)</li>
            <li>Optimiser les requêtes SQL si nécessaire</li>
            <li>Considérer la mise en cache pour les données fréquemment accédées</li>
            <li>Surveiller les métriques en continu avec Prometheus/Grafana</li>
        </ul>
    </div>
    
    <div class="metric">
        <h2>🔗 Liens Utiles</h2>
        <ul>
            <li><a href="$BASE_URL/health">Health Check</a></li>
            <li><a href="$BASE_URL/api">Documentation API</a></li>
            <li><a href="https://k6.io/docs/">Documentation K6</a></li>
        </ul>
    </div>
</body>
</html>
EOF
        
        log_success "Rapport HTML généré: $html_file"
    else
        log_warning "Fichier de résumé non trouvé, rapport HTML non généré"
    fi
}

# Analyser les résultats
analyze_results() {
    local json_file="$RESULTS_DIR/${TEST_TYPE}_${ENVIRONMENT}_${TIMESTAMP}.json"
    
    if [ -f "$json_file" ]; then
        log_info "Analyse des résultats..."
        
        # Extraire quelques métriques clés (nécessite jq)
        if command -v jq &> /dev/null; then
            local avg_duration=$(jq -r '.metrics.http_req_duration.values.avg' "$json_file" 2>/dev/null || echo "N/A")
            local p95_duration=$(jq -r '.metrics.http_req_duration.values["p(95)"]' "$json_file" 2>/dev/null || echo "N/A")
            local error_rate=$(jq -r '.metrics.http_req_failed.values.rate' "$json_file" 2>/dev/null || echo "N/A")
            
            echo ""
            echo "📊 Métriques Clés:"
            echo "  Temps de réponse moyen: ${avg_duration}ms"
            echo "  Temps de réponse p95: ${p95_duration}ms"
            echo "  Taux d'erreur: ${error_rate}%"
            echo ""
        else
            log_warning "jq non installé, analyse détaillée non disponible"
        fi
    else
        log_warning "Fichier de résultats non trouvé"
    fi
}

# Nettoyer les anciens résultats
cleanup_old_results() {
    log_info "Nettoyage des anciens résultats (> 30 jours)..."
    find "$RESULTS_DIR" -name "*.json" -o -name "*.csv" -o -name "*.html" | \
        xargs ls -la | \
        awk '$6 " " $7 " " $8 < "'$(date -d '30 days ago' '+%b %d %H:%M')'"' | \
        awk '{print $9}' | \
        xargs rm -f 2>/dev/null || true
    
    log_success "Nettoyage terminé"
}

# Afficher l'aide
show_help() {
    echo "Usage: $0 [type] [environment]"
    echo ""
    echo "Types de test:"
    echo "  smoke       Test de fumée (1 utilisateur, 30s)"
    echo "  load        Test de charge (10 utilisateurs, 5min)"
    echo "  stress      Test de stress (20 utilisateurs, 10min)"
    echo "  spike       Test de pic (50 utilisateurs, 2min)"
    echo "  volume      Test de volume (100 utilisateurs, 30min)"
    echo ""
    echo "Environnements:"
    echo "  local       http://localhost:3001"
    echo "  staging     URL de staging"
    echo "  production  URL de production"
    echo ""
    echo "Exemples:"
    echo "  $0 load local        # Test de charge en local"
    echo "  $0 stress staging    # Test de stress en staging"
    echo "  $0 smoke production  # Test de fumée en production"
}

# Fonction principale
main() {
    echo "🔥 Tests de Performance SeneMedecine"
    echo "===================================="
    echo "Type: $TEST_TYPE"
    echo "Environnement: $ENVIRONMENT"
    echo "URL: $BASE_URL"
    echo ""
    
    local start_time=$(date +%s)
    
    # Exécution des étapes
    check_k6
    setup_results_dir
    check_api_health
    run_performance_tests
    analyze_results
    generate_html_report
    cleanup_old_results
    
    local end_time=$(date +%s)
    local duration=$((end_time - start_time))
    
    log_success "✅ Tests de performance terminés en ${duration}s"
    echo ""
    echo "📁 Résultats disponibles dans: $RESULTS_DIR"
    echo "🌐 Ouvrir le rapport: $RESULTS_DIR/${TEST_TYPE}_${ENVIRONMENT}_${TIMESTAMP}_report.html"
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

