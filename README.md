# 🏥 SeneMedecine - Application de Télémédecine

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10+-red.svg)](https://nestjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue.svg)](https://postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://docker.com/)

## 📋 Description

SeneMedecine est une application web complète de télémédecine et téléradiologie développée pour le Sénégal. Elle permet la gestion multi-hôpitaux avec un système d'authentification par rôles et l'intégration d'images DICOM via Orthanc.

### 🎯 Objectifs

- **Télémédecine** : Consultations à distance et gestion des dossiers médicaux
- **Téléradiologie** : Visualisation et analyse d'images DICOM
- **Multi-hôpitaux** : Gestion centralisée de plusieurs établissements
- **Sécurité** : Authentification robuste avec gestion des rôles
- **Portabilité** : Déploiement facile avec Docker

## 🏗️ Architecture

### Stack Technique

#### 🔵 Frontend
- **React 18** avec TypeScript
- **Tailwind CSS** pour le design responsive
- **CornerstoneJS** pour la visualisation DICOM
- **React Query** pour la gestion d'état
- **React Hook Form** pour les formulaires

#### 🟢 Backend
- **NestJS** (Node.js + TypeScript)
- **PostgreSQL** avec TypeORM
- **JWT** pour l'authentification
- **Swagger** pour la documentation API
- **Multer** pour l'upload de fichiers

#### 🟣 Base de données
- **PostgreSQL 15** avec extensions UUID et crypto
- **Architecture multi-tenant** (une base par hôpital)
- **Base centrale** pour la gestion globale

#### 🐳 Conteneurisation
- **Docker Compose** pour l'orchestration
- **Nginx** comme reverse proxy
- **Orthanc** pour le stockage DICOM
- **Redis** pour le cache (optionnel)

## 👥 Rôles et Permissions

### 🔴 Administrateur
- Gestion de tous les hôpitaux
- Gestion des utilisateurs
- Tableau de bord global
- Validation des rendez-vous

### 🔵 Médecin
- Accès aux patients assignés
- Création/consultation des dossiers médicaux
- Visualisation des images DICOM
- Prescription de médicaments

### 🟡 Secrétaire
- Création de patients
- Planification des rendez-vous
- Gestion de l'accueil
- Informations de base uniquement

### 🟢 Patient
- Consultation de son dossier médical
- Visualisation des rendez-vous
- Accès aux résultats d'examens

## 🚀 Installation et Démarrage

### Prérequis

- **Docker** et **Docker Compose**
- **Node.js 18+** (pour le développement local)
- **PostgreSQL 15+** (pour le développement local)

### 🐳 Démarrage avec Docker (Recommandé)

1. **Cloner le projet**
```bash
git clone https://github.com/votre-org/senemedecine-telemedicine.git
cd senemedecine-telemedicine
```

2. **Configurer l'environnement**
```bash
cp .env.example .env
# Éditer le fichier .env selon vos besoins
```

3. **Lancer l'application**
```bash
# Démarrage complet
docker-compose up -d

# Ou pour le développement avec logs
docker-compose up
```

4. **Accéder à l'application**
- **Frontend** : http://localhost:3000
- **Backend API** : http://localhost:3001
- **Documentation API** : http://localhost:3001/api
- **Orthanc** : http://localhost:8042

### 💻 Développement Local

#### Backend (NestJS)

```bash
cd backend
npm install
npm run start:dev
```

#### Frontend (React)

```bash
cd frontend
npm install
npm start
```

#### Base de données

```bash
# Démarrer PostgreSQL avec Docker
docker run -d \
  --name senemedecine-postgres \
  -e POSTGRES_DB=senemedecine_central \
  -e POSTGRES_USER=senemedecine \
  -e POSTGRES_PASSWORD=senemedecine123 \
  -p 5432:5432 \
  postgres:15-alpine

# Exécuter les migrations
cd backend
npm run migration:run
```

## 🔧 Configuration

### Variables d'environnement

Créez un fichier `.env` à la racine du projet :

```env
# Base de données
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=senemedecine
DATABASE_PASSWORD=senemedecine123
DATABASE_NAME=senemedecine_central

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=24h

# Orthanc
ORTHANC_URL=http://localhost:8042
ORTHANC_USERNAME=orthanc
ORTHANC_PASSWORD=orthanc

# Frontend
REACT_APP_API_URL=http://localhost:3001/api/v1
REACT_APP_ORTHANC_URL=http://localhost:8042
```

### Configuration Orthanc

Le fichier `orthanc/orthanc.json` contient la configuration du serveur DICOM. Les paramètres principaux :

- **Port HTTP** : 8042
- **Port DICOM** : 4242
- **Authentification** : Activée
- **CORS** : Configuré pour l'intégration web

## 📊 Fonctionnalités

### ✅ Implémentées

- [x] Authentification JWT avec rôles
- [x] Gestion multi-hôpitaux
- [x] Interface responsive en français
- [x] Tableaux de bord par rôle
- [x] Structure de base des entités
- [x] Configuration Docker complète
- [x] Documentation API Swagger

### 🚧 En développement

- [ ] Gestion complète des patients
- [ ] Système de rendez-vous
- [ ] Consultations médicales
- [ ] Intégration DICOM avec CornerstoneJS
- [ ] Prescriptions et médicaments
- [ ] Rapports et statistiques
- [ ] Notifications en temps réel
- [ ] Système de sauvegarde

### 🔮 Prévues

- [ ] Application mobile
- [ ] Téléconsultation vidéo
- [ ] IA pour l'aide au diagnostic
- [ ] Intégration avec les laboratoires
- [ ] Système de facturation
- [ ] API publique

## 🧪 Tests

### Backend

```bash
cd backend
npm run test          # Tests unitaires
npm run test:e2e      # Tests d'intégration
npm run test:cov      # Couverture de code
```

### Frontend

```bash
cd frontend
npm test              # Tests unitaires
npm run test:coverage # Couverture de code
```

## 📚 Documentation

### API

La documentation complète de l'API est disponible via Swagger :
- **Développement** : http://localhost:3001/api
- **Production** : https://votre-domaine.com/api

### Base de données

Le schéma de base de données est documenté dans `database/schema.md`.

### Architecture

L'architecture détaillée est disponible dans `docs/architecture.md`.

## 🔐 Sécurité

### Authentification

- **JWT** avec refresh tokens
- **Hachage bcrypt** pour les mots de passe
- **Validation** des entrées utilisateur
- **Rate limiting** sur les endpoints sensibles

### Autorisation

- **RBAC** (Role-Based Access Control)
- **Isolation** des données par hôpital
- **Validation** des permissions à chaque requête

### Données médicales

- **Chiffrement** des données sensibles
- **Audit trail** des accès aux dossiers
- **Conformité** RGPD et réglementations locales

## 🚀 Déploiement

### Production avec Docker

```bash
# Build et démarrage en production
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Avec SSL/TLS
docker-compose --profile production up -d
```

### Variables d'environnement de production

```env
NODE_ENV=production
JWT_SECRET=your-very-secure-production-secret
DATABASE_SSL=true
ORTHANC_PASSWORD=secure-orthanc-password
```

## 🤝 Contribution

1. **Fork** le projet
2. **Créer** une branche feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. **Commit** les changements (`git commit -am 'Ajout nouvelle fonctionnalité'`)
4. **Push** vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. **Créer** une Pull Request

### Standards de code

- **ESLint** et **Prettier** pour le formatage
- **Conventional Commits** pour les messages
- **Tests** obligatoires pour les nouvelles fonctionnalités
- **Documentation** mise à jour

## 📞 Support

### Comptes de test

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Admin | admin@senemedecine.sn | admin123 |
| Médecin | medecin@hopital1.sn | medecin123 |
| Secrétaire | secretaire@hopital1.sn | secretaire123 |
| Patient | patient@email.com | patient123 |

### Contact

- **Email** : support@senemedecine.sn
- **Documentation** : https://docs.senemedecine.sn
- **Issues** : https://github.com/votre-org/senemedecine-telemedicine/issues

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 🙏 Remerciements

- **Équipe de développement** SeneMedecine
- **Communauté open source** pour les outils utilisés
- **Professionnels de santé** pour leurs retours et conseils

---

**SeneMedecine** - Révolutionner la santé au Sénégal grâce à la technologie 🇸🇳

