# SeneMedecine Frontend

Application frontend de télémedecine développée avec React, TypeScript et Tailwind CSS.

## 🚀 Fonctionnalités

- **Interface moderne** avec Tailwind CSS
- **Authentification** avec gestion des rôles
- **Gestion des hôpitaux** (ADMIN)
- **Gestion des patients**
- **Consultations médicales**
- **Rendez-vous**
- **Visualisation DICOM** avec Cornerstone
- **Statistiques et tableaux de bord**
- **Responsive design**

## 📋 Prérequis

- Node.js (v18 ou supérieur)
- npm ou yarn
- Backend SeneMedecine en cours d'exécution

## 🛠️ Installation

1. **Cloner le projet**
```bash
git clone <repository-url>
cd project
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configuration de l'environnement**
```bash
cp env.example .env
```

Éditer le fichier `.env` :
```env
# Configuration de l'API backend
VITE_API_URL=http://localhost:3001/api

# Configuration de l'application
VITE_APP_NAME=SeneMedecine
VITE_APP_VERSION=1.0.0
```

4. **Démarrer le serveur de développement**
```bash
npm run dev
```

## 🔗 Configuration avec le Backend

Cette application frontend nécessite le backend SeneMedecine pour fonctionner correctement.

### Étapes de configuration :

1. **Démarrer le backend**
```bash
cd ../backend
npm install
cp env.example .env
# Configurer .env avec vos paramètres de base de données
npm run migrate
npm run seed
npm run dev
```

2. **Vérifier la connexion**
- Le backend doit être accessible sur `http://localhost:3001`
- L'API doit répondre sur `http://localhost:3001/api`

3. **Tester l'authentification**
- Utiliser les identifiants de test :
  - Email: `admin@senemedecine.sn`
  - Mot de passe: `password123`
  - Hôpital: Sélectionner un hôpital dans la liste

## 🏥 Comptes de test

### Administrateur
- **Email**: `admin@senemedecine.sn`
- **Mot de passe**: `password123`
- **Rôle**: ADMIN
- **Accès**: Tous les hôpitaux

### Médecin
- **Email**: `dr.fall@hopital-dakar.sn`
- **Mot de passe**: `password123`
- **Rôle**: MEDECIN
- **Hôpital**: Hôpital Principal de Dakar
- **Spécialité**: Cardiologie

### Secrétaire
- **Email**: `sec.ndiaye@hopital-dakar.sn`
- **Mot de passe**: `password123`
- **Rôle**: SECRETAIRE
- **Hôpital**: Hôpital Principal de Dakar

### Patient
- **Email**: `patient.sow@email.sn`
- **Mot de passe**: `password123`
- **Rôle**: PATIENT
- **Hôpital**: Hôpital Principal de Dakar

## 📱 Pages disponibles

- **Dashboard** - Vue d'ensemble avec statistiques
- **Hôpitaux** - Gestion des établissements (ADMIN)
- **Patients** - Gestion des patients
- **Consultations** - Consultations médicales
- **Rendez-vous** - Gestion des rendez-vous
- **DICOM** - Visualisation d'images médicales
- **Statistiques** - Rapports et analyses
- **Utilisateurs** - Gestion des utilisateurs (ADMIN)

## 🎨 Technologies utilisées

- **React 18** - Framework frontend
- **TypeScript** - Typage statique
- **Vite** - Build tool et dev server
- **Tailwind CSS** - Framework CSS
- **React Router** - Navigation
- **Lucide React** - Icônes
- **Cornerstone** - Visualisation DICOM
- **Recharts** - Graphiques
- **React Hook Form** - Gestion des formulaires

## 🚀 Scripts disponibles

- `npm run dev` - Démarrage en mode développement
- `npm run build` - Build de production
- `npm run preview` - Prévisualisation du build
- `npm run lint` - Vérification du code

## 🔧 Configuration avancée

### Variables d'environnement

- `VITE_API_URL` - URL de l'API backend
- `VITE_APP_NAME` - Nom de l'application
- `VITE_APP_VERSION` - Version de l'application

### Personnalisation

- **Thème** : Modifier `tailwind.config.js`
- **Routes** : Configurer dans `src/App.tsx`
- **API** : Modifier `src/services/api.ts`

## 🧪 Tests

```bash
npm test
```

## 📦 Build de production

```bash
npm run build
```

Le build sera généré dans le dossier `dist/`.

## 🔄 Déploiement

1. **Build de production**
```bash
npm run build
```

2. **Servir les fichiers statiques**
```bash
npm run preview
```

3. **Déployer sur un serveur web**
- Copier le contenu de `dist/` sur votre serveur
- Configurer le serveur pour servir `index.html` pour toutes les routes
- S'assurer que l'API backend est accessible

## 🚨 Sécurité

- **CORS** configuré côté backend
- **JWT** pour l'authentification
- **Validation** des données côté client et serveur
- **HTTPS** recommandé en production

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature
3. Commit les changements
4. Push vers la branche
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT.

## 🆘 Support

Pour toute question :
- Vérifier que le backend est démarré
- Consulter les logs du navigateur (F12)
- Vérifier la configuration de l'API dans `.env`
- Contacter l'équipe de développement 