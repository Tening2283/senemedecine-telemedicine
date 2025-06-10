-- Script d'initialisation des bases de données multi-hôpitaux
-- Ce script crée les bases de données pour chaque hôpital + la base centrale

-- Base de données centrale pour la gestion globale
CREATE DATABASE senemedecine_central;

-- Bases de données par hôpital
CREATE DATABASE hopital_dakar;
CREATE DATABASE hopital_thies;
CREATE DATABASE hopital_saint_louis;

-- Utilisateur pour l'application
CREATE USER senemedecine_app WITH PASSWORD 'senemedecine_app123';

-- Permissions sur la base centrale
GRANT ALL PRIVILEGES ON DATABASE senemedecine_central TO senemedecine_app;

-- Permissions sur les bases hôpitaux
GRANT ALL PRIVILEGES ON DATABASE hopital_dakar TO senemedecine_app;
GRANT ALL PRIVILEGES ON DATABASE hopital_thies TO senemedecine_app;
GRANT ALL PRIVILEGES ON DATABASE hopital_saint_louis TO senemedecine_app;

-- Connexion à la base centrale pour créer les tables de référence
\c senemedecine_central;

-- Table des hôpitaux (référence centrale)
CREATE TABLE IF NOT EXISTS hospitals (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    address TEXT,
    phone VARCHAR(20),
    email VARCHAR(255),
    database_name VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des utilisateurs globaux (administrateurs système)
CREATE TABLE IF NOT EXISTS global_users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'ADMIN',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Données initiales des hôpitaux
INSERT INTO hospitals (name, code, address, phone, email, database_name) VALUES
('Hôpital Principal de Dakar', 'HPD', 'Avenue Cheikh Anta Diop, Dakar', '+221 33 889 92 00', 'contact@hpd.sn', 'hopital_dakar'),
('Hôpital Régional de Thiès', 'HRT', 'Route de Dakar, Thiès', '+221 33 951 10 18', 'contact@hrt.sn', 'hopital_thies'),
('Hôpital Régional de Saint-Louis', 'HRSL', 'Avenue Jean Mermoz, Saint-Louis', '+221 33 961 10 81', 'contact@hrsl.sn', 'hopital_saint_louis');

-- Administrateur système par défaut
INSERT INTO global_users (email, password_hash, first_name, last_name, role) VALUES
('admin@senemedecine.sn', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6hsxq5S/kS', 'Admin', 'Système', 'ADMIN');
-- Mot de passe: admin123

-- Fonction pour créer les tables dans chaque base hôpital
CREATE OR REPLACE FUNCTION create_hospital_schema() RETURNS void AS $$
DECLARE
    hospital_db TEXT;
BEGIN
    FOR hospital_db IN SELECT database_name FROM hospitals LOOP
        -- Note: Cette fonction sera exécutée par l'application au démarrage
        -- car PostgreSQL ne permet pas de se connecter à d'autres bases depuis une fonction
        RAISE NOTICE 'Base de données hôpital à initialiser: %', hospital_db;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_hospitals_updated_at BEFORE UPDATE ON hospitals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_global_users_updated_at BEFORE UPDATE ON global_users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

