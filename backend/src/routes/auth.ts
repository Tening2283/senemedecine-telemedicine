import { Router } from 'express';
import { login, getProfile } from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Route de connexion (publique)
router.post('/login', login);

// Route pour récupérer le profil (protégée)
router.get('/profile', authenticateToken, getProfile);

export default router; 