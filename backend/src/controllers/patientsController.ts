import { Request, Response } from 'express';
import { db } from '../database/connection';
import { Patient, ApiResponse, PaginatedResponse } from '../types';

export const getPatients = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const hopitalId = req.query.hopital_id as string;
    const offset = (page - 1) * limit;

    let query = db('patients').select('*');
    
    if (hopitalId) {
      query = query.where({ hopital_id: hopitalId });
    }

    const patients = await query.limit(limit).offset(offset);
    const total = await db('patients').count('* as count').first();
    const totalCount = total ? parseInt(total.count as string) : 0;

    const response: ApiResponse<PaginatedResponse<Patient>> = {
      success: true,
      data: {
        data: patients,
        pagination: {
          page,
          limit,
          total: totalCount,
          totalPages: Math.ceil(totalCount / limit)
        }
      }
    };

    res.json(response);
  } catch (error) {
    console.error('Erreur lors de la récupération des patients:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur interne du serveur'
    });
  }
};

export const getPatientById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const patient = await db('patients').where({ id }).first();

    if (!patient) {
      res.status(404).json({
        success: false,
        error: 'Patient non trouvé'
      });
      return;
    }

    const response: ApiResponse<Patient> = {
      success: true,
      data: patient
    };

    res.json(response);
  } catch (error) {
    console.error('Erreur lors de la récupération du patient:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur interne du serveur'
    });
  }
};

export const createPatient = async (req: Request, res: Response): Promise<void> => {
  try {
    const patientData = req.body;
    const [newPatient] = await db('patients').insert(patientData).returning('*');

    res.status(201).json({
      success: true,
      data: newPatient
    });
  } catch (error) {
    console.error('Erreur lors de la création du patient:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur interne du serveur'
    });
  }
};

export const updatePatient = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const [patient] = await db('patients')
      .where({ id })
      .update(updateData)
      .returning('*');

    if (!patient) {
      res.status(404).json({
        success: false,
        error: 'Patient non trouvé'
      });
      return;
    }

    res.json({
      success: true,
      data: patient
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du patient:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur interne du serveur'
    });
  }
};

export const deletePatient = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const deleted = await db('patients').where({ id }).del();

    if (!deleted) {
      res.status(404).json({
        success: false,
        error: 'Patient non trouvé'
      });
      return;
    }

    res.json({
      success: true,
      message: 'Patient supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression du patient:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur interne du serveur'
    });
  }
}; 