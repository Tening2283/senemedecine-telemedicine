import express from 'express';
import { 
  getConsultations, 
  getConsultationById, 
  createConsultation, 
  updateConsultation, 
  deleteConsultation 
} from '../controllers/consultationsController';
import { authenticateToken, authorizeRoles } from '../middleware/auth';

const router = express.Router();

// Routes protégées par authentification
router.use(authenticateToken);

// Routes pour tous les utilisateurs authentifiés
router.get('/', getConsultations);
router.get('/:id', getConsultationById);

// Routes pour les médecins et admins
router.post('/', authorizeRoles('MEDECIN', 'ADMIN'), createConsultation);
router.put('/:id', authorizeRoles('MEDECIN', 'ADMIN'), updateConsultation);
router.delete('/:id', authorizeRoles('ADMIN'), deleteConsultation);

export default router; 