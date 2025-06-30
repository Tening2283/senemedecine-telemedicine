import { useEffect, useState } from 'react';
import { apiStats } from '../services/api';

export function useStats() {
  const [consultationsParMois, setConsultationsParMois] = useState([]);
  const [repartitionRoles, setRepartitionRoles] = useState([]);
  const [patientsParHopital, setPatientsParHopital] = useState([]);
  const [consultationsParHopital, setConsultationsParHopital] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      apiStats.getConsultationsParMois(),
      apiStats.getRepartitionRoles(),
      apiStats.getPatientsParHopital(),
      apiStats.getConsultationsParHopital()
    ])
      .then(([mois, roles, patients, consultations]) => {
        setConsultationsParMois(mois);
        setRepartitionRoles(roles);
        setPatientsParHopital(patients);
        setConsultationsParHopital(consultations);
      })
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, []);

  return {
    consultationsParMois,
    repartitionRoles,
    patientsParHopital,
    consultationsParHopital,
    loading,
    error
  };
} 