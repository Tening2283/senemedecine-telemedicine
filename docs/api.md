# Documentation API SeneMedecine

## Vue d'ensemble

L'API SeneMedecine est une API REST sécurisée construite avec NestJS. Elle fournit tous les endpoints nécessaires pour la gestion de la télémédecine et de la téléradiologie.

**Base URL:** `http://localhost:3001/api/v1`  
**Documentation Swagger:** `http://localhost:3001/api`

## Authentification

### JWT Bearer Token

Toutes les requêtes (sauf login/register) nécessitent un token JWT dans le header Authorization :

```http
Authorization: Bearer <jwt_token>
```

### Endpoints d'authentification

#### POST /auth/login
Connexion utilisateur

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "hospitalId": "uuid-hospital-id"
}
```

**Response:**
```json
{
  "access_token": "jwt_token",
  "refresh_token": "refresh_token",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "MEDECIN"
  },
  "hospital": {
    "id": "uuid",
    "name": "Hôpital Principal",
    "code": "HPD"
  }
}
```

#### POST /auth/refresh
Renouvellement du token

**Body:**
```json
{
  "refresh_token": "refresh_token"
}
```

#### POST /auth/logout
Déconnexion

**Headers:** `Authorization: Bearer <token>`

## Gestion des Utilisateurs

### GET /users
Liste des utilisateurs (Admin uniquement)

**Query Parameters:**
- `page`: Numéro de page (défaut: 1)
- `limit`: Nombre d'éléments par page (défaut: 10)
- `role`: Filtrer par rôle (ADMIN, MEDECIN, SECRETAIRE, PATIENT)
- `search`: Recherche par nom/email

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "MEDECIN",
      "status": "ACTIVE",
      "createdAt": "2024-01-15T10:00:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

### POST /users
Créer un utilisateur

**Body:**
```json
{
  "email": "newuser@example.com",
  "password": "password123",
  "firstName": "Jane",
  "lastName": "Smith",
  "role": "MEDECIN",
  "phone": "+221 77 123 45 67",
  "speciality": "Cardiologie",
  "licenseNumber": "MD001"
}
```

### GET /users/:id
Détails d'un utilisateur

### PUT /users/:id
Modifier un utilisateur

### DELETE /users/:id
Supprimer un utilisateur (Admin uniquement)

## Gestion des Hôpitaux

### GET /hospitals
Liste des hôpitaux

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Hôpital Principal de Dakar",
      "code": "HPD",
      "address": "Avenue Cheikh Anta Diop, Dakar",
      "phone": "+221 33 889 12 34",
      "email": "contact@hopital-dakar.sn",
      "status": "ACTIVE",
      "bedCount": 200
    }
  ]
}
```

### POST /hospitals
Créer un hôpital (Admin uniquement)

### GET /hospitals/:id
Détails d'un hôpital

### PUT /hospitals/:id
Modifier un hôpital

## Gestion des Patients

### GET /patients
Liste des patients

