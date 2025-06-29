import { useState, useEffect } from 'react';
import { RendezVous } from '../types';
import apiService from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export const useRendezVous = (page = 1, limit = 100, refreshKey = 0) => {
  console.log('🎯 useRendezVous - Hook appelé avec:', { page, limit, refreshKey });
  
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

        console.log('🔍 useRendezVous - fetchRendezVous appelé avec:', { page, limit, hopitalId, userRole: user?.role });

        const response = await apiService.getRendezVous(page, limit, hopitalId);
        console.log('📦 useRendezVous - réponse reçue:', response);
        console.log('📅 useRendezVous - rendez-vous dans response.data:', response.data);
        // Le service API retourne déjà { data: [...], pagination: {...} }
        setRendezVous(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement des rendez-vous');
        console.error('Erreur useRendezVous:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRendezVous();
  }, [page, limit, user?.role, user?.hopital_id, hopital?.id, refreshKey]);

  return { rendezVous, loading, error };
}; 