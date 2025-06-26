#!/bin/bash

echo "🚀 Configuration du backend SeneMedecine..."

# Vérifier si Node.js est installé
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

# Vérifier si npm est installé
if ! command -v npm &> /dev/null; then
    echo "❌ npm n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

echo "✅ Node.js et npm sont installés"

# Installer les dépendances
echo "📦 Installation des dépendances..."
npm install

# Créer le fichier .env s'il n'existe pas
if [ ! -f .env ]; then
    echo "🔧 Création du fichier .env..."
    cp env.example .env
    echo "✅ Fichier .env créé. Veuillez le configurer avec vos paramètres."
else
    echo "✅ Fichier .env existe déjà"
fi

# Créer le dossier uploads
if [ ! -d uploads ]; then
    echo "📁 Création du dossier uploads..."
    mkdir uploads
    echo "✅ Dossier uploads créé"
else
    echo "✅ Dossier uploads existe déjà"
fi

echo ""
echo "🎉 Configuration terminée !"
echo ""
echo "📋 Prochaines étapes :"
echo "1. Configurer le fichier .env avec vos paramètres de base de données"
echo "2. Créer la base de données PostgreSQL : CREATE DATABASE senemedecine;"
echo "3. Exécuter les migrations : npm run migrate"
echo "4. Insérer les données de test : npm run seed"
echo "5. Démarrer le serveur : npm run dev"
echo ""
echo "🔗 Documentation : README.md" 