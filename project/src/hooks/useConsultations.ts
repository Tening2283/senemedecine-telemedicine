import { useState, useEffect } from 'react';
import { Consultation } from '../types';
import apiService from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export const useConsultations = (page = 1, limit = 100) => {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, hopital } = useAuth();

  useEffect(() => {
    const fetchConsultations = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Déterminer l'hopital_id pour le filtrage
        let hopitalId: string | undefined;
        if (user?.role !== 'ADMIN') {
          hopitalId = user?.hopital_id || hopital?.id;
        }

        const response = await apiService.getConsultations(page, limit, hopitalId);
        setConsultations(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement des consultations');
        console.error('Erreur useConsultations:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchConsultations();
  }, [page, limit, user?.role, user?.hopital_id, hopital?.id]);

  return { consultations, loading, error };
}; 