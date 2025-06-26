import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Hopital, AuthContextType } from '../types';
import apiService from '../services/api';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [hopital, setHopital] = useState<Hopital | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    const savedHopital = localStorage.getItem('hopital');
    
    if (token && savedUser && savedHopital) {
      setUser(JSON.parse(savedUser));
      setHopital(JSON.parse(savedHopital));
      
      // Vérifier si le token est toujours valide
      apiService.getProfile()
        .then(() => {
          // Token valide, rien à faire
        })
        .catch(() => {
          // Token invalide, déconnecter l'utilisateur
          logout();
        });
    }
  }, []);

  const login = async (email: string, password: string, hopitalId: string): Promise<void> => {
    setIsLoading(true);
    
    try {
      const response = await apiService.login({ email, password, hopital_id: hopitalId });
      
      setUser(response.user);
      setHopital(response.hopital);
      
      localStorage.setItem('user', JSON.stringify(response.user));
      localStorage.setItem('hopital', JSON.stringify(response.hopital));
    } catch (error) {
      console.error('Erreur de connexion:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setHopital(null);
    apiService.logout();
    localStorage.removeItem('user');
    localStorage.removeItem('hopital');
  };

  return (
    <AuthContext.Provider value={{ user, hopital, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};