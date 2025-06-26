import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import apiService from '../../services/api';
import { Activity, Building2, Mail, Lock, Loader2 } from 'lucide-react';
import { Hopital } from '../../types';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hopitalId, setHopitalId] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();
  const [hopitaux, setHopitaux] = useState<Hopital[]>([]);
  const [loadingHopitaux, setLoadingHopitaux] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password || !hopitalId) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    try {
      await login(email, password, hopitalId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de connexion');
    }
  };

  const demoCredentials = [
    { email: 'admin@senemedecine.sn', role: 'Administrateur', password: 'password123' },
    { email: 'dr.fall@hopital-dakar.sn', role: 'Médecin', password: 'password123' },
    { email: 'sec.ndiaye@hopital-dakar.sn', role: 'Secrétaire', password: 'password123' },
    { email: 'patient.sow@email.sn', role: 'Patient', password: 'password123' }
  ];

  useEffect(() => {
    const loadHopitaux = async () => {
      try {
        setLoadingHopitaux(true);
        const apiResponse = await apiService.getHopitaux(1, 100);
        console.log("DEBUG: Full API response from getHopitaux:", apiResponse);
        if (apiResponse && Array.isArray(apiResponse.data)) {
          setHopitaux(apiResponse.data);
          console.log("Hôpitaux chargés:", apiResponse.data);
        } else {
          console.warn("Réponse API inattendue ou données manquantes:", apiResponse);
          setHopitaux([]);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des hôpitaux:', error);
        setHopitaux([]);
      } finally {
        setLoadingHopitaux(false);
      }
    };

    loadHopitaux();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="bg-blue-600 p-3 rounded-full">
              <Activity className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            SeneMedecine
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Plateforme de télémédecine et téléradiologie
          </p>
        </div>

        <div className="bg-white py-8 px-6 shadow-xl rounded-lg">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="hopital" className="block text-sm font-medium text-gray-700">
                Hôpital
              </label>
              <div className="mt-1 relative">
                <Building2 className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <select
                  id="hopital"
                  value={hopitalId}
                  onChange={(e) => setHopitalId(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                  disabled={loadingHopitaux}
                >
                  <option value="">
                    {loadingHopitaux ? 'Chargement...' : 'Sélectionner un hôpital'}
                  </option>
                  {hopitaux.map((hopital) => (
                    <option key={hopital.id} value={hopital.id}>
                      {hopital.nom} - {hopital.ville}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Adresse email
              </label>
              <div className="mt-1 relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="votre.email@hopital.sn"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Mot de passe
              </label>
              <div className="mt-1 relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || loadingHopitaux}
              className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                  Connexion...
                </>
              ) : (
                'Se connecter'
              )}
            </button>
          </form>

          <div className="mt-6 border-t border-gray-200 pt-6">
            <h4 className="text-sm font-medium text-gray-900 mb-3">
              Comptes de démonstration :
            </h4>
            <div className="space-y-2">
              {demoCredentials.map((cred, index) => (
                <div key={index} className="text-xs bg-gray-50 p-2 rounded">
                  <div className="font-medium text-gray-700">{cred.role}</div>
                  <div className="text-gray-600">{cred.email}</div>
                  <div className="text-gray-500">Mot de passe: {cred.password}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;