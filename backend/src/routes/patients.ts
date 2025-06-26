import express from 'express';
import { 
  getPatients, 
  getPatientById, 
  createPatient, 
  updatePatient, 
  deletePatient 
} from '../controllers/patientsController';
import { authenticateToken, authorizeRoles } from '../middleware/auth';

const router = express.Router();

// Routes protégées par authentification
router.use(authenticateToken);

// Routes pour tous les utilisateurs authentifiés
router.get('/', getPatients);
router.get('/:id', getPatientById);

// Routes pour les médecins, secrétaires et admins
router.post('/', authorizeRoles('MEDECIN', 'SECRETAIRE', 'ADMIN'), createPatient);
router.put('/:id', authorizeRoles('MEDECIN', 'SECRETAIRE', 'ADMIN'), updatePatient);
router.delete('/:id', authorizeRoles('ADMIN'), deletePatient);

export default router; 