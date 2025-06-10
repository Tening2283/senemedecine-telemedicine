-- Script d'initialisation des bases de données pour SeneMedecine
-- Ce script crée les bases de données pour chaque hôpital

-- Base de données centrale
CREATE DATABASE senemedecine_central;

-- Bases de données par hôpital
CREATE DATABASE hopital_dakar;
CREATE DATABASE hopital_thies;
CREATE DATABASE hopital_saint_louis;

-- Utilisateur pour l'application
CREATE USER senemedecine_app WITH PASSWORD 'senemedecine_app_2024';

-- Accorder les privilèges
GRANT ALL PRIVILEGES ON DATABASE senemedecine_central TO senemedecine_app;
GRANT ALL PRIVILEGES ON DATABASE hopital_dakar TO senemedecine_app;
GRANT ALL PRIVILEGES ON DATABASE hopital_thies TO senemedecine_app;
GRANT ALL PRIVILEGES ON DATABASE hopital_saint_louis TO senemedecine_app;

-- Extensions nécessaires
\c senemedecine_central;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

\c hopital_dakar;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

\c hopital_thies;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

\c hopital_saint_louis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

