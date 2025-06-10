import React from 'react';

const AdminDashboard: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Tableau de bord Administrateur</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Hôpitaux</h3>
          <p className="text-3xl font-bold text-primary-600 mt-2">5</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Médecins</h3>
          <p className="text-3xl font-bold text-success-600 mt-2">24</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Patients</h3>
          <p className="text-3xl font-bold text-warning-600 mt-2">156</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Consultations</h3>
          <p className="text-3xl font-bold text-error-600 mt-2">89</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
