# Architecture SeneMedecine

## Vue d'ensemble

SeneMedecine est une application de télémédecine moderne construite avec une architecture microservices containerisée. L'application suit les principes de l'architecture hexagonale et utilise des technologies éprouvées pour garantir la scalabilité, la sécurité et la maintenabilité.

## Architecture Générale

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│                 │    │                 │    │                 │
│   Frontend      │    │   Backend       │    │   Base de       │
│   React/TS      │◄──►│   NestJS/TS     │◄──►│   Données       │
│                 │    │                 │    │   PostgreSQL    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│                 │    │                 │    │                 │
│   Nginx         │    │   Orthanc       │    │   Redis         │
│   Reverse Proxy │    │   DICOM Server  │    │   Cache         │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Composants Principaux

### 1. Frontend (React + TypeScript)

**Technologies:**
- React 18 avec TypeScript
- Tailwind CSS pour le styling
- React Query pour la gestion d'état
- React Hook Form pour les formulaires
- CornerstoneJS pour la visualisation DICOM

**Responsabilités:**
- Interface utilisateur responsive
- Authentification et gestion des sessions
- Visualisation des données médicales
- Affichage des images DICOM
- Navigation basée sur les rôles

**Structure:**
```
frontend/
├── src/
│   ├── components/     # Composants réutilisables
│   ├── pages/         # Pages de l'application
│   ├── contexts/      # Contextes React
│   ├── services/      # Services API
│   ├── types/         # Types TypeScript
│   ├── utils/         # Utilitaires
│   └── styles/        # Styles globaux
```

### 2. Backend (NestJS + TypeScript)

**Technologies:**
- NestJS avec TypeScript
- TypeORM pour l'ORM
- JWT pour l'authentification
- Swagger pour la documentation API
- Multer pour l'upload de fichiers

**Responsabilités:**
- API REST sécurisée
- Authentification et autorisation
- Gestion des données médicales
- Intégration avec Orthanc
- Gestion multi-tenant

**Structure:**
```
backend/
├── src/
│   ├── modules/       # Modules fonctionnels
│   ├── entities/      # Entités de base de données
│   ├── dto/          # Data Transfer Objects
│   ├── guards/       # Guards d'authentification
│   ├── decorators/   # Décorateurs personnalisés
│   ├── filters/      # Filtres d'exception
│   └── utils/        # Utilitaires
```

### 3. Base de Données (PostgreSQL)

**Architecture Multi-Tenant:**
- Base centrale pour la gestion globale
- Une base par hôpital pour l'isolation des données
- Extensions UUID et crypto pour la sécurité

**Bases de données:**
- `senemedecine_central` : Gestion globale
- `hopital_dakar` : Données Hôpital de Dakar
- `hopital_thies` : Données Hôpital de Thiès
- `hopital_saint_louis` : Données Hôpital de Saint-Louis

### 4. Serveur DICOM (Orthanc)

**Responsabilités:**
- Stockage des images DICOM
- API REST pour l'accès aux images
- Conformité aux standards DICOM
- Intégration avec le backend

### 5. Cache (Redis)

**Utilisation:**
- Cache des sessions utilisateur
- Cache des requêtes fréquentes
- Stockage temporaire des données

### 6. Reverse Proxy (Nginx)

**Responsabilités:**
- Routage des requêtes
- Terminaison SSL/TLS
- Compression et cache statique
- Load balancing (si nécessaire)

## Patterns Architecturaux

### 1. Architecture Hexagonale

Le backend suit l'architecture hexagonale (ports et adaptateurs) :

```
┌─────────────────────────────────────┐
│           Application Core          │
│  ┌─────────────────────────────┐   │
│  │        Domain Logic         │   │
│  │     (Business Rules)        │   │
│  └─────────────────────────────┘   │
│              │                     │
│  ┌─────────────────────────────┐   │
│  │        Ports               │   │
│  │    (Interfaces)            │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
              │
┌─────────────────────────────────────┐
│           Adapters                  │
│  ┌─────────┐  ┌─────────┐  ┌──────┐ │
│  │   Web   │  │Database │  │DICOM │ │
│  │Adapter  │  │Adapter  │  │Adapt.│ │
│  └─────────┘  └─────────┘  └──────┘ │
└─────────────────────────────────────┘
```

