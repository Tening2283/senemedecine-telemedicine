import React, { useState, useEffect } from 'react';
import { Search, Plus, Phone, Mail, Calendar, User, Loader2 } from 'lucide-react';
import { usePatients } from '../hooks/usePatients';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api';

const EditPatientForm = ({ patient, onCancel, onSaved }: any) => {
  const [form, setForm] = React.useState({ ...patient });
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f: any) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await apiService.updatePatient(patient.id, form);
      onSaved();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la modification');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-red-600">{error}</div>}
      <input className="w-full border rounded px-3 py-2" name="prenom" placeholder="Prénom" required value={form.prenom} onChange={handleChange} />
      <input className="w-full border rounded px-3 py-2" name="nom" placeholder="Nom" required value={form.nom} onChange={handleChange} />
      <input className="w-full border rounded px-3 py-2" name="date_naissance" type="date" placeholder="Date de naissance" required value={form.date_naissance} onChange={handleChange} />
      <input className="w-full border rounded px-3 py-2" name="adresse" placeholder="Adresse" value={form.adresse} onChange={handleChange} />
      <input className="w-full border rounded px-3 py-2" name="telephone" placeholder="Téléphone" value={form.telephone} onChange={handleChange} />
      <input className="w-full border rounded px-3 py-2" name="email" placeholder="Email" value={form.email} onChange={handleChange} />
      <input className="w-full border rounded px-3 py-2" name="numero_patient" placeholder="Numéro patient" value={form.numero_patient} onChange={handleChange} />
      <div className="flex justify-end space-x-2">
        <button type="button" className="px-4 py-2 rounded bg-gray-200" onClick={onCancel}>Annuler</button>
        <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white" disabled={saving}>{saving ? 'Modification...' : 'Enregistrer'}</button>
      </div>
    </form>
  );
};

