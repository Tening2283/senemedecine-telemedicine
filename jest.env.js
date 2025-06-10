// Configuration des variables d'environnement pour les tests Jest

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.DATABASE_HOST = 'localhost';
process.env.DATABASE_PORT = '5432';
process.env.DATABASE_USERNAME = 'test';
process.env.DATABASE_PASSWORD = 'test';
process.env.DATABASE_NAME = 'senemedecine_test';
process.env.ORTHANC_URL = 'http://localhost:8042';
process.env.ORTHANC_USERNAME = 'test';
process.env.ORTHANC_PASSWORD = 'test';
process.env.REDIS_HOST = 'localhost';
process.env.REDIS_PORT = '6379';

