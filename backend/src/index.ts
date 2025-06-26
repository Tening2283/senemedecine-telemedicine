import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';

// Import des routes
import authRoutes from './routes/auth';
import hopitauxRoutes from './routes/hopitaux';
import patientsRoutes from './routes/patients';
import consultationsRoutes from './routes/consultations';
import rendezVousRoutes from './routes/rendez-vous';
import medicamentsRoutes from './routes/medicaments';
import orthancRoutes from './routes/orthanc';

// Configuration des variables d'environnement
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware de sécurité
app.use(helmet());

// Configuration CORS
app.use(cors({
  // origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  origin: '*',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // limite par IP
  message: {
    success: false,
    error: 'Trop de requêtes, veuillez réessayer plus tard'
  }
});
app.use(limiter);

// Middleware de compression
app.use(compression());

// Middleware de logging
app.use(morgan('combined'));

// Middleware pour parser le JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Middleware pour servir les fichiers statiques (uploads)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/hopitaux', hopitauxRoutes);
app.use('/api/patients', patientsRoutes);
app.use('/api/consultations', consultationsRoutes);
app.use('/api/rendez-vous', rendezVousRoutes);
app.use('/api/medicaments', medicamentsRoutes);
app.use('/api/orthanc', orthancRoutes);

// Route de santé
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API SeneMedecine opérationnelle',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Route 404
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route non trouvée'
  });
});

// Middleware de gestion d'erreurs global
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Erreur non gérée:', error);
  
  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' 
      ? 'Erreur interne du serveur' 
      : error.message
  });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur SeneMedecine démarré sur le port ${PORT}`);
  console.log(`📊 Environnement: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 URL: http://localhost:${PORT}`);
  console.log(`🏥 API Health: http://localhost:${PORT}/health`);
});

export default app; 