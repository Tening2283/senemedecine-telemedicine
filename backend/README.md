# SeneMedecine Backend

Backend API pour l'application de télémedecine SeneMedecine, développé avec Node.js, Express, TypeScript et PostgreSQL.

## 🚀 Fonctionnalités

- **Authentification JWT** avec gestion des rôles (ADMIN, MEDECIN, SECRETAIRE, PATIENT)
- **Gestion des hôpitaux** (CRUD complet)
- **Gestion des patients** (CRUD complet)
- **Consultations médicales** avec prescriptions
- **Rendez-vous** avec statuts
- **Images DICOM** pour les examens radiologiques
- **Sécurité renforcée** (Helmet, CORS, Rate Limiting)
- **Base de données PostgreSQL** avec Knex.js
- **API RESTful** avec documentation

## 📋 Prérequis

- Node.js (v18 ou supérieur)
- PostgreSQL (v12 ou supérieur)
- npm ou yarn

## 🛠️ Installation

1. **Cloner le projet**
```bash
git clone <repository-url>
cd backend
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configuration de l'environnement**
```bash
cp env.example .env
```

Éditer le fichier `.env` avec vos paramètres :
```env
# Configuration du serveur
PORT=3001
NODE_ENV=development

# Configuration de la base de données
DB_HOST=localhost
DB_PORT=5432
DB_NAME=senemedecine
DB_USER=postgres
DB_PASSWORD=password

# Configuration JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=24h

# Configuration CORS
CORS_ORIGIN=http://localhost:5173
```

4. **Créer la base de données**
```sql
CREATE DATABASE senemedecine;
```

5. **Exécuter les migrations**
```bash
npm run migrate
```

6. **Insérer les données de test**
```bash
npm run seed
```

## 🚀 Démarrage

### Mode développement
```bash
npm run dev
```

### Mode production
```bash
npm run build
npm start
```

## 📚 API Endpoints

### Authentification
- `POST /api/auth/login` - Connexion utilisateur
- `GET /api/auth/profile` - Récupérer le profil utilisateur

### Hôpitaux
- `GET /api/hopitaux` - Liste des hôpitaux
- `GET /api/hopitaux/:id` - Détails d'un hôpital
- `POST /api/hopitaux` - Créer un hôpital (ADMIN)
- `PUT /api/hopitaux/:id` - Modifier un hôpital (ADMIN)
- `DELETE /api/hopitaux/:id` - Supprimer un hôpital (ADMIN)

### Patients
- `GET /api/patients` - Liste des patients
- `GET /api/patients/:id` - Détails d'un patient
- `POST /api/patients` - Créer un patient
- `PUT /api/patients/:id` - Modifier un patient
- `DELETE /api/patients/:id` - Supprimer un patient

### Consultations
- `GET /api/consultations` - Liste des consultations
- `GET /api/consultations/:id` - Détails d'une consultation
- `POST /api/consultations` - Créer une consultation
- `PUT /api/consultations/:id` - Modifier une consultation
- `DELETE /api/consultations/:id` - Supprimer une consultation

### Rendez-vous
- `GET /api/rendez-vous` - Liste des rendez-vous
- `GET /api/rendez-vous/:id` - Détails d'un rendez-vous
- `POST /api/rendez-vous` - Créer un rendez-vous
- `PUT /api/rendez-vous/:id` - Modifier un rendez-vous
- `DELETE /api/rendez-vous/:id` - Supprimer un rendez-vous

## 🔐 Authentification

L'API utilise JWT (JSON Web Tokens) pour l'authentification.

### Format du token
```json
{
  "id": "user-id",
  "email": "user@example.com",
  "role": "MEDECIN",
  "hopital_id": "hopital-id"
}
```

### Utilisation
Inclure le token dans le header Authorization :
```
Authorization: Bearer <token>
```

## 👥 Rôles et Permissions

- **ADMIN** : Accès complet à toutes les fonctionnalités
- **MEDECIN** : Gestion des patients, consultations, rendez-vous
- **SECRETAIRE** : Gestion des rendez-vous, patients
- **PATIENT** : Consultation de ses propres données

## 🗄️ Structure de la Base de Données

### Tables principales
- `hopitaux` - Informations des hôpitaux
- `users` - Utilisateurs du système
- `patients` - Patients
- `consultations` - Consultations médicales
- `medicaments` - Médicaments
- `consultation_medicaments` - Relation consultation-médicaments
- `rendez_vous` - Rendez-vous
- `images_dicom` - Images DICOM

## 🧪 Tests

```bash
npm test
```

## 📦 Scripts disponibles

- `npm run dev` - Démarrage en mode développement
- `npm run build` - Compilation TypeScript
- `npm start` - Démarrage en mode production
- `npm run migrate` - Exécution des migrations
- `npm run seed` - Insertion des données de test
- `npm test` - Exécution des tests

## 🔧 Configuration

### Variables d'environnement importantes

- `PORT` - Port du serveur (défaut: 3001)
- `NODE_ENV` - Environnement (development/production)
- `DB_HOST` - Hôte PostgreSQL
- `DB_NAME` - Nom de la base de données
- `JWT_SECRET` - Clé secrète pour JWT
- `CORS_ORIGIN` - Origine autorisée pour CORS

## 🚨 Sécurité

- **Helmet** pour les en-têtes de sécurité
- **CORS** configuré pour les origines autorisées
- **Rate Limiting** pour prévenir les abus
- **Validation des données** avec Joi
- **Hachage des mots de passe** avec bcrypt
- **JWT** pour l'authentification

## 📝 Logs

Les logs sont générés avec Morgan et incluent :
- Requêtes HTTP
- Erreurs d'application
- Métriques de performance

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
- Ouvrir une issue sur GitHub
- Contacter l'équipe de développement

## 🔄 Mise à jour

Pour mettre à jour le projet :
```bash
git pull origin main
npm install
npm run migrate
npm run build
``` 