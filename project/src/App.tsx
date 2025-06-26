import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginForm from './components/Auth/LoginForm';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import Consultations from './pages/Consultations';
import DICOM from './pages/DICOM';
import Hopitaux from './pages/Hopitaux';
import Utilisateurs from './pages/Utilisateurs';
import Statistiques from './pages/Statistiques';
import RendezVous from './pages/RendezVous';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/login" />;
};

const AppRoutes: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <LoginForm />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/patients" element={<Patients />} />
        <Route path="/consultations" element={<Consultations />} />
        <Route path="/dicom" element={<DICOM />} />
        <Route path="/rendez-vous" element={<RendezVous />} />
        <Route path="/hopitaux" element={<Hopitaux />} />
        <Route path="/utilisateurs" element={<Utilisateurs />} />
        <Route path="/statistiques" element={<Statistiques />} />
        <Route path="/login" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <AppRoutes />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;