**Query Parameters:**
- `page`, `limit`: Pagination
- `search`: Recherche par nom/numéro patient
- `gender`: Filtrer par sexe (M, F)
- `status`: Filtrer par statut

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "patientNumber": "PAT001",
      "firstName": "Moussa",
      "lastName": "Traoré",
      "dateOfBirth": "1985-03-15",
      "gender": "M",
      "phone": "+221 77 890 12 34",
      "bloodType": "O+",
      "status": "ACTIVE"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100
  }
}
```

### POST /patients
Créer un patient

**Body:**
```json
{
  "firstName": "Aminata",
  "lastName": "Diop",
  "dateOfBirth": "1990-07-22",
  "gender": "F",
  "phone": "+221 77 901 23 45",
  "email": "aminata@example.com",
  "address": "Plateau, Dakar",
  "bloodType": "A+",
  "height": 165.0,
  "weight": 60.0
}
```

### GET /patients/:id
Détails d'un patient

**Response:**
```json
{
  "id": "uuid",
  "patientNumber": "PAT002",
  "firstName": "Aminata",
  "lastName": "Diop",
  "dateOfBirth": "1990-07-22",
  "gender": "F",
  "phone": "+221 77 901 23 45",
  "email": "aminata@example.com",
  "address": "Plateau, Dakar",
  "bloodType": "A+",
  "height": 165.0,
  "weight": 60.0,
  "medicalHistory": [
    {
      "condition": "Hypertension",
      "diagnosedAt": "2023-01-15",
      "status": "ACTIVE"
    }
  ],
  "allergies": [
    {
      "allergen": "Pénicilline",
      "severity": "HIGH"
    }
  ]
}
```

### PUT /patients/:id
Modifier un patient

### GET /patients/:id/consultations
Consultations d'un patient

## Gestion des Consultations

### GET /consultations
Liste des consultations

**Query Parameters:**
- `page`, `limit`: Pagination
- `patientId`: Filtrer par patient
- `doctorId`: Filtrer par médecin
- `status`: Filtrer par statut
- `dateFrom`, `dateTo`: Filtrer par période

### POST /consultations
Créer une consultation

**Body:**
```json
{
  "patientId": "uuid",
  "type": "CONSULTATION",
  "priority": "NORMAL",
  "chiefComplaint": "Douleurs thoraciques",
  "diagnosis": "Suspicion d'angine de poitrine",
  "treatmentPlan": "ECG et échocardiographie recommandés",
  "medications": [
    {
      "name": "Aspirine",
      "dosage": "100mg",
      "frequency": "1 fois par jour",
      "duration": "30 jours"
    }
  ]
}
```

### GET /consultations/:id
Détails d'une consultation

### PUT /consultations/:id
Modifier une consultation

## Gestion des Rendez-vous

### GET /appointments
Liste des rendez-vous

### POST /appointments
Créer un rendez-vous

**Body:**
```json
{
  "patientId": "uuid",
  "doctorId": "uuid",
  "appointmentDate": "2024-01-15T14:30:00Z",
  "duration": 30,
  "type": "CONSULTATION",
  "reason": "Consultation de routine",
  "notes": "Premier rendez-vous"
}
```

### GET /appointments/:id
Détails d'un rendez-vous

### PUT /appointments/:id
Modifier un rendez-vous

### PUT /appointments/:id/status
Changer le statut d'un rendez-vous

**Body:**
```json
{
  "status": "CONFIRMED"
}
```

## Gestion DICOM

### GET /dicom/studies
Liste des études DICOM

### GET /dicom/studies/:studyId
Détails d'une étude

### GET /dicom/studies/:studyId/series
Séries d'une étude

### GET /dicom/instances/:instanceId
Télécharger une instance DICOM

### POST /dicom/upload
Upload d'un fichier DICOM

**Content-Type:** `multipart/form-data`

**Body:**
- `file`: Fichier DICOM
- `patientId`: ID du patient
- `consultationId`: ID de la consultation (optionnel)

## Statistiques et Rapports

### GET /stats/dashboard
Statistiques du tableau de bord

**Response:**
```json
{
  "patients": {
    "total": 156,
    "new": 12,
    "active": 145
  },
  "consultations": {
    "total": 89,
    "today": 8,
    "thisWeek": 45
  },
  "appointments": {
    "today": 12,
    "thisWeek": 67,
    "pending": 3
  }
}
```

### GET /stats/hospitals
Statistiques par hôpital (Admin uniquement)

### GET /reports/consultations
Rapport des consultations

**Query Parameters:**
- `dateFrom`, `dateTo`: Période
- `doctorId`: Filtrer par médecin
- `format`: Format de sortie (json, csv, pdf)

## Gestion des Fichiers

### POST /files/upload
Upload d'un fichier

**Content-Type:** `multipart/form-data`

### GET /files/:id
Télécharger un fichier

### DELETE /files/:id
Supprimer un fichier

## Codes d'Erreur

### Codes HTTP Standards

- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `422` - Unprocessable Entity
- `500` - Internal Server Error

### Format des Erreurs

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request",
  "details": [
    {
      "field": "email",
      "message": "Email must be a valid email address"
    }
  ]
}
```

## Rate Limiting

- **Limite générale:** 100 requêtes par minute par IP
- **Limite login:** 5 tentatives par minute par IP
- **Limite upload:** 10 uploads par minute par utilisateur

## Pagination

Format standard pour les endpoints paginés :

**Query Parameters:**
- `page`: Numéro de page (défaut: 1)
- `limit`: Éléments par page (défaut: 10, max: 100)

**Response:**
```json
{
  "data": [...],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## Filtrage et Recherche

### Opérateurs de Filtrage

- `eq`: Égal à
- `ne`: Différent de
- `gt`: Supérieur à
- `gte`: Supérieur ou égal à
- `lt`: Inférieur à
- `lte`: Inférieur ou égal à
- `like`: Contient (recherche textuelle)
- `in`: Dans la liste

**Exemple:**
```
GET /patients?age[gte]=18&age[lt]=65&gender=F&search=marie
```

## WebSockets (Optionnel)

### Connexion

```javascript
const socket = io('http://localhost:3001', {
  auth: {
    token: 'jwt_token'
  }
});
```

### Événements

- `appointment:created` - Nouveau rendez-vous
- `consultation:updated` - Consultation mise à jour
- `notification:new` - Nouvelle notification

## Exemples d'Utilisation

### Authentification et Première Requête

```javascript
// 1. Connexion
const loginResponse = await fetch('/api/v1/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'medecin@hopital-dakar.sn',
    password: 'medecin123',
    hospitalId: 'uuid-hospital-id'
  })
});

const { access_token } = await loginResponse.json();

// 2. Utilisation du token
const patientsResponse = await fetch('/api/v1/patients', {
  headers: {
    'Authorization': `Bearer ${access_token}`
  }
});

const patients = await patientsResponse.json();
```

### Création d'un Patient avec Consultation

```javascript
// 1. Créer le patient
const patient = await fetch('/api/v1/patients', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    firstName: 'Fatou',
    lastName: 'Sall',
    dateOfBirth: '1988-05-10',
    gender: 'F',
    phone: '+221 77 555 66 77'
  })
});

const { id: patientId } = await patient.json();

// 2. Créer une consultation
const consultation = await fetch('/api/v1/consultations', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    patientId,
    chiefComplaint: 'Maux de tête persistants',
    diagnosis: 'Céphalées de tension',
    treatmentPlan: 'Repos et antalgiques'
  })
});
```

## Support et Contact

- **Documentation complète:** http://localhost:3001/api
- **Issues GitHub:** https://github.com/votre-org/senemedecine/issues
- **Email support:** support@senemedecine.sn

