import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, Users, Building2, Activity, Calendar, FileText } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { mockUsers, mockPatients, mockConsultations, mockHopitaux } from '../data/mockData';

const Statistiques: React.FC = () => {
  const { user } = useAuth();

  // Seuls les admins peuvent voir cette page
  if (user?.role !== 'ADMIN') {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <TrendingUp className="h-16 w-16 text-gray-400 mx-auto mb-4" />
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

  // Données pour les graphiques
  const consultationsParMois = [
    { mois: 'Jan', consultations: 45 },
    { mois: 'Fév', consultations: 52 },
    { mois: 'Mar', consultations: 48 },
    { mois: 'Avr', consultations: 61 },
    { mois: 'Mai', consultations: 55 },
    { mois: 'Jun', consultations: 67 }
  ];

  const repartitionRoles = [
    { name: 'Médecins', value: mockUsers.filter(u => u.role === 'MEDECIN').length, color: '#3B82F6' },
    { name: 'Secrétaires', value: mockUsers.filter(u => u.role === 'SECRETAIRE').length, color: '#10B981' },
    { name: 'Patients', value: mockUsers.filter(u => u.role === 'PATIENT').length, color: '#F59E0B' },
    { name: 'Admins', value: mockUsers.filter(u => u.role === 'ADMIN').length, color: '#8B5CF6' }
  ];

  const patientsParHopital = mockHopitaux.map(hopital => ({
    hopital: hopital.nom.split(' ')[0], // Nom court
    patients: mockPatients.filter(p => p.hopital_id === hopital.id).length
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Statistiques Globales
          </h1>
          <p className="text-gray-600">
            Vue d'ensemble des performances du système
          </p>
        </div>
        
        <div className="flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-lg">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          <span className="text-blue-700 font-medium">Données en temps réel</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Utilisateurs</p>
              <p className="text-2xl font-bold text-gray-900">{mockUsers.length}</p>
              <p className="text-sm text-green-600">+12% ce mois</p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Patients Actifs</p>
              <p className="text-2xl font-bold text-gray-900">{mockPatients.length}</p>
              <p className="text-sm text-green-600">+8% ce mois</p>
            </div>
            <Activity className="h-8 w-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Consultations</p>
              <p className="text-2xl font-bold text-gray-900">{mockConsultations.length}</p>
              <p className="text-sm text-green-600">+15% ce mois</p>
            </div>
            <FileText className="h-8 w-8 text-orange-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Hôpitaux</p>
              <p className="text-2xl font-bold text-gray-900">{mockHopitaux.length}</p>
              <p className="text-sm text-blue-600">Tous actifs</p>
            </div>
            <Building2 className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Consultations par mois */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Évolution des consultations
            </h2>
            <Calendar className="h-5 w-5 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={consultationsParMois}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mois" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="consultations" 
                stroke="#3B82F6" 
                strokeWidth={2}
                dot={{ fill: '#3B82F6' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Répartition des rôles */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Répartition des utilisateurs
            </h2>
            <Users className="h-5 w-5 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={repartitionRoles}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {repartitionRoles.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Patients par hôpital */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Répartition des patients par hôpital
          </h2>
          <Building2 className="h-5 w-5 text-gray-400" />
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={patientsParHopital}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hopital" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="patients" fill="#10B981" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Tableau de performance */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Performance par hôpital
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hôpital
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patients
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Consultations
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Médecins
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Taux d'occupation
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockHopitaux.map((hopital) => {
                const patients = mockPatients.filter(p => p.hopital_id === hopital.id).length;
                const consultations = mockConsultations.filter(c => c.hopital_id === hopital.id).length;
                const medecins = mockUsers.filter(u => u.hopital_id === hopital.id && u.role === 'MEDECIN').length;
                const tauxOccupation = Math.floor(Math.random() * 30) + 70; // Simulation
                
                return (
                  <tr key={hopital.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Building2 className="h-5 w-5 text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{hopital.nom}</div>
                          <div className="text-sm text-gray-500">{hopital.ville}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {patients}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {consultations}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {medecins}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${tauxOccupation}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-900">{tauxOccupation}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Statistiques;