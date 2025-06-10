import React from 'react';

const PatientDashboard: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Mon Espace Patient
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Prochain RDV</h3>
          <p className="text-sm text-gray-600 mt-2">15 Janvier 2024 à 14h30</p>
          <p className="text-sm text-gray-500">Dr. Diallo - Cardiologie</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Mes Consultations</h3>
          <p className="text-3xl font-bold text-primary-600 mt-2">8</p>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;

