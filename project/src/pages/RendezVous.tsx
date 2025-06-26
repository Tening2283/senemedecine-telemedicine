import React, { useState } from 'react';
import { Search, Plus, Calendar, Clock, User, Phone, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { mockRendezVous, mockPatients, mockUsers } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';

const RendezVous: React.FC = () => {
  const { user, hopital } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  const getFilteredRendezVous = () => {
    let filteredRdv = mockRendezVous;
    
    // Filtrer par hôpital si pas admin
    if (user?.role !== 'ADMIN') {
      const hopitalId = user?.hopital_id || hopital?.id;
      filteredRdv = mockRendezVous.filter(r => r.hopital_id === hopitalId);
    }

    // Filtrer par médecin si c'est un médecin
    if (user?.role === 'MEDECIN') {
      filteredRdv = filteredRdv.filter(r => r.medecin_id === user.id);
    }

    // Filtrer par terme de recherche
    if (searchTerm) {
      filteredRdv = filteredRdv.filter(rdv => {
        const patient = mockPatients.find(p => p.id === rdv.patient_id);
        return (
          patient?.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient?.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
          rdv.motif.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }

    // Filtrer par statut
    if (selectedStatus) {
      filteredRdv = filteredRdv.filter(r => r.statut === selectedStatus);
    }

    // Filtrer par date
    if (selectedDate) {
      filteredRdv = filteredRdv.filter(r => r.date === selectedDate);
    }

    return filteredRdv;
  };

  const rendezVous = getFilteredRendezVous();

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'CONFIRME':
        return 'bg-green-100 text-green-800';
      case 'EN_ATTENTE':
        return 'bg-yellow-100 text-yellow-800';
      case 'ANNULE':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (statut: string) => {
    switch (statut) {
      case 'CONFIRME':
        return <CheckCircle className="h-4 w-4" />;
      case 'EN_ATTENTE':
        return <AlertCircle className="h-4 w-4" />;
      case 'ANNULE':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {user?.role === 'MEDECIN' ? 'Mes rendez-vous' : 'Gestion des rendez-vous'}
          </h1>
          <p className="text-gray-600">
            Planification et suivi des rendez-vous médicaux
          </p>
        </div>
        
        {(user?.role === 'SECRETAIRE' || user?.role === 'ADMIN') && (
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
            <Plus className="h-4 w-4" />
            <span>Nouveau rendez-vous</span>
          </button>
        )}
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par patient ou motif..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="flex space-x-2">
            <select 
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Tous les statuts</option>
              <option value="CONFIRME">Confirmé</option>
              <option value="EN_ATTENTE">En attente</option>
              <option value="ANNULE">Annulé</option>
            </select>
            
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{rendezVous.length}</p>
            </div>
            <Calendar className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Confirmés</p>
              <p className="text-2xl font-bold text-green-600">
                {rendezVous.filter(r => r.statut === 'CONFIRME').length}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">En attente</p>
              <p className="text-2xl font-bold text-yellow-600">
                {rendezVous.filter(r => r.statut === 'EN_ATTENTE').length}
              </p>
            </div>
            <AlertCircle className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Annulés</p>
              <p className="text-2xl font-bold text-red-600">
                {rendezVous.filter(r => r.statut === 'ANNULE').length}
              </p>
            </div>
            <XCircle className="h-8 w-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Appointments List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Liste des rendez-vous ({rendezVous.length})
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Heure
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Médecin
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Motif
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rendezVous.map((rdv) => {
                const patient = mockPatients.find(p => p.id === rdv.patient_id);
                const medecin = mockUsers.find(u => u.id === rdv.medecin_id);
                return (
                  <tr key={rdv.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="bg-blue-100 p-2 rounded-full mr-3">
                          <User className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {patient?.prenom} {patient?.nom}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <Phone className="h-3 w-3 mr-1" />
                            {patient?.telephone}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(rdv.date).toLocaleDateString('fr-FR')}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {rdv.heure}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        Dr. {medecin?.prenom} {medecin?.nom}
                      </div>
                      <div className="text-sm text-gray-500">
                        {medecin?.specialite}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {rdv.motif}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`flex items-center space-x-1 px-2 py-1 text-xs rounded-full w-fit ${getStatusColor(rdv.statut)}`}>
                        {getStatusIcon(rdv.statut)}
                        <span>{rdv.statut.replace('_', ' ')}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          Voir
                        </button>
                        {(user?.role === 'SECRETAIRE' || user?.role === 'ADMIN') && rdv.statut !== 'ANNULE' && (
                          <>
                            <button className="text-green-600 hover:text-green-900">
                              Confirmer
                            </button>
                            <button className="text-red-600 hover:text-red-900">
                              Annuler
                            </button>
                          </>
                        )}
                        {user?.role === 'MEDECIN' && rdv.statut === 'CONFIRME' && (
                          <button className="text-purple-600 hover:text-purple-900">
                            Consulter
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {rendezVous.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucun rendez-vous trouvé
            </h3>
            <p className="text-gray-500">
              {searchTerm ? 'Aucun rendez-vous ne correspond à votre recherche.' : 'Aucun rendez-vous programmé.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RendezVous;