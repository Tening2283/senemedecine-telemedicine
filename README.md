# SeneMedecine - Application de Télémedecine

Bienvenue sur SeneMedecine, une plateforme complète de télémedecine pour la gestion des hôpitaux, patients, consultations, rendez-vous et imagerie médicale (DICOM).

---

## 🚀 Lancer l'application en 2 minutes (aucune config requise)

**Prérequis :**
- [Docker](https://www.docker.com/products/docker-desktop/) installé (inclut Docker Compose)

**Étapes :**

```bash
# 1. Cloner le projet
https://github.com/Tening2283/senemedecine-telemedicine.git
cd senemedecine-telemedicine

# 2. Lancer toute la stack (backend, frontend, base de données, DICOM)
docker-compose up --build
```

- **Frontend** : http://localhost
- **Backend API** : http://localhost:3001/api
- **Orthanc DICOM** : http://localhost:8042 (orthanc / orthanc)
- **PostgreSQL** : localhost:5432 (user: postgres, password: azerty, db: senemedecine)

**Astuce :** La première initialisation peut prendre 1-2 minutes (installation, migrations, seeds). Attendez que tous les services soient "healthy". Pour voir les logs :
```bash
docker-compose logs -f
```

Pour tout arrêter :
```bash
docker-compose down
```

---

## 🧠 Assistant IA intégré (Chat IA)

- L'application intègre un assistant IA (chatbot) accessible depuis l'interface.
- **Aucune configuration n'est nécessaire** : la clé API IA est déjà fournie pour la démonstration.
- Posez vos questions médicales ou techniques à l'IA directement depuis l'application.

---

## 🏥 Fonctionnalités principales

- **Authentification sécurisée** (JWT, gestion des rôles)
- **Gestion des hôpitaux** (CRUD, utilisateurs par établissement)
- **Gestion des patients** (fiches, historique, médecin référent)
- **Consultations médicales** (motifs, diagnostics, prescriptions, images DICOM)
- **Rendez-vous** (planification, statuts, gestion des conflits)
- **Tableaux de bord** (statistiques, graphiques)
- **Visualisation d'images DICOM** (Orthanc intégré)
- **Assistant IA** (chat médical)

---

## 🛠️ Stack technique

- **Frontend** : React 18, TypeScript, Vite, Tailwind CSS, React Router, Cornerstone (DICOM), Recharts
- **Backend** : Node.js, Express, TypeScript, PostgreSQL, Knex.js, JWT, bcrypt, Helmet, CORS
- **DICOM** : Orthanc (serveur d'images médicales)
- **IA** : OpenRouter (modèle GPT-3.5-turbo-16k)
- **Docker** : orchestration complète

---

## 👤 Comptes de test

- **Administrateur**
  - Email : `admin@senemedecine.sn`
  - Mot de passe : `password123`
  - Rôle : ADMIN
- **Médecin**
  - Email : `dr.fall@hopital-dakar.sn`
  - Mot de passe : `password123`
  - Rôle : MEDECIN
- **Secrétaire**
  - Email : `sec.ndiaye@hopital-dakar.sn`
  - Mot de passe : `password123`
  - Rôle : SECRETAIRE

---

## 📋 Comment ça marche ?

1. **Lancez la stack avec Docker** (voir plus haut)
2. **Connectez-vous** avec un des comptes de test
3. **Explorez l'application** :
   - Gérez les hôpitaux, patients, consultations, rendez-vous
   - Visualisez et associez des images DICOM aux consultations
   - Utilisez le chat IA pour poser des questions médicales ou techniques

---

## 📦 Structure du projet

```
senemedecine-telemedicine/
├── project/   # Frontend React/TypeScript
├── backend/   # Backend Node.js/Express
└── README.md
```

---

## 🔐 Sécurité

- Authentification JWT
- Hachage des mots de passe (bcrypt)
- Sécurité des en-têtes (Helmet)
- CORS configuré
- Rate limiting
- Validation des données

---

## 🗄️ Base de données

- PostgreSQL, migrations et seeds automatiques
- Tables principales : hopitaux, users, patients, consultations, medicaments, rendez_vous, images_dicom

---

## 🧪 Tests

- Backend :
  ```bash
  cd backend
  npm test
  ```
- Frontend :
  ```bash
  cd project
  npm test
  ```

---

## 📚 Documentation

- [Backend](./backend/README.md)
- [Frontend](./project/README.md)
- [API Endpoints](./backend/README.md#api-endpoints)

---

## 🤝 Contribution

1. Fork le projet
2. Crée une branche feature (`git checkout -b feature/NouvelleFonctionnalite`)
3. Commit tes changements (`git commit -m 'feat: nouvelle fonctionnalité'`)
4. Push (`git push origin feature/NouvelleFonctionnalite`)
5. Ouvre une Pull Request

---

## 🆘 Support

- Consulte la documentation dans les dossiers `backend/` et `project/`
- Vérifie les logs du serveur et du navigateur
- Ouvre une issue sur GitHub

---

**SeneMedecine** – Plateforme de télémedecine moderne 🇸🇳
