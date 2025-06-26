import { useState, useEffect } from 'react';
import { RendezVous } from '../types';
import apiService from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export const useRendezVous = (page = 1, limit = 100) => {
  const [rendezVous, setRendezVous] = useState<RendezVous[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, hopital } = useAuth();

  useEffect(() => {
    const fetchRendezVous = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Déterminer l'hopital_id pour le filtrage
        let hopitalId: string | undefined;
        if (user?.role !== 'ADMIN') {
          hopitalId = user?.hopital_id || hopital?.id;
        }

        const response = await apiService.getRendezVous(page, limit, hopitalId);
        setRendezVous(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement des rendez-vous');
        console.error('Erreur useRendezVous:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRendezVous();
  }, [page, limit, user?.role, user?.hopital_id, hopital?.id]);

  return { rendezVous, loading, error };
}; 