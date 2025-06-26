import { useState, useEffect } from 'react';
import { Hopital } from '../types';
import apiService from '../services/api';

export const useHopitaux = (page = 1, limit = 100) => {
  const [hopitaux, setHopitaux] = useState<Hopital[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHopitaux = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await apiService.getHopitaux(page, limit);
        setHopitaux(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement des hôpitaux');
        console.error('Erreur useHopitaux:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHopitaux();
  }, [page, limit]);

  return { hopitaux, loading, error };
}; 