import express from 'express';
import { 
  getRendezVous, 
  getRendezVousById, 
  createRendezVous, 
  updateRendezVous, 
  deleteRendezVous 
} from '../controllers/rendezVousController';
import { authenticateToken, authorizeRoles } from '../middleware/auth';

const router = express.Router();

// Routes protégées par authentification
router.use(authenticateToken);

// Routes pour tous les utilisateurs authentifiés
router.get('/', getRendezVous);
router.get('/:id', getRendezVousById);

// Routes pour les secrétaires, médecins et admins
router.post('/', authorizeRoles('SECRETAIRE', 'MEDECIN', 'ADMIN'), createRendezVous);
router.put('/:id', authorizeRoles('SECRETAIRE', 'MEDECIN', 'ADMIN'), updateRendezVous);
router.delete('/:id', authorizeRoles('ADMIN'), deleteRendezVous);

export default router; 