const Patients: React.FC = () => {
  console.log('COMPONENT PATIENTS RENDERED');
  const { user, hopital } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const { patients: patientsFromHook, loading, error } = usePatients();
  const [patients, setPatients] = useState<any[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    prenom: '',
    nom: '',
    date_naissance: '',
    adresse: '',
    telephone: '',
    email: '',
    numero_patient: '',
  });
  const [formError, setFormError] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<any | null>(null);
  const [editPatient, setEditPatient] = useState<any | null>(null);

  useEffect(() => {
    setPatients(patientsFromHook);
  }, [patientsFromHook]);

  const getFilteredPatients = () => {
    let filteredPatients = patients;

    // Filtrer par terme de recherche
    if (searchTerm) {
      filteredPatients = filteredPatients.filter(patient =>
        patient.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.numero_patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.telephone.includes(searchTerm)
      );
    }

    return filteredPatients;
  };

  const filteredPatients = getFilteredPatients();

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce patient ?")) return;
    setDeletingId(id);
    try {
      await apiService.deletePatient(id);
      setPatients((prev) => prev.filter((p) => p.id !== id));
      // Option 1 : recharger la page
      // window.location.reload();
      // Option 2 (mieux) : re-fetcher les patients sans reload (à faire plus tard)
    } catch (err: any) {
      alert(err.message || "Erreur lors de la suppression");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Chargement des patients...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <User className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Erreur de chargement
          </h3>
          <p className="text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  console.log('showCreateModal:', showCreateModal);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Patients
          </h1>
          <p className="text-gray-600">
            Gestion des patients de {hopital?.nom || 'tous les hôpitaux'}
          </p>
        </div>
        
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          onClick={() => {
            console.log('Bouton Nouveau patient cliqué');
            setShowCreateModal(true);
          }}
        >
            <Plus className="h-4 w-4" />
          <span>Nouveau patient TEST</span>
          </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un patient..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Patients List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            Liste des patients ({filteredPatients.length})
          </h2>
        </div>
        
        {filteredPatients.length === 0 ? (
          <div className="p-6 text-center">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">
              {searchTerm ? 'Aucun patient trouvé pour cette recherche.' : 'Aucun patient enregistré.'}
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
                    Numéro
                  </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Âge
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {filteredPatients.map((patient) => (
                <tr key={patient.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                        <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {patient.prenom} {patient.nom}
                        </div>
                        <div className="text-sm text-gray-500">
                          {patient.adresse}
                        </div>
                      </div>
                    </div>
                  </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{patient.numero_patient}</div>
                    </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {calculateAge(patient.date_naissance)} ans
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(patient.date_naissance).toLocaleDateString('fr-FR')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center text-sm text-gray-900">
                          <Phone className="h-4 w-4 mr-1" />
                          {patient.telephone}
                    </div>
                    {patient.email && (
                          <div className="flex items-center text-sm text-gray-500">
                            <Mail className="h-4 w-4 mr-1" />
                            {patient.email}
                          </div>
                        )}
                      </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        className="text-blue-600 hover:text-blue-900 mr-3"
                        onClick={() => setSelectedPatient(patient)}
                      >
                        Voir
                      </button>
                      <button
                        className="text-green-600 hover:text-green-900 mr-3"
                        onClick={() => setEditPatient(patient)}
                      >
                        Modifier
                        </button>
                      <button
                        className="text-red-600 hover:text-red-900"
                        onClick={() => handleDelete(patient.id)}
                        disabled={deletingId === patient.id}
                      >
                        {deletingId === patient.id ? 'Suppression...' : 'Supprimer'}
                        </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
      </div>

      {/* Section édition patient */}
      {editPatient && (
        <div className="bg-gray-50 border-t mt-6 p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Modifier le patient</h3>
            <button
              className="text-gray-500 hover:text-gray-700"
              onClick={() => setEditPatient(null)}
            >
              Annuler
            </button>
          </div>
          <EditPatientForm patient={editPatient} onCancel={() => setEditPatient(null)} onSaved={() => { setEditPatient(null); window.location.reload(); }} />
        </div>
      )}

      {/* Section détails patient (affichée seulement si pas en édition) */}
      {!editPatient && selectedPatient && (
        <div className="bg-gray-50 border-t mt-6 p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Détails du patient</h3>
            <button
              className="text-gray-500 hover:text-gray-700"
              onClick={() => setSelectedPatient(null)}
            >
              Fermer
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="font-semibold">Nom :</div>
              <div>{selectedPatient.prenom} {selectedPatient.nom}</div>
            </div>
            <div>
              <div className="font-semibold">Date de naissance :</div>
              <div>{new Date(selectedPatient.date_naissance).toLocaleDateString('fr-FR')}</div>
            </div>
            <div>
              <div className="font-semibold">Adresse :</div>
              <div>{selectedPatient.adresse}</div>
            </div>
            <div>
              <div className="font-semibold">Téléphone :</div>
              <div>{selectedPatient.telephone}</div>
            </div>
            <div>
              <div className="font-semibold">Email :</div>
              <div>{selectedPatient.email}</div>
            </div>
            <div>
              <div className="font-semibold">Numéro patient :</div>
              <div>{selectedPatient.numero_patient}</div>
            </div>
          </div>
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Nouveau patient</h2>
            {formError && <div className="text-red-600 mb-2">{formError}</div>}
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setCreating(true);
                setFormError('');
                if (!hopital?.id) {
                  setFormError("Aucun hôpital sélectionné.");
                  setCreating(false);
                  return;
                }
                const patientData = { ...form, hopital_id: hopital.id };
                try {
                  const newPatient = await apiService.createPatient(patientData);
                  setShowCreateModal(false);
                  setForm({
                    prenom: '',
                    nom: '',
                    date_naissance: '',
                    adresse: '',
                    telephone: '',
                    email: '',
                    numero_patient: '',
                  });
                  setPatients((prev) => [...prev, newPatient]);
                } catch (err: any) {
                  setFormError(err.message || "Erreur lors de la création");
                } finally {
                  setCreating(false);
                }
              }}
              className="space-y-4"
            >
              <input
                className="w-full border rounded px-3 py-2"
                placeholder="Prénom"
                required
                value={form.prenom}
                onChange={e => setForm(f => ({ ...f, prenom: e.target.value }))}
              />
              <input
                className="w-full border rounded px-3 py-2"
                placeholder="Nom"
                required
                value={form.nom}
                onChange={e => setForm(f => ({ ...f, nom: e.target.value }))}
              />
              <input
                className="w-full border rounded px-3 py-2"
                type="date"
                placeholder="Date de naissance"
                required
                value={form.date_naissance}
                onChange={e => setForm(f => ({ ...f, date_naissance: e.target.value }))}
              />
              <input
                className="w-full border rounded px-3 py-2"
                placeholder="Adresse"
                value={form.adresse}
                onChange={e => setForm(f => ({ ...f, adresse: e.target.value }))}
              />
              <input
                className="w-full border rounded px-3 py-2"
                placeholder="Téléphone"
                value={form.telephone}
                onChange={e => setForm(f => ({ ...f, telephone: e.target.value }))}
              />
              <input
                className="w-full border rounded px-3 py-2"
                placeholder="Email"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              />
              <input
                className="w-full border rounded px-3 py-2"
                placeholder="Numéro patient"
                value={form.numero_patient}
                onChange={e => setForm(f => ({ ...f, numero_patient: e.target.value }))}
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
                  disabled={creating}
                >
                  {creating ? "Création..." : "Créer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Patients;
