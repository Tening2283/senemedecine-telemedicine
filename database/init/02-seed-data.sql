-- Script de données initiales pour SeneMedecine
-- Ce script insère les données de base nécessaires au fonctionnement de l'application

\c senemedecine_central;

-- Insertion des hôpitaux
INSERT INTO hospitals (id, name, code, description, address, phone, email, database_name, status, is_active, bed_count, director, established_date, created_at, updated_at) VALUES
(uuid_generate_v4(), 'Hôpital Principal de Dakar', 'HPD', 'Hôpital de référence de la région de Dakar', 'Avenue Cheikh Anta Diop, Dakar', '+221 33 889 12 34', 'contact@hopital-dakar.sn', 'hopital_dakar', 'ACTIVE', true, 200, 'Dr. Amadou Diallo', '1960-01-15', NOW(), NOW()),
(uuid_generate_v4(), 'Hôpital Régional de Thiès', 'HRT', 'Hôpital régional de Thiès', 'Route de Dakar, Thiès', '+221 33 951 23 45', 'contact@hopital-thies.sn', 'hopital_thies', 'ACTIVE', true, 120, 'Dr. Fatou Sall', '1975-03-20', NOW(), NOW()),
(uuid_generate_v4(), 'Hôpital de Saint-Louis', 'HSL', 'Hôpital de la région de Saint-Louis', 'Avenue Général de Gaulle, Saint-Louis', '+221 33 961 34 56', 'contact@hopital-saint-louis.sn', 'hopital_saint_louis', 'ACTIVE', true, 80, 'Dr. Ousmane Ba', '1970-06-10', NOW(), NOW());

-- Insertion des utilisateurs administrateurs
INSERT INTO users (id, email, password_hash, first_name, last_name, role, status, phone, speciality, license_number, hospital_id, is_active, email_verified, created_at, updated_at) VALUES
-- Administrateur central
(uuid_generate_v4(), 'admin@senemedecine.sn', '$2b$12$LQv3c1yqBwEHFurhHSHyWOCxkihBtdXEBVzT2u0L/Ah7QrYHFSSJy', 'Administrateur', 'Central', 'ADMIN', 'ACTIVE', '+221 77 123 45 67', NULL, NULL, NULL, true, true, NOW(), NOW()),

-- Administrateurs d'hôpitaux
(uuid_generate_v4(), 'admin@hopital-dakar.sn', '$2b$12$LQv3c1yqBwEHFurhHSHyWOCxkihBtdXEBVzT2u0L/Ah7QrYHFSSJy', 'Admin', 'Dakar', 'ADMIN', 'ACTIVE', '+221 77 234 56 78', NULL, NULL, (SELECT id FROM hospitals WHERE code = 'HPD'), true, true, NOW(), NOW()),

-- Médecins
(uuid_generate_v4(), 'medecin@hopital-dakar.sn', '$2b$12$LQv3c1yqBwEHFurhHSHyWOCxkihBtdXEBVzT2u0L/Ah7QrYHFSSJy', 'Dr. Mamadou', 'Diallo', 'MEDECIN', 'ACTIVE', '+221 77 345 67 89', 'Cardiologie', 'MD001', (SELECT id FROM hospitals WHERE code = 'HPD'), true, true, NOW(), NOW()),
(uuid_generate_v4(), 'cardiologue@hopital-dakar.sn', '$2b$12$LQv3c1yqBwEHFurhHSHyWOCxkihBtdXEBVzT2u0L/Ah7QrYHFSSJy', 'Dr. Aissatou', 'Ndiaye', 'MEDECIN', 'ACTIVE', '+221 77 456 78 90', 'Cardiologie', 'MD002', (SELECT id FROM hospitals WHERE code = 'HPD'), true, true, NOW(), NOW()),
(uuid_generate_v4(), 'neurologue@hopital-dakar.sn', '$2b$12$LQv3c1yqBwEHFurhHSHyWOCxkihBtdXEBVzT2u0L/Ah7QrYHFSSJy', 'Dr. Cheikh', 'Fall', 'MEDECIN', 'ACTIVE', '+221 77 567 89 01', 'Neurologie', 'MD003', (SELECT id FROM hospitals WHERE code = 'HPD'), true, true, NOW(), NOW()),

-- Secrétaires
(uuid_generate_v4(), 'secretaire@hopital-dakar.sn', '$2b$12$LQv3c1yqBwEHFurhHSHyWOCxkihBtdXEBVzT2u0L/Ah7QrYHFSSJy', 'Fatou', 'Sarr', 'SECRETAIRE', 'ACTIVE', '+221 77 678 90 12', NULL, NULL, (SELECT id FROM hospitals WHERE code = 'HPD'), true, true, NOW(), NOW()),
(uuid_generate_v4(), 'accueil@hopital-dakar.sn', '$2b$12$LQv3c1yqBwEHFurhHSHyWOCxkihBtdXEBVzT2u0L/Ah7QrYHFSSJy', 'Mariama', 'Cissé', 'SECRETAIRE', 'ACTIVE', '+221 77 789 01 23', NULL, NULL, (SELECT id FROM hospitals WHERE code = 'HPD'), true, true, NOW(), NOW()),

