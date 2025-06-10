// Tests de performance avec K6 pour SeneMedecine
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

// Métriques personnalisées
const errorRate = new Rate('errors');

// Configuration des tests
export const options = {
  stages: [
    { duration: '2m', target: 10 }, // Montée en charge
    { duration: '5m', target: 10 }, // Charge stable
    { duration: '2m', target: 20 }, // Augmentation de charge
    { duration: '5m', target: 20 }, // Charge stable élevée
    { duration: '2m', target: 0 },  // Descente en charge
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% des requêtes < 500ms
    http_req_failed: ['rate<0.1'],    // Taux d'erreur < 10%
    errors: ['rate<0.1'],             // Taux d'erreur personnalisé < 10%
  },
};

// Configuration de l'environnement
const BASE_URL = __ENV.BASE_URL || 'http://localhost:3001';
const API_URL = `${BASE_URL}/api/v1`;

// Données de test
const testUsers = [
  { email: 'admin@senemedecine.sn', password: 'admin123', role: 'ADMIN' },
  { email: 'medecin@hopital-dakar.sn', password: 'medecin123', role: 'MEDECIN' },
  { email: 'secretaire@hopital-dakar.sn', password: 'secretaire123', role: 'SECRETAIRE' },
];

// Fonction d'authentification
function authenticate(user) {
  const loginPayload = {
    email: user.email,
    password: user.password,
    hospitalId: 'hopital-dakar-id', // ID fictif
  };

  const loginResponse = http.post(`${API_URL}/auth/login`, JSON.stringify(loginPayload), {
    headers: { 'Content-Type': 'application/json' },
  });

  const loginSuccess = check(loginResponse, {
    'login status is 200': (r) => r.status === 200,
    'login response has token': (r) => r.json('access_token') !== undefined,
  });

  if (!loginSuccess) {
    errorRate.add(1);
    return null;
  }

  return loginResponse.json('access_token');
}

// Fonction pour créer les headers avec authentification
function getAuthHeaders(token) {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
}

// Test principal
export default function () {
  // Sélectionner un utilisateur aléatoire
  const user = testUsers[Math.floor(Math.random() * testUsers.length)];
  
  // Authentification
  const token = authenticate(user);
  if (!token) {
    return;
  }

  const headers = getAuthHeaders(token);

  // Test 1: Récupération du profil utilisateur
  const profileResponse = http.get(`${API_URL}/auth/profile`, { headers });
  check(profileResponse, {
    'profile status is 200': (r) => r.status === 200,
    'profile has user data': (r) => r.json('email') === user.email,
  }) || errorRate.add(1);

  sleep(1);

  // Test 2: Liste des patients (selon le rôle)
  if (user.role !== 'PATIENT') {
    const patientsResponse = http.get(`${API_URL}/patients?page=1&limit=10`, { headers });
    check(patientsResponse, {
      'patients status is 200': (r) => r.status === 200,
      'patients response has data': (r) => r.json('data') !== undefined,
    }) || errorRate.add(1);

    sleep(1);
  }

  // Test 3: Statistiques du dashboard
  const statsResponse = http.get(`${API_URL}/stats/dashboard`, { headers });
  check(statsResponse, {
    'stats status is 200': (r) => r.status === 200,
    'stats response has data': (r) => Object.keys(r.json()).length > 0,
  }) || errorRate.add(1);

  sleep(1);

  // Test 4: Création d'un patient (pour médecins et secrétaires)
  if (user.role === 'MEDECIN' || user.role === 'SECRETAIRE') {
    const patientData = {
      firstName: `Patient${Math.floor(Math.random() * 1000)}`,
      lastName: 'Test',
      dateOfBirth: '1990-01-01',
      gender: Math.random() > 0.5 ? 'M' : 'F',
      phone: `+221 77 ${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`,
    };

    const createPatientResponse = http.post(
      `${API_URL}/patients`,
      JSON.stringify(patientData),
      { headers }
    );

    check(createPatientResponse, {
      'create patient status is 201': (r) => r.status === 201,
      'create patient response has id': (r) => r.json('id') !== undefined,
    }) || errorRate.add(1);

    sleep(1);
  }

  // Test 5: Recherche de patients
  if (user.role !== 'PATIENT') {
    const searchResponse = http.get(`${API_URL}/patients?search=test&page=1&limit=5`, { headers });
    check(searchResponse, {
      'search status is 200': (r) => r.status === 200,
      'search response is valid': (r) => r.json('data') !== undefined,
    }) || errorRate.add(1);

    sleep(1);
  }

  // Test 6: Vérification de santé de l'API
  const healthResponse = http.get(`${BASE_URL}/health`);
  check(healthResponse, {
    'health status is 200': (r) => r.status === 200,
    'health response is ok': (r) => r.json('status') === 'ok',
  }) || errorRate.add(1);

  sleep(2);
}

// Test de charge pour l'authentification
export function authLoadTest() {
  const user = testUsers[0];
  const token = authenticate(user);
  
  check(token, {
    'auth load test successful': (t) => t !== null,
  }) || errorRate.add(1);

  sleep(0.5);
}

// Test de stress pour les endpoints critiques
export function stressTest() {
  const user = testUsers[1]; // Médecin
  const token = authenticate(user);
  
  if (!token) {
    return;
  }

  const headers = getAuthHeaders(token);

  // Requêtes simultanées
  const responses = http.batch([
    ['GET', `${API_URL}/patients?page=1&limit=50`, null, { headers }],
    ['GET', `${API_URL}/consultations?page=1&limit=50`, null, { headers }],
    ['GET', `${API_URL}/appointments?page=1&limit=50`, null, { headers }],
    ['GET', `${API_URL}/stats/dashboard`, null, { headers }],
  ]);

  responses.forEach((response, index) => {
    check(response, {
      [`batch request ${index} status is 200`]: (r) => r.status === 200,
    }) || errorRate.add(1);
  });

  sleep(1);
}

// Configuration pour différents types de tests
export const scenarios = {
  // Test de charge normal
  normal_load: {
    executor: 'ramping-vus',
    startVUs: 0,
    stages: [
      { duration: '5m', target: 10 },
      { duration: '10m', target: 10 },
      { duration: '5m', target: 0 },
    ],
    gracefulRampDown: '30s',
    exec: 'default',
  },
  
  // Test de stress sur l'authentification
  auth_stress: {
    executor: 'constant-arrival-rate',
    rate: 50,
    timeUnit: '1s',
    duration: '2m',
    preAllocatedVUs: 10,
    maxVUs: 50,
    exec: 'authLoadTest',
  },
  
  // Test de pic de charge
  spike_test: {
    executor: 'ramping-arrival-rate',
    startRate: 0,
    stages: [
      { duration: '2m', target: 10 },
      { duration: '1m', target: 100 }, // Pic
      { duration: '2m', target: 10 },
    ],
    preAllocatedVUs: 20,
    maxVUs: 100,
    exec: 'stressTest',
  },
};

// Fonction de setup (exécutée une fois au début)
export function setup() {
  console.log('🚀 Démarrage des tests de performance SeneMedecine');
  console.log(`📍 URL de base: ${BASE_URL}`);
  
  // Vérifier que l'API est accessible
  const healthCheck = http.get(`${BASE_URL}/health`);
  if (healthCheck.status !== 200) {
    throw new Error('API non accessible pour les tests de performance');
  }
  
  return { baseUrl: BASE_URL };
}

// Fonction de teardown (exécutée une fois à la fin)
export function teardown(data) {
  console.log('✅ Tests de performance terminés');
  console.log(`📊 URL testée: ${data.baseUrl}`);
}

