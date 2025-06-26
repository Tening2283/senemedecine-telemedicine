import React from 'react';
import { Bell, Settings, LogOut, Building2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Header: React.FC = () => {
  const { user, hopital, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Bienvenue, {user?.prenom}
              </h1>
              <p className="text-sm text-gray-500">
                {new Date().toLocaleDateString('fr-FR', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {hopital && (
              <div className="flex items-center space-x-2 px-3 py-2 bg-blue-50 rounded-lg">
                <Building2 className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">
                  {hopital.nom}
                </span>
              </div>
            )}

            <button className="p-2 text-gray-400 hover:text-gray-500 transition-colors">
              <Bell className="h-5 w-5" />
            </button>

            <button className="p-2 text-gray-400 hover:text-gray-500 transition-colors">
              <Settings className="h-5 w-5" />
            </button>

            <button
              onClick={logout}
              className="flex items-center space-x-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span className="text-sm font-medium">Déconnexion</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;