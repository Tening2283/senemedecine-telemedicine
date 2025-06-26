import { Request, Response } from 'express';
import { db } from '../database/connection';
import { Consultation, ApiResponse, PaginatedResponse } from '../types';

export const getConsultations = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const hopitalId = req.query.hopital_id as string;
    const offset = (page - 1) * limit;

    let query = db('consultations').select('*');
    
    if (hopitalId) {
      query = query.where({ hopital_id: hopitalId });
    }

    const consultations = await query.limit(limit).offset(offset);
    const total = await db('consultations').count('* as count').first();
    const totalCount = total ? parseInt(total.count as string) : 0;

    const response: ApiResponse<PaginatedResponse<Consultation>> = {
      success: true,
      data: {
        data: consultations,
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
    console.error('Erreur lors de la récupération des consultations:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur interne du serveur'
    });
  }
};

export const getConsultationById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const consultation = await db('consultations').where({ id }).first();

    if (!consultation) {
      res.status(404).json({
        success: false,
        error: 'Consultation non trouvée'
      });
      return;
    }

    const response: ApiResponse<Consultation> = {
      success: true,
      data: consultation
    };

    res.json(response);
  } catch (error) {
    console.error('Erreur lors de la récupération de la consultation:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur interne du serveur'
    });
  }
};

export const createConsultation = async (req: Request, res: Response): Promise<void> => {
  try {
    const consultationData = req.body;
    const [newConsultation] = await db('consultations')
      .insert(consultationData)
      .returning('*');

    res.status(201).json({
      success: true,
      data: newConsultation
    });
  } catch (error) {
    console.error('Erreur lors de la création de la consultation:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur interne du serveur'
    });
  }
};

export const updateConsultation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const [consultation] = await db('consultations')
      .where({ id })
      .update(updateData)
      .returning('*');

    if (!consultation) {
      res.status(404).json({
        success: false,
        error: 'Consultation non trouvée'
      });
      return;
    }

    res.json({
      success: true,
      data: consultation
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la consultation:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur interne du serveur'
    });
  }
};

export const deleteConsultation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const deleted = await db('consultations').where({ id }).del();

    if (!deleted) {
      res.status(404).json({
        success: false,
        error: 'Consultation non trouvée'
      });
      return;
    }

    res.json({
      success: true,
      message: 'Consultation supprimée avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de la consultation:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur interne du serveur'
    });
  }
}; 