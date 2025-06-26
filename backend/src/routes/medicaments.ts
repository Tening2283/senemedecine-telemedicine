import { Router } from 'express';
import { authenticateToken, authorizeRoles } from '../middleware/auth';

const router = Router();

// Toutes les routes nécessitent une authentification
router.use(authenticateToken);

// Routes pour tous les utilisateurs authentifiés
router.get('/', (req, res) => {
  res.json({ success: true, message: 'Médicaments - Route à implémenter' });
});

// Routes réservées aux médecins et admins
router.post('/', authorizeRoles('MEDECIN', 'ADMIN'), (req, res) => {
  res.json({ success: true, message: 'Créer médicament - Route à implémenter' });
});

export default router; 