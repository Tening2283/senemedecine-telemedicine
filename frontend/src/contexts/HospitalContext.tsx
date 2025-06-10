import React, { createContext, useContext, useState, useEffect } from 'react';
import { Hospital } from '@/types/auth';

interface HospitalContextType {
  currentHospital: Hospital | null;
  hospitals: Hospital[];
  isLoading: boolean;
  setCurrentHospital: (hospital: Hospital) => void;
  loadHospitals: () => Promise<void>;
}

const HospitalContext = createContext<HospitalContextType | undefined>(undefined);

interface HospitalProviderProps {
  children: React.ReactNode;
}

export const HospitalProvider: React.FC<HospitalProviderProps> = ({ children }) => {
  const [currentHospital, setCurrentHospitalState] = useState<Hospital | null>(null);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const setCurrentHospital = (hospital: Hospital) => {
    setCurrentHospitalState(hospital);
    localStorage.setItem('senemedecine_hospital_id', hospital.id);
  };

  const loadHospitals = async () => {
    setIsLoading(true);
    try {
      // TODO: Implémenter l'appel API pour charger les hôpitaux
      // const response = await hospitalService.getHospitals();
      // setHospitals(response.data);

      // Données de test
      const testHospitals: Hospital[] = [
        {
          id: '1',
          name: 'Hôpital Principal de Dakar',
          code: 'HPD',
          databaseName: 'hopital_dakar',
          status: 'ACTIVE' as any,
          isActive: true,
          bedCount: 200,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      setHospitals(testHospitals);
    } catch (error) {
      console.error('Erreur lors du chargement des hôpitaux:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadHospitals();
  }, []);

  const value: HospitalContextType = {
    currentHospital,
    hospitals,
    isLoading,
    setCurrentHospital,
    loadHospitals,
  };

  return <HospitalContext.Provider value={value}>{children}</HospitalContext.Provider>;
};

export const useHospital = (): HospitalContextType => {
  const context = useContext(HospitalContext);
  if (context === undefined) {
    throw new Error('useHospital must be used within a HospitalProvider');
  }
  return context;
};
