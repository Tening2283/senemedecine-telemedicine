import React from 'react';

const SecretaryDashboard: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Tableau de bord Secrétaire
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">RDV Aujourd'hui</h3>
          <p className="text-3xl font-bold text-primary-600 mt-2">12</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Patients Enregistrés</h3>
          <p className="text-3xl font-bold text-success-600 mt-2">45</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">En Attente</h3>
          <p className="text-3xl font-bold text-warning-600 mt-2">3</p>
        </div>
      </div>
    </div>
  );
};

export default SecretaryDashboard;

