import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Users, 
  Calendar, 
  FileText, 
  Activity,
  TrendingUp,
  Building2,
  Stethoscope,
  UserPlus,
  Loader2
} from 'lucide-react';
import { usePatients } from '../hooks/usePatients';
import { useConsultations } from '../hooks/useConsultations';
import { useRendezVous } from '../hooks/useRendezVous';

const Dashboard: React.FC = () => {
  const { user, hopital } = useAuth();
  const { patients, loading: loadingPatients, error: errorPatients } = usePatients();
  const { consultations, loading: loadingConsultations, error: errorConsultations } = useConsultations();
  const { rendezVous, loading: loadingRendezVous, error: errorRendezVous } = useRendezVous();

  // Afficher un loader si les données sont en cours de chargement
  if (loadingPatients || loadingConsultations || loadingRendezVous) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Chargement des données...</p>
        </div>
      </div>
    );
  }

  // Afficher une erreur si il y en a une
  if (errorPatients || errorConsultations || errorRendezVous) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Activity className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Erreur de chargement
          </h3>
          <p className="text-gray-500">
            Impossible de charger les données du tableau de bord.
          </p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      name: 'Patients',
      value: patients.length,
      icon: UserPlus,
      color: 'bg-blue-500',
      change: '+2.5%'
    },
    {
      name: 'Consultations',
      value: consultations.length,
      icon: Stethoscope,
      color: 'bg-green-500',
      change: '+12%'
    },
    {
      name: 'Rendez-vous',
      value: rendezVous.length,
      icon: Calendar,
      color: 'bg-orange-500',
      change: '+5.4%'
    },
    {
      name: 'Taux de satisfaction',
      value: '98%',
      icon: TrendingUp,
      color: 'bg-purple-500',
      change: '+1.2%'
    }
  ];

  const recentConsultations = consultations.slice(0, 5);
  const upcomingAppointments = rendezVous.filter(r => r.statut !== 'ANNULE').slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Tableau de bord
          </h1>
          <p className="text-gray-600">
            Bienvenue, {user?.prenom} {user?.nom}
          </p>
        </div>
        
        <div className="flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-lg">
          <Activity className="h-5 w-5 text-blue-600" />
          <span className="text-blue-700 font-medium">
            {hopital?.nom || 'Tous les hôpitaux'}
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-green-600">{stat.change}</p>
              </div>
              <div className={`p-3 rounded-full ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Consultations */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Consultations récentes
            </h3>
          </div>
          <div className="p-6">
            {recentConsultations.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                Aucune consultation récente
              </p>
            ) : (
              <div className="space-y-4">
                {recentConsultations.map((consultation) => (
                  <div key={consultation.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <FileText className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {consultation.motif}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(consultation.date).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      consultation.statut === 'TERMINEE' ? 'bg-green-100 text-green-800' :
                      consultation.statut === 'EN_COURS' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {consultation.statut}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Rendez-vous à venir
            </h3>
          </div>
          <div className="p-6">
            {upcomingAppointments.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                Aucun rendez-vous à venir
              </p>
            ) : (
              <div className="space-y-4">
                {upcomingAppointments.map((rdv) => (
                  <div key={rdv.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-orange-100 rounded-full">
                        <Calendar className="h-4 w-4 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {rdv.motif}
                        </p>
                        <p className="text-sm text-gray-500">
                          {rdv.date} à {rdv.heure}
                        </p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      rdv.statut === 'CONFIRME' ? 'bg-green-100 text-green-800' :
                      rdv.statut === 'EN_ATTENTE' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {rdv.statut}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;