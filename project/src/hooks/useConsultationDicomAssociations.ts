import { useState, useEffect } from 'react';
import { apiService } from '../services/api';

export interface ConsultationDicomAssociation {
  id: string;
  consultation_id: string;
  orthanc_study_id: string;
  created_by: string;
  created_at: string;
  consultation_date?: string;
  consultation_motif?: string;
  patient_nom?: string;
  patient_prenom?: string;
  created_by_nom?: string;
  created_by_prenom?: string;
}

export const useConsultationDicomAssociations = () => {
  const [data, setData] = useState<ConsultationDicomAssociation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAssociations = async () => {
    try {
      setLoading(true);
      const associations = await apiService.getConsultationDicomAssociations();
      setData(associations);
    } catch (err: any) {
      setError(err.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssociations();
  }, []);

  const createAssociation = async (consultationId: string, orthancStudyId: string) => {
    try {
      const result = await apiService.createConsultationDicomAssociation({
        consultation_id: consultationId,
        orthanc_study_id: orthancStudyId
      });
      await fetchAssociations(); // Refresh
      return result;
    } catch (err) {
      throw err;
    }
  };

  const deleteAssociation = async (id: string) => {
    try {
      await apiService.deleteConsultationDicomAssociation(id);
      await fetchAssociations(); // Refresh
    } catch (err) {
      throw err;
    }
  };

  const getAssociationsByConsultation = async (consultationId: string) => {
    try {
      const associations = await apiService.getConsultationDicomAssociationsByConsultation(consultationId);
      return associations;
    } catch (err) {
      throw err;
    }
  };

  return {
    data,
    loading,
    error,
    createAssociation,
    deleteAssociation,
    getAssociationsByConsultation,
    refetch: fetchAssociations
  };
}; 