### 2. CQRS (Command Query Responsibility Segregation)

Séparation des opérations de lecture et d'écriture :

```
Commands (Write) ──► Command Handlers ──► Domain Models ──► Database
                                                              │
Queries (Read) ────► Query Handlers ──────► Read Models ◄────┘
```

### 3. Multi-Tenant Architecture

Isolation des données par hôpital :

```
Request ──► Tenant Resolution ──► Database Selection ──► Data Access
    │              │                      │                  │
    └─► Hospital ID ┴─► Database Router ──┴─► Tenant DB ◄────┘
```

## Sécurité

### 1. Authentification

- **JWT** avec refresh tokens
- **Hachage bcrypt** pour les mots de passe
- **Sessions sécurisées** avec expiration

### 2. Autorisation

- **RBAC** (Role-Based Access Control)
- **Guards NestJS** pour la protection des routes
- **Décorateurs personnalisés** pour les permissions

### 3. Protection des Données

- **Chiffrement** des données sensibles
- **Validation** des entrées utilisateur
- **Audit trail** des accès aux dossiers
- **Isolation** des données par hôpital

### 4. Sécurité Réseau

- **HTTPS** obligatoire en production
- **CORS** configuré strictement
- **Rate limiting** sur les endpoints sensibles
- **Headers de sécurité** via Nginx

## Scalabilité

### 1. Scalabilité Horizontale

- **Containerisation** avec Docker
- **Load balancing** via Nginx
- **Clustering** Node.js possible
- **Réplication** PostgreSQL

### 2. Optimisations

- **Cache Redis** pour les données fréquentes
- **Compression** des réponses HTTP
- **Optimisation** des requêtes SQL
- **CDN** pour les assets statiques

## Monitoring et Observabilité

### 1. Logs

- **Logs structurés** avec Winston
- **Rotation** automatique des logs
- **Niveaux** configurables (debug, info, warn, error)

### 2. Métriques

- **Prometheus** pour la collecte
- **Grafana** pour la visualisation
- **Alertes** automatiques

### 3. Health Checks

- **Endpoints** de santé pour chaque service
- **Monitoring** de la connectivité
- **Alertes** en cas de panne

## Déploiement

### 1. Environnements

- **Développement** : Docker Compose local
- **Test** : Pipeline CI/CD
- **Production** : Docker Swarm ou Kubernetes

### 2. CI/CD Pipeline

```
Code Push ──► Tests ──► Build ──► Deploy ──► Monitor
    │           │        │         │         │
    └─► Lint ───┴─► Unit ┴─► Docker ┴─► Prod ──┘
```

### 3. Sauvegarde et Récupération

- **Sauvegardes** automatiques PostgreSQL
- **Réplication** des données critiques
- **Procédures** de récupération documentées

## Performance

### 1. Optimisations Backend

- **Connection pooling** PostgreSQL
- **Cache** des requêtes fréquentes
- **Pagination** des résultats
- **Indexation** optimisée

### 2. Optimisations Frontend

- **Code splitting** React
- **Lazy loading** des composants
- **Optimisation** des images
- **Service Worker** pour le cache

### 3. Optimisations Base de Données

- **Index** sur les colonnes fréquemment utilisées
- **Partitioning** des grandes tables
- **Vacuum** automatique
- **Statistiques** à jour

## Évolutions Futures

### 1. Fonctionnalités

- **Application mobile** React Native
- **Téléconsultation** vidéo WebRTC
- **IA** pour l'aide au diagnostic
- **API publique** pour les intégrations

### 2. Architecture

- **Microservices** complets
- **Event sourcing** pour l'audit
- **GraphQL** en complément REST
- **Kubernetes** pour l'orchestration

### 3. Technologies

- **WebAssembly** pour les calculs intensifs
- **Progressive Web App** pour l'offline
- **Machine Learning** pour l'analyse d'images
- **Blockchain** pour la traçabilité

