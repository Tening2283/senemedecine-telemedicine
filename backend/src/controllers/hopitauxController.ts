import { Request, Response } from 'express';
import { db } from '../database/connection';
import { Hopital, ApiResponse, PaginatedResponse } from '../types';

export const getAllHopitaux = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const [hopitaux, total] = await Promise.all([
      db('hopitaux')
        .select('*')
        .orderBy('nom')
        .limit(limit)
        .offset(offset),
      db('hopitaux').count('* as count').first()
    ]);

    const totalCount = (total as any).count;
    const totalPages = Math.ceil(totalCount / limit);

    const response: ApiResponse<PaginatedResponse<Hopital>> = {
      success: true,
      data: {
        data: hopitaux,
        pagination: {
          page,
          limit,
          total: totalCount,
          totalPages
        }
      }
    };

    res.json(response);
  } catch (error) {
    console.error('Erreur lors de la récupération des hôpitaux:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur interne du serveur'
    });
  }
};

export const getHopitalById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const hopital = await db('hopitaux')
      .where({ id, actif: true })
      .first();

    if (!hopital) {
      res.status(404).json({
        success: false,
        error: 'Hôpital non trouvé'
      });
      return;
    }

    res.json({
      success: true,
      data: hopital
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'hôpital:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur interne du serveur'
    });
  }
};

export const createHopital = async (req: Request, res: Response): Promise<void> => {
  try {
    const hopitalData = req.body;

    // Validation des données requises
    if (!hopitalData.nom || !hopitalData.adresse || !hopitalData.telephone || !hopitalData.email || !hopitalData.ville) {
      res.status(400).json({
        success: false,
        error: 'Tous les champs obligatoires doivent être remplis'
      });
      return;
    }

    // Vérifier si l'email existe déjà
    const existingHopital = await db('hopitaux')
      .where({ email: hopitalData.email })
      .first();

    if (existingHopital) {
      res.status(400).json({
        success: false,
        error: 'Un hôpital avec cet email existe déjà'
      });
      return;
    }

    const [newHopital] = await db('hopitaux')
      .insert(hopitalData)
      .returning('*');

    res.status(201).json({
      success: true,
      data: newHopital,
      message: 'Hôpital créé avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la création de l\'hôpital:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur interne du serveur'
    });
  }
};

export const updateHopital = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Vérifier si l'hôpital existe
    const existingHopital = await db('hopitaux')
      .where({ id })
      .first();

    if (!existingHopital) {
      res.status(404).json({
        success: false,
        error: 'Hôpital non trouvé'
      });
      return;
    }

    // Si l'email est modifié, vérifier qu'il n'existe pas déjà
    if (updateData.email && updateData.email !== existingHopital.email) {
      const emailExists = await db('hopitaux')
        .where({ email: updateData.email })
        .whereNot({ id })
        .first();

      if (emailExists) {
        res.status(400).json({
          success: false,
          error: 'Un hôpital avec cet email existe déjà'
        });
        return;
      }
    }

    const [updatedHopital] = await db('hopitaux')
      .where({ id })
      .update({
        ...updateData,
        updated_at: new Date()
      })
      .returning('*');

    if (!updatedHopital) {
      res.status(404).json({
        success: false,
        error: 'Hôpital non trouvé'
      });
      return;
    }

    res.json({
      success: true,
      data: updatedHopital,
      message: 'Hôpital mis à jour avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'hôpital:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur interne du serveur'
    });
  }
};

export const deleteHopital = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Vérifier si l'hôpital existe
    const existingHopital = await db('hopitaux')
      .where({ id })
      .first();

    if (!existingHopital) {
      res.status(404).json({
        success: false,
        error: 'Hôpital non trouvé'
      });
      return;
    }

    // Vérifier s'il y a des utilisateurs ou patients associés
    const [usersCount, patientsCount] = await Promise.all([
      db('users').where({ hopital_id: id }).count('* as count').first(),
      db('patients').where({ hopital_id: id }).count('* as count').first()
    ]);

    if ((usersCount as any).count > 0 || (patientsCount as any).count > 0) {
      res.status(400).json({
        success: false,
        error: 'Impossible de supprimer l\'hôpital car il a des utilisateurs ou patients associés'
      });
      return;
    }

    const deletedCount = await db('hopitaux')
      .where({ id })
      .update({ actif: false });

    if (deletedCount === 0) {
      res.status(404).json({
        success: false,
        error: 'Hôpital non trouvé'
      });
      return;
    }

    res.json({
      success: true,
      message: 'Hôpital supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'hôpital:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur interne du serveur'
    });
  }
}; 