import { Request, Response } from 'express';
import { db } from '../database/connection';

export const getConsultationDicomAssociations = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const consultationId = req.query.consultation_id as string;
    const hopitalId = req.query.hopital_id as string;
    const offset = (page - 1) * limit;

    let query = db('consultation_dicom_associations')
      .select(
        'consultation_dicom_associations.*',
        'consultations.date as consultation_date',
        'consultations.motif as consultation_motif',
        'patients.nom as patient_nom',
        'patients.prenom as patient_prenom',
        'users.nom as created_by_nom',
        'users.prenom as created_by_prenom'
      )
      .join('consultations', 'consultation_dicom_associations.consultation_id', 'consultations.id')
      .join('patients', 'consultations.patient_id', 'patients.id')
      .join('users', 'consultation_dicom_associations.created_by', 'users.id');

    if (consultationId) {
      query = query.where('consultation_dicom_associations.consultation_id', consultationId);
    }

    if (hopitalId) {
      query = query.where('consultations.hopital_id', hopitalId);
    }

    const associations = await query.limit(limit).offset(offset);
    const total = await db('consultation_dicom_associations')
      .join('consultations', 'consultation_dicom_associations.consultation_id', 'consultations.id')
      .modify((queryBuilder) => {
        if (consultationId) queryBuilder.where('consultation_dicom_associations.consultation_id', consultationId);
        if (hopitalId) queryBuilder.where('consultations.hopital_id', hopitalId);
      })
      .count('* as count')
      .first();

    const totalCount = total ? parseInt(total.count as string) : 0;

    const response = {
      success: true,
      data: {
        data: associations,
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
    console.error('Erreur lors de la récupération des associations DICOM:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur interne du serveur'
    });
  }
};

export const createConsultationDicomAssociation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { consultation_id, orthanc_study_id } = req.body;
    const created_by = (req as any).user.id;

    // Vérifier que la consultation existe
    const consultation = await db('consultations').where({ id: consultation_id }).first();
    if (!consultation) {
      res.status(404).json({
        success: false,
        error: 'Consultation non trouvée'
      });
      return;
    }

    // Vérifier qu'il n'y a pas déjà une association
    const existingAssociation = await db('consultation_dicom_associations')
      .where({ consultation_id, orthanc_study_id })
      .first();

    if (existingAssociation) {
      res.status(400).json({
        success: false,
        error: 'Cette association existe déjà'
      });
      return;
    }

    const [newAssociation] = await db('consultation_dicom_associations')
      .insert({
        consultation_id,
        orthanc_study_id,
        created_by
      })
      .returning('*');

    res.status(201).json({
      success: true,
      data: newAssociation
    });
  } catch (error) {
    console.error('Erreur lors de la création de l\'association DICOM:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur interne du serveur'
    });
  }
};

export const deleteConsultationDicomAssociation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const deleted = await db('consultation_dicom_associations').where({ id }).del();

    if (!deleted) {
      res.status(404).json({
        success: false,
        error: 'Association non trouvée'
      });
      return;
    }

    res.json({
      success: true,
      message: 'Association supprimée avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'association DICOM:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur interne du serveur'
    });
  }
};

export const getConsultationDicomAssociationsByConsultation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { consultationId } = req.params;

    const associations = await db('consultation_dicom_associations')
      .select(
        'consultation_dicom_associations.*',
        'users.nom as created_by_nom',
        'users.prenom as created_by_prenom'
      )
      .join('users', 'consultation_dicom_associations.created_by', 'users.id')
      .where('consultation_dicom_associations.consultation_id', consultationId);

    const response = {
      success: true,
      data: associations
    };

    res.json(response);
  } catch (error) {
    console.error('Erreur lors de la récupération des associations DICOM de la consultation:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur interne du serveur'
    });
  }
}; 