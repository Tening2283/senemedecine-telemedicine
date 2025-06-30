import { Request, Response } from 'express';
import knex from '../database/connection';

// Nombre de consultations par mois (année en cours)
export const getConsultationsParMois = async (req: Request, res: Response) => {
  try {
    const year = new Date().getFullYear();
    const rows = await knex('consultations')
      .select(knex.raw("EXTRACT(MONTH FROM date_consultation) as mois"))
      .count('id as total')
      .whereRaw('EXTRACT(YEAR FROM date_consultation) = ?', [year])
      .groupByRaw('EXTRACT(MONTH FROM date_consultation)')
      .orderBy('mois');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des consultations par mois' });
  }
};

// Répartition des rôles utilisateurs
export const getRepartitionRoles = async (req: Request, res: Response) => {
  try {
    const rows = await knex('users')
      .select('role')
      .count('id as total')
      .groupBy('role');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération de la répartition des rôles' });
  }
};

// Nombre de patients par hôpital
export const getPatientsParHopital = async (req: Request, res: Response) => {
  try {
    const rows = await knex('hopitaux')
      .leftJoin('patients', 'hopitaux.id', 'patients.hopital_id')
      .select('hopitaux.id', 'hopitaux.nom')
      .count('patients.id as total_patients')
      .groupBy('hopitaux.id', 'hopitaux.nom');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des patients par hôpital' });
  }
};

// Nombre de consultations par hôpital
export const getConsultationsParHopital = async (req: Request, res: Response) => {
  try {
    const rows = await knex('hopitaux')
      .leftJoin('consultations', 'hopitaux.id', 'consultations.hopital_id')
      .select('hopitaux.id', 'hopitaux.nom')
      .count('consultations.id as total_consultations')
      .groupBy('hopitaux.id', 'hopitaux.nom');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des consultations par hôpital' });
  }
}; 