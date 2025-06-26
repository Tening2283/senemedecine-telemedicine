import { Request, Response } from 'express';
import { db } from '../database/connection';
import { RendezVous, ApiResponse, PaginatedResponse } from '../types';

export const getRendezVous = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const hopitalId = req.query.hopital_id as string;
    const offset = (page - 1) * limit;

    let query = db('rendez_vous').select('*');
    
    if (hopitalId) {
      query = query.where({ hopital_id: hopitalId });
    }

    const rendezVous = await query.limit(limit).offset(offset);
    const total = await db('rendez_vous').count('* as count').first();
    const totalCount = total ? parseInt(total.count as string) : 0;

    const response: ApiResponse<PaginatedResponse<RendezVous>> = {
      success: true,
      data: {
        data: rendezVous,
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
    console.error('Erreur lors de la récupération des rendez-vous:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur interne du serveur'
    });
  }
};

export const getRendezVousById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const rendezVous = await db('rendez_vous').where({ id }).first();

    if (!rendezVous) {
      res.status(404).json({
        success: false,
        error: 'Rendez-vous non trouvé'
      });
      return;
    }

    const response: ApiResponse<RendezVous> = {
      success: true,
      data: rendezVous
    };

    res.json(response);
  } catch (error) {
    console.error('Erreur lors de la récupération du rendez-vous:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur interne du serveur'
    });
  }
};

export const createRendezVous = async (req: Request, res: Response): Promise<void> => {
  try {
    const rendezVousData = req.body;

    const [rendezVous] = await db('rendez_vous').insert(rendezVousData).returning('*');

    const response: ApiResponse<RendezVous> = {
      success: true,
      data: rendezVous
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Erreur lors de la création du rendez-vous:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur interne du serveur'
    });
  }
};

export const updateRendezVous = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const [rendezVous] = await db('rendez_vous')
      .where({ id })
      .update(updateData)
      .returning('*');

    if (!rendezVous) {
      res.status(404).json({
        success: false,
        error: 'Rendez-vous non trouvé'
      });
      return;
    }

    res.json({
      success: true,
      data: rendezVous
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du rendez-vous:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur interne du serveur'
    });
  }
};

export const deleteRendezVous = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const deleted = await db('rendez_vous').where({ id }).del();

    if (!deleted) {
      res.status(404).json({
        success: false,
        error: 'Rendez-vous non trouvé'
      });
      return;
    }

    res.json({
      success: true,
      message: 'Rendez-vous supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression du rendez-vous:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur interne du serveur'
    });
  }
}; 