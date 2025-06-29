# SeneMedecine - Application de Télémedecine

## ⚡️ Lancement ultra-rapide avec Docker Compose

Vous pouvez lancer toute la stack (base de données, backend, frontend, Orthanc DICOM) en une seule commande :

```bash
git clone https://github.com/Tening2283/senemedecine-telemedicine.git
cd "senemedecine-telemedicine"
docker-compose up --build
```

- **Frontend** : http://localhost
- **Backend API** : http://localhost:3001/api
- **Orthanc DICOM** : http://localhost:8042 (admin / admin)
- **PostgreSQL** : localhost:5432 (user: postgres, password: azerty, db: senemedecine)

**Astuce** : La première initialisation peut prendre 1-2 minutes (installation, migrations, seeds). Attendez que tous les services soient "healthy". Pour voir les logs :
```bash
docker-compose logs -f
```

**Pour tout arrêter** :
```bash
docker-compose down
```

**Pour réinitialiser la base** (⚠️ supprime toutes les données) :
```bash
docker-compose down -v
```

---

Application complète de télémedecine développée avec React/TypeScript (frontend) et Node.js/Express/PostgreSQL (backend).

## 🏥 Vue d'ensemble

SeneMedecine est une plateforme de télémedecine moderne qui permet la gestion complète des établissements de santé, des patients, des consultations médicales et des rendez-vous. L'application supporte également la visualisation d'images DICOM pour les examens radiologiques.

## 🏗️ Architecture

```
senemedecine-telemedicine/
├── project/          # Frontend React/TypeScript
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── contexts/
│   │   ├── services/
│   │   └── types/
│   └── package.json
├── backend/          # Backend Node.js/Express
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── database/
│   │   └── types/
│   └── package.json
└── README.md
```

## 🚀 Fonctionnalités principales

### 🔐 Authentification et autorisation
- **JWT** pour l'authentification sécurisée
- **Gestion des rôles** : ADMIN, MEDECIN, SECRETAIRE, PATIENT
- **Autorisation par hôpital** pour la sécurité des données

### 🏥 Gestion des établissements
- **CRUD complet** des hôpitaux
- **Gestion des utilisateurs** par établissement
- **Statistiques** par hôpital

### 👥 Gestion des patients
- **Fiches patients** complètes
- **Historique médical**
- **Médecin référent**
- **Numéros de patient** uniques

### 🩺 Consultations médicales
- **Consultations** avec motifs et diagnostics
- **Prescriptions** de médicaments
- **Images DICOM** pour examens radiologiques
- **Statuts** : PROGRAMMEE, EN_COURS, TERMINEE, ANNULEE

### 📅 Rendez-vous
- **Planification** des rendez-vous
- **Statuts** : CONFIRME, EN_ATTENTE, ANNULE
- **Gestion des conflits** d'horaires

### 📊 Tableaux de bord
- **Statistiques** en temps réel
- **Graphiques** interactifs
- **Métriques** de performance

## 🛠️ Technologies utilisées

### Frontend
- **React 18** - Framework frontend
- **TypeScript** - Typage statique
- **Vite** - Build tool et dev server
- **Tailwind CSS** - Framework CSS
- **React Router** - Navigation
- **Lucide React** - Icônes
- **Cornerstone** - Visualisation DICOM
- **Recharts** - Graphiques
- **React Hook Form** - Gestion des formulaires

### Backend
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **TypeScript** - Typage statique
- **PostgreSQL** - Base de données
- **Knex.js** - Query builder
- **JWT** - Authentification
- **bcrypt** - Hachage des mots de passe
- **Helmet** - Sécurité
- **CORS** - Cross-origin resource sharing
- **Morgan** - Logging

## 📋 Prérequis

- **Docker** et **Docker Compose** (recommandé)
- (Optionnel) **Node.js** (v18+), **PostgreSQL** (v12+), **npm** ou **yarn** si vous souhaitez lancer sans Docker

## 🚀 Installation rapide (mode manuel, sans Docker Compose)

