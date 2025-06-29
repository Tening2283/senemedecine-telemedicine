import { Router } from 'express';
import { 
  getConsultationDicomAssociations, 
  createConsultationDicomAssociation, 
  deleteConsultationDicomAssociation,
  getConsultationDicomAssociationsByConsultation
} from '../controllers/consultationDicomController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Toutes les routes nécessitent une authentification
router.use(authenticateToken);

// Récupérer toutes les associations (avec pagination et filtres)
router.get('/', getConsultationDicomAssociations);

// Récupérer les associations d'une consultation spécifique
router.get('/consultation/:consultationId', getConsultationDicomAssociationsByConsultation);

// Créer une nouvelle association
router.post('/', createConsultationDicomAssociation);

// Supprimer une association
router.delete('/:id', deleteConsultationDicomAssociation);

export default router; 