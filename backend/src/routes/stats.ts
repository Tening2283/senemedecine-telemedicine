import express from 'express';
import {
  getConsultationsParMois,
  getRepartitionRoles,
  getPatientsParHopital,
  getConsultationsParHopital
} from '../controllers/statsController';

const router = express.Router();

router.get('/consultations-par-mois', getConsultationsParMois);
router.get('/repartition-roles', getRepartitionRoles);
router.get('/patients-par-hopital', getPatientsParHopital);
router.get('/consultations-par-hopital', getConsultationsParHopital);

export default router; 