### 1. Cloner le projet
```bash
git clone https://github.com/Tening2283/senemedecine-telemedicine.git
cd senemedecine-telemedicine
```

### 2. Configuration du backend
```bash
cd backend
npm install
cp env.example .env
# Éditer .env avec vos paramètres de base de données (voir ci-dessous)
npm run migrate
npm run seed
npm run dev
```

### 3. Configuration du frontend
```bash
cd ../project
npm install
cp env.example .env
# Éditer .env avec l'URL de l'API backend
npm run dev
```

### 4. Accès à l'application
- **Frontend** : http://localhost:5173
- **Backend API** : http://localhost:3001
- **Health Check** : http://localhost:3001/health

## 🔐 Comptes de test

### Administrateur
- **Email** : `admin@senemedecine.sn`
- **Mot de passe** : `password123`
- **Rôle** : ADMIN
- **Accès** : Tous les hôpitaux

### Médecin
- **Email** : `dr.fall@hopital-dakar.sn`
- **Mot de passe** : `password123`
- **Rôle** : MEDECIN
- **Hôpital** : Hôpital Principal de Dakar

### Secrétaire
- **Email** : `sec.ndiaye@hopital-dakar.sn`
- **Mot de passe** : `password123`
- **Rôle** : SECRETAIRE
- **Hôpital** : Hôpital Principal de Dakar

## 📚 Documentation

- [Documentation Backend](./backend/README.md)
- [Documentation Frontend](./project/README.md)
- [API Endpoints](./backend/README.md#api-endpoints)

## 🔧 Configuration (variables d'environnement)

### Backend (Docker Compose)
```env
DB_HOST=postgres
DB_PORT=5432
DB_NAME=senemedecine
DB_USER=postgres
DB_PASSWORD=azerty
JWT_SECRET=1a8f5@E!xZ7#Mpl9dT$Qr3KjL0cVx&uF
CORS_ORIGIN=http://localhost
PORT=3001
```

### Frontend (Docker Compose)
```env
VITE_API_URL=http://localhost:3001/api
VITE_APP_NAME=SeneMedecine
VITE_APP_VERSION=1.0.0
```

## 🗄️ Base de données

### Tables principales
- `hopitaux` - Informations des hôpitaux
- `users` - Utilisateurs du système
- `patients` - Patients
- `consultations` - Consultations médicales
- `medicaments` - Médicaments
- `consultation_medicaments` - Relation consultation-médicaments
- `rendez_vous` - Rendez-vous
- `images_dicom` - Images DICOM

## 🚨 Sécurité

- **JWT** pour l'authentification
- **bcrypt** pour le hachage des mots de passe
- **Helmet** pour les en-têtes de sécurité
- **CORS** configuré
- **Rate limiting** pour prévenir les abus
- **Validation** des données côté client et serveur

## 🧪 Tests

### Backend
```bash
cd backend
npm test
```

### Frontend
```bash
cd project
npm test
```

## 📦 Déploiement

### Backend
```bash
cd backend
npm run build
npm start
```

### Frontend
```bash
cd project
npm run build
# Servir le contenu de dist/ sur votre serveur web
```

## 🔄 Scripts utiles

### Backend
- `npm run dev` - Mode développement
- `npm run build` - Build de production
- `npm run migrate` - Exécuter les migrations
- `npm run seed` - Insérer les données de test

### Frontend
- `npm run dev` - Mode développement
- `npm run build` - Build de production
- `npm run preview` - Prévisualisation du build

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🆘 Support

Pour toute question ou problème :
- Consulter la documentation dans les dossiers `backend/` et `project/`
- Vérifier les logs du serveur et du navigateur
- Ouvrir une issue sur GitHub
- Contacter l'équipe de développement

## 🔮 Roadmap

- [ ] **Notifications** en temps réel
- [ ] **Vidéoconférence** intégrée
- [ ] **Mobile app** React Native
- [ ] **Backup** automatique des données
- [ ] **Audit trail** complet

---

**SeneMedecine** - Révolutionner la santé au Sénégal 🇸🇳 