-- Patients de test
(uuid_generate_v4(), 'patient1@email.com', '$2b$12$LQv3c1yqBwEHFurhHSHyWOCxkihBtdXEBVzT2u0L/Ah7QrYHFSSJy', 'Moussa', 'Traoré', 'PATIENT', 'ACTIVE', '+221 77 890 12 34', NULL, NULL, (SELECT id FROM hospitals WHERE code = 'HPD'), true, true, NOW(), NOW()),
(uuid_generate_v4(), 'patient2@email.com', '$2b$12$LQv3c1yqBwEHFurhHSHyWOCxkihBtdXEBVzT2u0L/Ah7QrYHFSSJy', 'Aminata', 'Diop', 'PATIENT', 'ACTIVE', '+221 77 901 23 45', NULL, NULL, (SELECT id FROM hospitals WHERE code = 'HPD'), true, true, NOW(), NOW());

-- Insertion des patients
INSERT INTO patients (id, patient_number, first_name, last_name, date_of_birth, gender, phone, email, address, blood_type, height, weight, status, hospital_id, user_id, created_at, updated_at) VALUES
(uuid_generate_v4(), 'PAT001', 'Moussa', 'Traoré', '1985-03-15', 'M', '+221 77 890 12 34', 'patient1@email.com', 'Médina, Dakar', 'O+', 175.00, 70.50, 'ACTIVE', (SELECT id FROM hospitals WHERE code = 'HPD'), (SELECT id FROM users WHERE email = 'patient1@email.com'), NOW(), NOW()),
(uuid_generate_v4(), 'PAT002', 'Aminata', 'Diop', '1990-07-22', 'F', '+221 77 901 23 45', 'patient2@email.com', 'Plateau, Dakar', 'A+', 165.00, 60.00, 'ACTIVE', (SELECT id FROM hospitals WHERE code = 'HPD'), (SELECT id FROM users WHERE email = 'patient2@email.com'), NOW(), NOW()),
(uuid_generate_v4(), 'PAT003', 'Ibrahima', 'Sow', '1978-11-08', 'M', '+221 77 012 34 56', NULL, 'Parcelles Assainies, Dakar', 'B+', 180.00, 85.00, 'ACTIVE', (SELECT id FROM hospitals WHERE code = 'HPD'), NULL, NOW(), NOW()),
(uuid_generate_v4(), 'PAT004', 'Khady', 'Ba', '1995-01-30', 'F', '+221 77 123 45 67', NULL, 'Grand Yoff, Dakar', 'AB-', 160.00, 55.00, 'ACTIVE', (SELECT id FROM hospitals WHERE code = 'HPD'), NULL, NOW(), NOW());

-- Insertion des rendez-vous
INSERT INTO appointments (id, appointment_number, appointment_date, duration, type, status, priority, reason, notes, room, patient_id, doctor_id, hospital_id, created_by_id, created_at, updated_at) VALUES
(uuid_generate_v4(), 'RDV001', '2024-01-15 14:30:00', 30, 'CONSULTATION', 'SCHEDULED', 'NORMAL', 'Consultation de routine', 'Premier rendez-vous', 'Salle 101', (SELECT id FROM patients WHERE patient_number = 'PAT001'), (SELECT id FROM users WHERE email = 'medecin@hopital-dakar.sn'), (SELECT id FROM hospitals WHERE code = 'HPD'), (SELECT id FROM users WHERE email = 'secretaire@hopital-dakar.sn'), NOW(), NOW()),
(uuid_generate_v4(), 'RDV002', '2024-01-16 09:00:00', 45, 'FOLLOW_UP', 'CONFIRMED', 'HIGH', 'Suivi cardiologique', 'Contrôle après traitement', 'Salle 102', (SELECT id FROM patients WHERE patient_number = 'PAT002'), (SELECT id FROM users WHERE email = 'cardiologue@hopital-dakar.sn'), (SELECT id FROM hospitals WHERE code = 'HPD'), (SELECT id FROM users WHERE email = 'secretaire@hopital-dakar.sn'), NOW(), NOW());

-- Insertion des consultations
INSERT INTO consultations (id, consultation_number, consultation_date, type, status, priority, chief_complaint, diagnosis, treatment_plan, patient_id, doctor_id, hospital_id, created_at, updated_at) VALUES
(uuid_generate_v4(), 'CONS001', '2024-01-10 10:00:00', 'CONSULTATION', 'COMPLETED', 'NORMAL', 'Douleurs thoraciques', 'Suspicion d''angine de poitrine', 'ECG et échocardiographie recommandés', (SELECT id FROM patients WHERE patient_number = 'PAT001'), (SELECT id FROM users WHERE email = 'cardiologue@hopital-dakar.sn'), (SELECT id FROM hospitals WHERE code = 'HPD'), NOW(), NOW()),
(uuid_generate_v4(), 'CONS002', '2024-01-12 15:30:00', 'URGENCE', 'COMPLETED', 'HIGH', 'Hypertension artérielle', 'HTA grade 2', 'Traitement antihypertenseur initié', (SELECT id FROM patients WHERE patient_number = 'PAT002'), (SELECT id FROM users WHERE email = 'medecin@hopital-dakar.sn'), (SELECT id FROM hospitals WHERE code = 'HPD'), NOW(), NOW());

-- Affichage des données insérées
SELECT 'Hôpitaux créés:' as info;
SELECT name, code, status FROM hospitals;

SELECT 'Utilisateurs créés:' as info;
SELECT email, first_name, last_name, role FROM users;

SELECT 'Patients créés:' as info;
SELECT patient_number, first_name, last_name, gender FROM patients;

SELECT 'Rendez-vous créés:' as info;
SELECT appointment_number, appointment_date, status FROM appointments;

