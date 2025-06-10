import React from 'react';

const DoctorDashboard: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Tableau de bord Médecin
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Mes Patients</h3>
          <p className="text-3xl font-bold text-primary-600 mt-2">32</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">RDV Aujourd'hui</h3>
          <p className="text-3xl font-bold text-success-600 mt-2">8</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Consultations</h3>
          <p className="text-3xl font-bold text-warning-600 mt-2">156</p>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;

