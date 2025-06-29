import React, { useState, useEffect } from 'react';
import { Search, Plus, Calendar, Clock, User, Phone, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';
import { usePatients } from '../hooks/usePatients';
import { useRendezVous } from '../hooks/useRendezVous';
import { useHopitaux } from '../hooks/useHopitaux';

const RendezVous: React.FC = () => {
  const { user, hopital } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedRdv, setSelectedRdv] = useState<any | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [form, setForm] = useState({
    patient_id: '',
    medecin_id: user?.id || '',
    date: '',
    heure: '',
    motif: '',
    statut: 'EN_ATTENTE',
    hopital_id: hopital?.id || '',
  });
  const [formError, setFormError] = useState('');
  
  // Utiliser les hooks pour récupérer les vraies données
  const { rendezVous, loading, error } = useRendezVous(1, 100, refreshKey);
  const { patients, loading: patientsLoading, error: patientsError } = usePatients(1, 100, refreshKey);
  const { hopitaux } = useHopitaux();
  const [users, setUsers] = useState<any[]>([]);

  // Récupérer les utilisateurs (médecins)
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await apiService.getUsers();
        setUsers(response);
      } catch (err) {
        console.error('Erreur lors du chargement des utilisateurs:', err);
      }
    };
    fetchUsers();
  }, []);

  // Fonction pour rafraîchir les données
  const refreshData = () => {
    setRefreshKey(prev => prev + 1);
  };

  const getFilteredRendezVous = () => {
    let filteredRdv = rendezVous;
    
    // Protection : si patients n'est pas encore chargé, retourner les rendez-vous sans filtrage par patient
    if (!patients || !Array.isArray(patients)) {
      return filteredRdv;
    }
    
    // Filtrer par hôpital si pas admin
    if (user?.role !== 'ADMIN') {
      const hopitalId = user?.hopital_id || hopital?.id;
      filteredRdv = rendezVous.filter(r => r.hopital_id === hopitalId);
    }

    // Filtrer par médecin si c'est un médecin
    if (user?.role === 'MEDECIN') {
      filteredRdv = filteredRdv.filter(r => r.medecin_id === user.id);
    }

    // Filtrer par terme de recherche
    if (searchTerm) {
      filteredRdv = filteredRdv.filter(rdv => {
        const patient = patients?.find(p => p.id === rdv.patient_id);
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

  const rendezVousFiltered = getFilteredRendezVous();

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

  const handleView = (rdv: any) => {
    setSelectedRdv(rdv);
    setEditMode(false);
  };

  const handleConfirm = async (id: string) => {
    try {
      await apiService.updateRendezVous(id, { statut: 'CONFIRME' });
      refreshData(); // Rafraîchir les données
    } catch (err) {
      console.error('Erreur lors de la confirmation:', err);
    }
  };

  const handleCancel = async (id: string) => {
    try {
      await apiService.updateRendezVous(id, { statut: 'ANNULE' });
      refreshData(); // Rafraîchir les données
    } catch (err) {
      console.error('Erreur lors de l\'annulation:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Affichage des erreurs */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>Erreur :</strong> {error}
        </div>
      )}

      {patientsError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>Erreur patients :</strong> {patientsError}
        </div>
      )}

      {/* Affichage du chargement */}
      {loading && (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
          Chargement des rendez-vous...
        </div>
      )}

      {patientsLoading && (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
          Chargement des patients...
        </div>
      )}

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
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            onClick={() => setShowCreateModal(true)}
          >
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
              <p className="text-2xl font-bold text-gray-900">{rendezVousFiltered.length}</p>
            </div>
            <Calendar className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Confirmés</p>
              <p className="text-2xl font-bold text-green-600">
                {rendezVousFiltered.filter(r => r.statut === 'CONFIRME').length}
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
                {rendezVousFiltered.filter(r => r.statut === 'EN_ATTENTE').length}
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
                {rendezVousFiltered.filter(r => r.statut === 'ANNULE').length}
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
            Liste des rendez-vous ({rendezVousFiltered.length})
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
              {rendezVousFiltered.map((rdv) => {
                const patient = patients?.find(p => p.id === rdv.patient_id);
                return (
                  <tr key={rdv.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="bg-blue-100 p-2 rounded-full mr-3">
                          <User className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {patient
                              ? `${patient.prenom} ${patient.nom}`
                              : <span className="text-red-500">Patient inconnu (id: {rdv.patient_id})</span>
                            }
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
                        Dr. {users?.find(u => u.id === rdv.medecin_id)?.prenom} {users?.find(u => u.id === rdv.medecin_id)?.nom}
                      </div>
                      <div className="text-sm text-gray-500">
                        {users?.find(u => u.id === rdv.medecin_id)?.specialite}
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
                        <button className="text-blue-600 hover:text-blue-900" onClick={() => handleView(rdv)}>
                          Voir
                        </button>
                        {(user?.role === 'SECRETAIRE' || user?.role === 'ADMIN') && rdv.statut !== 'ANNULE' && (
                          <>
                            <button className="text-green-600 hover:text-green-900" onClick={() => handleConfirm(rdv.id)}>
                              Confirmer
                            </button>
                            <button className="text-red-600 hover:text-red-900" onClick={() => handleCancel(rdv.id)}>
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

        {rendezVousFiltered.length === 0 && (
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

      {selectedRdv && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Détails du rendez-vous</h2>
            <div className="space-y-2">
              <div><b>Patient :</b> {patients?.find(p => p.id === selectedRdv.patient_id)?.prenom} {patients?.find(p => p.id === selectedRdv.patient_id)?.nom}</div>
              <div><b>Médecin :</b> Dr. {users?.find(u => u.id === selectedRdv.medecin_id)?.prenom} {users?.find(u => u.id === selectedRdv.medecin_id)?.nom}</div>
              <div><b>Date :</b> {new Date(selectedRdv.date).toLocaleDateString('fr-FR')} {selectedRdv.heure}</div>
              <div><b>Motif :</b> {selectedRdv.motif}</div>
              <div><b>Statut :</b> {selectedRdv.statut}</div>
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                className="px-4 py-2 rounded bg-gray-200"
                onClick={() => setSelectedRdv(null)}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Nouveau rendez-vous</h2>
            {formError && <div className="text-red-600 mb-2">{formError}</div>}
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setFormError('');
                try {
                  const newRdv = await apiService.createRendezVous({
                    ...form,
                    statut: form.statut as "EN_ATTENTE" | "CONFIRME" | "ANNULE"
                  });
                  refreshData(); // Rafraîchir les données après création
                  setShowCreateModal(false);
                  setForm({
                    patient_id: '',
                    medecin_id: user?.id || '',
                    date: '',
                    heure: '',
                    motif: '',
                    statut: 'EN_ATTENTE',
                    hopital_id: hopital?.id || '',
                  });
                } catch (err: any) {
                  setFormError(err.message || "Erreur lors de la création");
                }
              }}
              className="space-y-4"
            >
              <select
                className="w-full border rounded px-3 py-2"
                required
                value={form.patient_id}
                onChange={e => setForm(f => ({ ...f, patient_id: e.target.value }))}
              >
                <option value="">Sélectionner un patient</option>
                {patients?.map((p) => (
                  <option key={p.id} value={p.id}>{p.prenom} {p.nom}</option>
                ))}
              </select>
              <input
                className="w-full border rounded px-3 py-2"
                type="date"
                required
                value={form.date}
                onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
              />
              <input
                className="w-full border rounded px-3 py-2"
                type="time"
                required
                value={form.heure}
                onChange={e => setForm(f => ({ ...f, heure: e.target.value }))}
              />
              <input
                className="w-full border rounded px-3 py-2"
                placeholder="Motif"
                required
                value={form.motif}
                onChange={e => setForm(f => ({ ...f, motif: e.target.value }))}
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  className="px-4 py-2 rounded bg-gray-200"
                  onClick={() => setShowCreateModal(false)}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-blue-600 text-white"
                >
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

export default RendezVous;