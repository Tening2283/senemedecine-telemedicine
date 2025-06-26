import { Router } from 'express';
import { 
  getAllHopitaux, 
  getHopitalById, 
  createHopital, 
  updateHopital, 
  deleteHopital 
} from '../controllers/hopitauxController';
import { authenticateToken, authorizeRoles } from '../middleware/auth';

const router = Router();

// Routes publiques (pas besoin d'authentification pour obtenir la liste des hôpitaux)
router.get('/', getAllHopitaux);
router.get('/:id', getHopitalById);

// Toutes les routes ci-dessous nécessitent une authentification
router.use(authenticateToken);

// Routes réservées aux admins (après authentification)
router.post('/', authorizeRoles('ADMIN'), createHopital);
router.put('/:id', authorizeRoles('ADMIN'), updateHopital);
router.delete('/:id', authorizeRoles('ADMIN'), deleteHopital);

export default router; 