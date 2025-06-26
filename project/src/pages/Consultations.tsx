import React, { useState } from 'react';
import { Search, Plus, Calendar, FileText, Eye, Activity, Loader2 } from 'lucide-react';
import { useConsultations } from '../hooks/useConsultations';
import { usePatients } from '../hooks/usePatients';
import { useAuth } from '../contexts/AuthContext';

const Consultations: React.FC = () => {
  const { user, hopital } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const { consultations, loading: loadingConsultations, error: errorConsultations } = useConsultations();
  const { patients, loading: loadingPatients, error: errorPatients } = usePatients();

  const getFilteredConsultations = () => {
    let filteredConsultations = consultations;
    
    // Filtrer par médecin si c'est un médecin
    if (user?.role === 'MEDECIN') {
      filteredConsultations = filteredConsultations.filter(c => c.medecin_id === user.id);
    }

    // Filtrer par terme de recherche
    if (searchTerm) {
      filteredConsultations = filteredConsultations.filter(consultation => {
        const patient = patients.find(p => p.id === consultation.patient_id);
        return (
          patient?.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient?.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
          consultation.motif.toLowerCase().includes(searchTerm.toLowerCase()) ||
          consultation.diagnostic?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }

    // Filtrer par statut
    if (selectedStatus) {
      filteredConsultations = filteredConsultations.filter(c => c.statut === selectedStatus);
    }

    return filteredConsultations;
  };

  const filteredConsultations = getFilteredConsultations();

  if (loadingConsultations || loadingPatients) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Chargement des consultations...</p>
        </div>
      </div>
    );
  }

  if (errorConsultations || errorPatients) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <FileText className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Erreur de chargement
          </h3>
          <p className="text-gray-500">
            {errorConsultations || errorPatients}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Consultations
          </h1>
          <p className="text-gray-600">
            Gestion des consultations de {hopital?.nom || 'tous les hôpitaux'}
          </p>
        </div>
        
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Nouvelle consultation</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par patient, motif ou diagnostic..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Tous les statuts</option>
            <option value="PROGRAMMEE">Programmée</option>
            <option value="EN_COURS">En cours</option>
            <option value="TERMINEE">Terminée</option>
            <option value="ANNULEE">Annulée</option>
          </select>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{filteredConsultations.length}</p>
            </div>
            <FileText className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Terminées</p>
              <p className="text-2xl font-bold text-green-600">
                {filteredConsultations.filter(c => c.statut === 'TERMINEE').length}
              </p>
            </div>
            <div className="bg-green-100 p-2 rounded-lg">
              <FileText className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">En cours</p>
              <p className="text-2xl font-bold text-blue-600">
                {filteredConsultations.filter(c => c.statut === 'EN_COURS').length}
              </p>
            </div>
            <div className="bg-blue-100 p-2 rounded-lg">
              <Activity className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Programmées</p>
              <p className="text-2xl font-bold text-yellow-600">
                {filteredConsultations.filter(c => c.statut === 'PROGRAMMEE').length}
              </p>
            </div>
            <div className="bg-yellow-100 p-2 rounded-lg">
              <Calendar className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Consultations List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            Liste des consultations ({filteredConsultations.length})
          </h2>
        </div>
        
        {filteredConsultations.length === 0 ? (
          <div className="p-6 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">
              {searchTerm || selectedStatus ? 'Aucune consultation trouvée pour ces critères.' : 'Aucune consultation enregistrée.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Motif
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
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
                {filteredConsultations.map((consultation) => {
                  const patient = patients.find(p => p.id === consultation.patient_id);
                  return (
                    <tr key={consultation.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                            <Activity className="h-5 w-5 text-green-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {patient ? `${patient.prenom} ${patient.nom}` : 'Patient inconnu'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {patient?.numero_patient}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{consultation.motif}</div>
                        {consultation.diagnostic && (
                          <div className="text-sm text-gray-500">{consultation.diagnostic}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(consultation.date).toLocaleDateString('fr-FR')}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(consultation.date).toLocaleTimeString('fr-FR', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          consultation.statut === 'TERMINEE' ? 'bg-green-100 text-green-800' :
                          consultation.statut === 'EN_COURS' ? 'bg-yellow-100 text-yellow-800' :
                          consultation.statut === 'PROGRAMMEE' ? 'bg-blue-100 text-blue-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {consultation.statut.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-3">
                          <Eye className="h-4 w-4 inline mr-1" />
                          Voir
                        </button>
                        <button className="text-green-600 hover:text-green-900 mr-3">
                          Modifier
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Consultations; 