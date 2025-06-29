import React, { useState } from 'react';
import { Search, Plus, Users, UserCheck, UserX, Mail, Phone, Building2 } from 'lucide-react';
import { mockUsers, mockHopitaux } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api';

const Utilisateurs: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState({
    prenom: '',
    nom: '',
    email: '',
    telephone: '',
    role: '',
    specialite: '',
  });
  const [users, setUsers] = useState(mockUsers);
  const [formError, setFormError] = useState('');
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [editMode, setEditMode] = useState(false);

  // Seuls les admins peuvent voir cette page
  if (user?.role !== 'ADMIN') {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
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

  const getFilteredUsers = () => {
    let filteredUsers = users;

    if (searchTerm) {
      filteredUsers = filteredUsers.filter(user =>
        user.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedRole) {
      filteredUsers = filteredUsers.filter(user => user.role === selectedRole);
    }

    return filteredUsers;
  };

  const filteredUsers = getFilteredUsers();

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-purple-100 text-purple-800';
      case 'MEDECIN':
        return 'bg-blue-100 text-blue-800';
      case 'SECRETAIRE':
        return 'bg-green-100 text-green-800';
      case 'PATIENT':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return <UserCheck className="h-4 w-4" />;
      case 'MEDECIN':
        return <UserCheck className="h-4 w-4" />;
      case 'SECRETAIRE':
        return <Users className="h-4 w-4" />;
      case 'PATIENT':
        return <UserX className="h-4 w-4" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  const handleView = (user: any) => {
    setSelectedUser(user);
    setEditMode(false);
  };

  const handleEdit = (user: any) => {
    setSelectedUser(user);
    setEditMode(true);
  };

  const handleDeactivate = async (id: string) => {
    if (!window.confirm("Voulez-vous vraiment désactiver cet utilisateur ?")) return;
    await apiService.deleteUser(id);
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Gestion des Utilisateurs
          </h1>
          <p className="text-gray-600">
            Administration des comptes utilisateurs du système
          </p>
        </div>
        
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          onClick={() => setShowModal(true)}
        >
          <span>Nouvel utilisateur</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par nom, prénom ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <select 
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Tous les rôles</option>
            <option value="ADMIN">Administrateur</option>
            <option value="MEDECIN">Médecin</option>
            <option value="SECRETAIRE">Secrétaire</option>
            <option value="PATIENT">Patient</option>
          </select>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{mockUsers.length}</p>
            </div>
            <Users className="h-8 w-8 text-gray-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Médecins</p>
              <p className="text-2xl font-bold text-blue-600">
                {mockUsers.filter(u => u.role === 'MEDECIN').length}
              </p>
            </div>
            <UserCheck className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Secrétaires</p>
              <p className="text-2xl font-bold text-green-600">
                {mockUsers.filter(u => u.role === 'SECRETAIRE').length}
              </p>
            </div>
            <Users className="h-8 w-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Patients</p>
              <p className="text-2xl font-bold text-orange-600">
                {mockUsers.filter(u => u.role === 'PATIENT').length}
              </p>
            </div>
            <UserX className="h-8 w-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Users List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Liste des utilisateurs ({filteredUsers.length})
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Utilisateur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rôle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hôpital
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Spécialité
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => {
                const hopital = mockHopitaux.find(h => h.id === user.hopital_id);
                return (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="bg-gray-100 p-2 rounded-full mr-3">
                          {getRoleIcon(user.role)}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {user.prenom} {user.nom}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${getRoleColor(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center space-x-1">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span>{user.email}</span>
                        </div>
                        {user.telephone && (
                          <div className="flex items-center space-x-1 mt-1">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <span>{user.telephone}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {hopital ? (
                        <div className="flex items-center space-x-1">
                          <Building2 className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-900">{hopital.nom}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">Non assigné</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.specialite || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-900" onClick={() => handleView(user)}>
                          Voir
                        </button>
                        <button className="text-green-600 hover:text-green-900" onClick={() => handleEdit(user)}>
                          Modifier
                        </button>
                        <button className="text-red-600 hover:text-red-900" onClick={() => handleDeactivate(user.id)}>
                          Désactiver
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucun utilisateur trouvé
            </h3>
            <p className="text-gray-500">
              {searchTerm ? 'Aucun utilisateur ne correspond à votre recherche.' : 'Aucun utilisateur enregistré.'}
            </p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Créer un utilisateur</h2>
            {formError && <div className="text-red-600 mb-2">{formError}</div>}
            <form
              onSubmit={async e => {
                e.preventDefault();
                setFormError('');
                console.log('Tentative de création utilisateur', newUser);
                try {
                  const created = await apiService.createUser({
                    ...newUser,
                    role: newUser.role as "ADMIN" | "MEDECIN" | "SECRETAIRE" | "PATIENT"
                  });
                  setUsers(prev => [...prev, created]);
                  setShowModal(false);
                  setNewUser({
                    prenom: '',
                    nom: '',
                    email: '',
                    telephone: '',
                    role: '',
                    specialite: '',
                  });
                } catch (err: any) {
                  setFormError(err.message || "Erreur lors de la création");
                  console.error('Erreur création utilisateur:', err);
                }
              }}
              className="space-y-4"
            >
              <input
                className="w-full border rounded px-3 py-2"
                placeholder="Prénom"
                value={newUser.prenom}
                onChange={e => setNewUser(u => ({ ...u, prenom: e.target.value }))}
                required
              />
              <input
                className="w-full border rounded px-3 py-2"
                placeholder="Nom"
                value={newUser.nom}
                onChange={e => setNewUser(u => ({ ...u, nom: e.target.value }))}
                required
              />
              <input
                className="w-full border rounded px-3 py-2"
                placeholder="Email"
                type="email"
                value={newUser.email}
                onChange={e => setNewUser(u => ({ ...u, email: e.target.value }))}
                required
              />
              <input
                className="w-full border rounded px-3 py-2"
                placeholder="Téléphone"
                value={newUser.telephone}
                onChange={e => setNewUser(u => ({ ...u, telephone: e.target.value }))}
              />
              <select
                className="w-full border rounded px-3 py-2"
                value={newUser.role}
                onChange={e => setNewUser(u => ({ ...u, role: e.target.value }))}
                required
              >
                <option value="">Sélectionner un rôle</option>
                <option value="ADMIN">Administrateur</option>
                <option value="MEDECIN">Médecin</option>
                <option value="SECRETAIRE">Secrétaire</option>
                <option value="PATIENT">Patient</option>
              </select>
              <input
                className="w-full border rounded px-3 py-2"
                placeholder="Spécialité"
                value={newUser.specialite}
                onChange={e => setNewUser(u => ({ ...u, specialite: e.target.value }))}
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  className="px-4 py-2 rounded bg-gray-200"
                  onClick={() => setShowModal(false)}
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

      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editMode ? "Modifier l'utilisateur" : "Détails de l'utilisateur"}
            </h2>
            <form
              onSubmit={async e => {
                e.preventDefault();
                if (editMode) {
                  // Appel API pour update ici si besoin
                  setUsers(prev =>
                    prev.map(u => (u.id === selectedUser.id ? selectedUser : u))
                  );
                }
                setSelectedUser(null);
              }}
              className="space-y-4"
            >
              <input
                className="w-full border rounded px-3 py-2"
                placeholder="Prénom"
                value={selectedUser.prenom}
                disabled={!editMode}
                onChange={e =>
                  setSelectedUser((u: any) => ({ ...u, prenom: e.target.value }))
                }
                required
              />
              <input
                className="w-full border rounded px-3 py-2"
                placeholder="Nom"
                value={selectedUser.nom}
                disabled={!editMode}
                onChange={e =>
                  setSelectedUser((u: any) => ({ ...u, nom: e.target.value }))
                }
                required
              />
              <input
                className="w-full border rounded px-3 py-2"
                placeholder="Email"
                type="email"
                value={selectedUser.email}
                disabled={!editMode}
                onChange={e =>
                  setSelectedUser((u: any) => ({ ...u, email: e.target.value }))
                }
                required
              />
              <input
                className="w-full border rounded px-3 py-2"
                placeholder="Téléphone"
                value={selectedUser.telephone}
                disabled={!editMode}
                onChange={e =>
                  setSelectedUser((u: any) => ({ ...u, telephone: e.target.value }))
                }
              />
              <select
                className="w-full border rounded px-3 py-2"
                value={selectedUser.role}
                disabled={!editMode}
                onChange={e =>
                  setSelectedUser((u: any) => ({ ...u, role: e.target.value }))
                }
                required
              >
                <option value="">Sélectionner un rôle</option>
                <option value="ADMIN">Administrateur</option>
                <option value="MEDECIN">Médecin</option>
                <option value="SECRETAIRE">Secrétaire</option>
                <option value="PATIENT">Patient</option>
              </select>
              <input
                className="w-full border rounded px-3 py-2"
                placeholder="Spécialité"
                value={selectedUser.specialite}
                disabled={!editMode}
                onChange={e =>
                  setSelectedUser((u: any) => ({ ...u, specialite: e.target.value }))
                }
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  className="px-4 py-2 rounded bg-gray-200"
                  onClick={() => setSelectedUser(null)}
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

export default Utilisateurs;