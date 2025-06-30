import React, { useState, useEffect } from 'react';
import { Search, Plus, Calendar, FileText, Eye, Activity, Loader2, Link, EyeOff, Edit, Trash2, User, Stethoscope } from 'lucide-react';
import { useConsultations } from '../hooks/useConsultations';
import { usePatients } from '../hooks/usePatients';
import { useConsultationDicomAssociations } from '../hooks/useConsultationDicomAssociations';
import apiService from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { User as UserType } from '../types';

const Consultations: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const { consultations: consultationsFromHook, loading: loadingConsultations, error: errorConsultations } = useConsultations();
  const { patients, loading: loadingPatients, error: errorPatients } = usePatients();
  const { data: consultationDicomAssociations, loading: loadingConsultationDicomAssociations, error: errorConsultationDicomAssociations } = useConsultationDicomAssociations();
  const [consultations, setConsultations] = useState<any[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    patient_id: '',
    motif: '',
    diagnostic: '',
    date: '',
    statut: 'PROGRAMMEE',
  });
  const [formError, setFormError] = useState('');
  const [selectedConsultation, setSelectedConsultation] = useState<any | null>(null);
  const [editMode, setEditMode] = useState(false);
  const { user, hopital } = useAuth();
  const [users, setUsers] = useState<UserType[]>([]);

  useEffect(() => {
    setConsultations(consultationsFromHook);
  }, [consultationsFromHook]);

  useEffect(() => {
    apiService.getUsers().then(setUsers).catch(() => setUsers([]));
  }, []);

  const getFilteredConsultations = () => {
    let filteredConsultations = consultations;
    
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

  // Fonction pour vérifier les associations DICOM
  const getDicomAssociationsForConsultation = (consultationId: string) => {
    return consultationDicomAssociations.filter((assoc: any) => assoc.consultation_id === consultationId);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cette consultation ?")) return;
    setDeletingId(id);
    try {
      await apiService.deleteConsultation(id);
      setConsultations((prev) => prev.filter((c) => c.id !== id));
    } catch (err: any) {
      alert(err.message || "Erreur lors de la suppression");
    } finally {
      setDeletingId(null);
    }
  };

  const handleView = (consultation: any) => {
    setSelectedConsultation(consultation);
    setEditMode(false);
  };

  const handleEdit = (consultation: any) => {
    setSelectedConsultation(consultation);
    setEditMode(true);
  };

  const handleCreate = () => {
    setSelectedConsultation(null);
    setEditMode(false);
    setShowCreateModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedConsultation) {
        await apiService.updateConsultation(selectedConsultation.id, {
          ...form,
          statut: form.statut as "PROGRAMMEE" | "EN_COURS" | "TERMINEE" | "ANNULEE",
        });
      } else {
        await apiService.createConsultation({
          patient_id: form.patient_id,
          motif: form.motif,
          diagnostic: form.diagnostic,
          date: form.date,
          statut: form.statut as "PROGRAMMEE" | "EN_COURS" | "TERMINEE" | "ANNULEE",
          hopital_id: hopital!.id,
          medecin_id: user!.id,
        });
        const result = await apiService.getConsultations();
        setConsultations(result.data);
      }
      setShowCreateModal(false);
      setForm({
        patient_id: '',
        motif: '',
        diagnostic: '',
        date: '',
        statut: 'PROGRAMMEE',
      });
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const handleDiagnosisSelect = (diagnosis: string) => {
    setForm(prev => ({ ...prev, diagnostic: diagnosis }));
  };

  const handleTreatmentSelect = (treatment: string) => {
    setForm(prev => ({ ...prev, traitement: treatment }));
  };

  if (loadingConsultations || loadingPatients || loadingConsultationDicomAssociations) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Chargement des consultations...</p>
        </div>
      </div>
    );
  }

  if (errorConsultations || errorPatients || errorConsultationDicomAssociations) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <FileText className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Erreur de chargement
          </h3>
          <p className="text-gray-500">
            {errorConsultations || errorPatients || errorConsultationDicomAssociations}
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
        
        <div className="flex space-x-3">
          <button
            onClick={handleCreate}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Nouvelle consultation</span>
          </button>
        </div>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Nouvelle consultation</h2>
            {formError && <div className="text-red-600 mb-2">{formError}</div>}
            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Patient
                  </label>
                  <select
                    value={form.patient_id}
                    onChange={(e) => setForm(f => ({ ...f, patient_id: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Sélectionner un patient...</option>
                    {patients.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.prenom} {p.nom}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Motif
                  </label>
                  <input
                    type="text"
                    value={form.motif}
                    onChange={(e) => setForm(f => ({ ...f, motif: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Diagnostic
                </label>
                <input
                  type="text"
                  value={form.diagnostic}
                  onChange={(e) => setForm(f => ({ ...f, diagnostic: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="datetime-local"
                  value={form.date}
                  onChange={(e) => setForm(f => ({ ...f, date: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Statut
                </label>
                <select
                  value={form.statut}
                  onChange={(e) => setForm(f => ({ ...f, statut: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="PROGRAMMEE">Programmée</option>
                  <option value="EN_COURS">En cours</option>
                  <option value="TERMINEE">Terminée</option>
                  <option value="ANNULEE">Annulée</option>
                </select>
              </div>
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
                  disabled={creating}
                >
                  {creating ? 'Création...' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
                    DICOM
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
                      <td className="px-6 py-4 whitespace-nowrap">
                        {(() => {
                          const dicomAssociations = getDicomAssociationsForConsultation(consultation.id);
                          if (dicomAssociations.length === 0) {
                            return (
                              <div className="flex items-center text-gray-400">
                                <EyeOff className="h-4 w-4 mr-1" />
                                <span className="text-xs">Aucune</span>
                              </div>
                            );
                          }
                          return (
                            <div className="flex items-center text-green-600">
                              <Link className="h-4 w-4 mr-1" />
                              <span className="text-xs font-medium">
                                {dicomAssociations.length} image{dicomAssociations.length > 1 ? 's' : ''}
                              </span>
                            </div>
                          );
                        })()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900" onClick={() => handleView(consultation)}>
                          Voir
                        </button>
                        <button className="text-green-600 hover:text-green-900" onClick={() => handleEdit(consultation)}>
                          Modifier
                        </button>
                        <button className="text-red-600 hover:text-red-900" onClick={() => handleDelete(consultation.id)}>
                          Désactiver
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

      {selectedConsultation && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editMode ? "Modifier la consultation" : "Détails de la consultation"}
            </h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (editMode) {
                  // Appel API pour update
                  try {
                    const updated = await apiService.updateConsultation(selectedConsultation.id, {
                      ...selectedConsultation,
                      statut: selectedConsultation.statut as "PROGRAMMEE" | "EN_COURS" | "TERMINEE" | "ANNULEE",
                    });
                    setConsultations((prev) =>
                      prev.map((c) => (c.id === updated.id ? updated : c))
                    );
                    setSelectedConsultation(null);
                  } catch (err: any) {
                    alert(err.message || "Erreur lors de la modification");
                  }
                } else {
                  setSelectedConsultation(null);
                }
              }}
              className="space-y-4"
            >
              <div>
                <label>Patient</label>
                <input
                  className="w-full border rounded px-3 py-2"
                  value={
                    patients.find((p) => p.id === selectedConsultation.patient_id)?.prenom +
                    " " +
                    patients.find((p) => p.id === selectedConsultation.patient_id)?.nom
                  }
                  disabled
                />
              </div>
              <div>
                <label>Motif</label>
                <input
                  className="w-full border rounded px-3 py-2"
                  value={selectedConsultation.motif}
                  disabled={!editMode}
                  onChange={(e) =>
                    setSelectedConsultation((c: any) => ({ ...c, motif: e.target.value }))
                  }
                />
              </div>
              <div>
                <label>Diagnostic</label>
                <input
                  className="w-full border rounded px-3 py-2"
                  value={selectedConsultation.diagnostic}
                  disabled={!editMode}
                  onChange={(e) =>
                    setSelectedConsultation((c: any) => ({ ...c, diagnostic: e.target.value }))
                  }
                />
              </div>
              <div>
                <label>Date</label>
                <input
                  className="w-full border rounded px-3 py-2"
                  type="datetime-local"
                  value={selectedConsultation.date?.slice(0, 16)}
                  disabled={!editMode}
                  onChange={(e) =>
                    setSelectedConsultation((c: any) => ({ ...c, date: e.target.value }))
                  }
                />
              </div>
              <div>
                <label>Statut</label>
                <select
                  className="w-full border rounded px-3 py-2"
                  value={selectedConsultation.statut}
                  disabled={!editMode}
                  onChange={(e) =>
                    setSelectedConsultation((c: any) => ({ ...c, statut: e.target.value as "PROGRAMMEE" | "EN_COURS" | "TERMINEE" | "ANNULEE" }))
                  }
                >
                  <option value="PROGRAMMEE">Programmée</option>
                  <option value="EN_COURS">En cours</option>
                  <option value="TERMINEE">Terminée</option>
                  <option value="ANNULEE">Annulée</option>
                </select>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  className="px-4 py-2 rounded bg-gray-200"
                  onClick={() => setSelectedConsultation(null)}
                >
                  Fermer
                </button>
                {editMode && (
                  <button
                    type="submit"
                    className="px-4 py-2 rounded bg-blue-600 text-white"
                  >
                    Enregistrer
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Consultations; 