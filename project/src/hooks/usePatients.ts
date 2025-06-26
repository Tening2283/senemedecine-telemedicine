import { useState, useEffect } from 'react';
import { Patient } from '../types';
import apiService from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export const usePatients = (page = 1, limit = 100) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, hopital } = useAuth();

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Déterminer l'hopital_id pour le filtrage
        let hopitalId: string | undefined;
        if (user?.role !== 'ADMIN') {
          hopitalId = user?.hopital_id || hopital?.id;
        }

        const response = await apiService.getPatients(page, limit, hopitalId);
        setPatients(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement des patients');
        console.error('Erreur usePatients:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, [page, limit, user?.role, user?.hopital_id, hopital?.id]);

  return { patients, loading, error };
}; 