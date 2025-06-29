import React, { useState, useEffect } from 'react';
import { Search, Plus, Building2, Phone, Mail, MapPin, Users, Activity } from 'lucide-react';
import { mockHopitaux } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api';

const Hopitaux: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newHopital, setNewHopital] = useState({
    nom: '',
    ville: '',
    adresse: '',
    telephone: '',
    email: '',
    actif: true,
  });
  const [formError, setFormError] = useState('');
  const [hopitaux, setHopitaux] = useState<any[]>([]);

  useEffect(() => {
    apiService.getHopitaux().then(res => setHopitaux(res.data));
  }, []);

  // Seuls les admins peuvent voir cette page
  if (user?.role !== 'ADMIN') {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Accès non autorisé
          </h3>
          <p className="text-gray-500">
            Vous n'avez pas les permissions pour accéder à cette page.
          </p>
        </div>
      </div>
    );
  }

  const filteredHopitaux = hopitaux.filter(hopital =>
    hopital.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hopital.ville.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Gestion des Hôpitaux
          </h1>
          <p className="text-gray-600">
            Administration et supervision des établissements de santé
          </p>
        </div>
        
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          onClick={() => setShowCreateModal(true)}
        >
          <Plus className="h-4 w-4" />
          <span>Nouvel hôpital</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher par nom ou ville..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Hôpitaux</p>
              <p className="text-2xl font-bold text-gray-900">{mockHopitaux.length}</p>
            </div>
            <Building2 className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Actifs</p>
              <p className="text-2xl font-bold text-green-600">
                {mockHopitaux.filter(h => h.actif).length}
              </p>
            </div>
            <Activity className="h-8 w-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Villes</p>
              <p className="text-2xl font-bold text-purple-600">
                {new Set(mockHopitaux.map(h => h.ville)).size}
              </p>
            </div>
            <MapPin className="h-8 w-8 text-purple-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Utilisateurs</p>
              <p className="text-2xl font-bold text-orange-600">247</p>
            </div>
            <Users className="h-8 w-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Hospitals List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Liste des hôpitaux ({filteredHopitaux.length})
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          {filteredHopitaux.map((hopital) => (
            <div key={hopital.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Building2 className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{hopital.nom}</h3>
                    <p className="text-sm text-gray-500">{hopital.ville}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  hopital.actif ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {hopital.actif ? 'Actif' : 'Inactif'}
                </span>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{hopital.adresse}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Phone className="h-4 w-4" />
                  <span>{hopital.telephone}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span>{hopital.email}</span>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button className="flex-1 bg-blue-50 text-blue-600 py-2 px-3 rounded text-sm font-medium hover:bg-blue-100 transition-colors">
                  Voir détails
                </button>
                <button className="flex-1 bg-gray-50 text-gray-600 py-2 px-3 rounded text-sm font-medium hover:bg-gray-100 transition-colors">
                  Modifier
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredHopitaux.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucun hôpital trouvé
            </h3>
            <p className="text-gray-500">
              {searchTerm ? 'Aucun hôpital ne correspond à votre recherche.' : 'Aucun hôpital enregistré.'}
            </p>
          </div>
        )}
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Nouvel hôpital</h2>
            {formError && <div className="text-red-600 mb-2">{formError}</div>}
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setFormError('');
                try {
                  // Appel API pour créer l'hôpital
                  const created = await apiService.createHopital(newHopital);
                  setHopitaux(prev => [...prev, created]);
                  setShowCreateModal(false);
                  setNewHopital({ nom: '', ville: '', adresse: '', telephone: '', email: '', actif: true });
                } catch (err: any) {
                  setFormError(err.message || "Erreur lors de la création");
                }
              }}
            >
              <input
                className="w-full border rounded px-3 py-2 mb-2"
                placeholder="Nom de l'hôpital"
                required
                value={newHopital.nom}
                onChange={e => setNewHopital(f => ({ ...f, nom: e.target.value }))}
              />
              <input
                className="w-full border rounded px-3 py-2 mb-2"
                placeholder="Ville"
                required
                value={newHopital.ville}
                onChange={e => setNewHopital(f => ({ ...f, ville: e.target.value }))}
              />
              <input
                className="w-full border rounded px-3 py-2 mb-2"
                placeholder="Adresse"
                required
                value={newHopital.adresse}
                onChange={e => setNewHopital(f => ({ ...f, adresse: e.target.value }))}
              />
              <input
                className="w-full border rounded px-3 py-2 mb-2"
                placeholder="Téléphone"
                required
                value={newHopital.telephone}
                onChange={e => setNewHopital(f => ({ ...f, telephone: e.target.value }))}
              />
              <input
                className="w-full border rounded px-3 py-2 mb-2"
                placeholder="Email"
                required
                value={newHopital.email}
                onChange={e => setNewHopital(f => ({ ...f, email: e.target.value }))}
              />
              <div className="flex justify-end space-x-2 mt-4">
                <button type="button" className="px-4 py-2 rounded bg-gray-200" onClick={() => setShowCreateModal(false)}>
                  Annuler
                </button>
                <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white">
                  Créer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Hopitaux;