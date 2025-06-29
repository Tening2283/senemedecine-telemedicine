import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Users, 
  Calendar, 
  FileText, 
  Settings, 
  Building2, 
  Activity,
  UserPlus,
  Stethoscope,
  BarChart3,
  Link
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar: React.FC = () => {
  const { user } = useAuth();

  const getMenuItems = () => {
    const baseItems = [
      { path: '/dashboard', icon: Home, label: 'Tableau de bord', roles: ['ADMIN', 'MEDECIN', 'SECRETAIRE'] }
    ];

    switch (user?.role) {
      case 'ADMIN':
        return [
          ...baseItems,
          { path: '/hopitaux', icon: Building2, label: 'Hôpitaux', roles: ['ADMIN'] },
          { path: '/utilisateurs', icon: Users, label: 'Utilisateurs', roles: ['ADMIN'] },
          { path: '/statistiques', icon: BarChart3, label: 'Statistiques', roles: ['ADMIN'] },
          { path: '/patients', icon: UserPlus, label: 'Patients', roles: ['ADMIN'] },
          { path: '/consultations', icon: Stethoscope, label: 'Consultations', roles: ['ADMIN'] }
        ];
      
      case 'MEDECIN':
        return [
          ...baseItems,
          { path: '/patients', icon: UserPlus, label: 'Mes patients', roles: ['MEDECIN'] },
          { path: '/consultations', icon: Stethoscope, label: 'Consultations', roles: ['MEDECIN'] },
          { path: '/rendez-vous', icon: Calendar, label: 'Rendez-vous', roles: ['MEDECIN'] },
          { path: '/dicom', icon: Activity, label: 'Imagerie DICOM', roles: ['MEDECIN'] },
          { path: '/associations-dicom', icon: Link, label: 'Associations DICOM', roles: ['MEDECIN'] }
        ];
      
      case 'SECRETAIRE':
        return [
          ...baseItems,
          { path: '/patients', icon: UserPlus, label: 'Patients', roles: ['SECRETAIRE'] },
          { path: '/rendez-vous', icon: Calendar, label: 'Rendez-vous', roles: ['SECRETAIRE'] },
          { path: '/planning', icon: FileText, label: 'Planning', roles: ['SECRETAIRE'] }
        ];
      
      default:
        return baseItems;
    }
  };

  const menuItems = getMenuItems();

  return (
    <div className="bg-white shadow-lg w-64 min-h-screen text-gray-900 border-r border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Activity className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">SeneMedecine</h1>
            <p className="text-sm text-gray-500">Télémédecine</p>
          </div>
        </div>
      </div>

      <nav className="mt-6">
        <div className="px-6 mb-4">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Navigation
          </h2>
        </div>
        
        <div className="space-y-1 px-3">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  isActive
                    ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`
              }
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>

      <div className="absolute bottom-0 w-64 p-6 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="bg-gray-300 p-2 rounded-full">
            <Users className="h-5 w-5 text-gray-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.prenom} {user?.nom}
            </p>
            <p className="text-xs text-gray-500 capitalize">
              {user?.role.toLowerCase()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;