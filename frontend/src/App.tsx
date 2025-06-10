import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

// Composants de layout
import Layout from '@/components/Common/Layout';
import LoadingSpinner from '@/components/Common/LoadingSpinner';

// Pages d'authentification
import LoginPage from '@/pages/auth/LoginPage';
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage';

// Pages par rôle
import AdminDashboard from '@/pages/admin/AdminDashboard';
import DoctorDashboard from '@/pages/doctor/DoctorDashboard';
import SecretaryDashboard from '@/pages/secretary/SecretaryDashboard';
import PatientDashboard from '@/pages/patient/PatientDashboard';

// Pages communes
import PatientsPage from '@/pages/patients/PatientsPage';
import PatientDetailPage from '@/pages/patients/PatientDetailPage';
import ConsultationsPage from '@/pages/consultations/ConsultationsPage';
import ConsultationDetailPage from '@/pages/consultations/ConsultationDetailPage';
import AppointmentsPage from '@/pages/appointments/AppointmentsPage';
import DicomViewerPage from '@/pages/dicom/DicomViewerPage';
import ProfilePage from '@/pages/profile/ProfilePage';
import NotFoundPage from '@/pages/errors/NotFoundPage';

// Types
import { UserRole } from '@/types/auth';

// Composant pour les routes protégées
interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles 
}) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

// Composant pour rediriger vers le bon dashboard selon le rôle
const DashboardRedirect: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  switch (user.role) {
    case UserRole.ADMIN:
      return <Navigate to="/admin" replace />;
    case UserRole.MEDECIN:
      return <Navigate to="/doctor" replace />;
    case UserRole.SECRETAIRE:
      return <Navigate to="/secretary" replace />;
    case UserRole.PATIENT:
      return <Navigate to="/patient" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
};

const App: React.FC = () => {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        {/* Routes publiques */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Redirection vers le dashboard approprié */}
        <Route path="/" element={<DashboardRedirect />} />

        {/* Routes protégées avec layout */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  {/* Dashboards par rôle */}
                  <Route
                    path="/admin/*"
                    element={
                      <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
                        <AdminDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/doctor/*"
                    element={
                      <ProtectedRoute allowedRoles={[UserRole.MEDECIN]}>
                        <DoctorDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/secretary/*"
                    element={
                      <ProtectedRoute allowedRoles={[UserRole.SECRETAIRE]}>
                        <SecretaryDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/patient/*"
                    element={
                      <ProtectedRoute allowedRoles={[UserRole.PATIENT]}>
                        <PatientDashboard />
                      </ProtectedRoute>
                    }
                  />

                  {/* Pages communes */}
                  <Route
                    path="/patients"
                    element={
                      <ProtectedRoute 
                        allowedRoles={[UserRole.ADMIN, UserRole.MEDECIN, UserRole.SECRETAIRE]}
                      >
                        <PatientsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/patients/:id"
                    element={
                      <ProtectedRoute 
                        allowedRoles={[UserRole.ADMIN, UserRole.MEDECIN, UserRole.SECRETAIRE]}
                      >
                        <PatientDetailPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/consultations"
                    element={
                      <ProtectedRoute 
                        allowedRoles={[UserRole.ADMIN, UserRole.MEDECIN]}
                      >
                        <ConsultationsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/consultations/:id"
                    element={
                      <ProtectedRoute 
                        allowedRoles={[UserRole.ADMIN, UserRole.MEDECIN, UserRole.PATIENT]}
                      >
                        <ConsultationDetailPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/appointments"
                    element={
                      <ProtectedRoute 
                        allowedRoles={[UserRole.ADMIN, UserRole.MEDECIN, UserRole.SECRETAIRE]}
                      >
                        <AppointmentsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/dicom/:imageId"
                    element={
                      <ProtectedRoute 
                        allowedRoles={[UserRole.ADMIN, UserRole.MEDECIN]}
                      >
                        <DicomViewerPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/profile" element={<ProfilePage />} />

                  {/* Pages d'erreur */}
                  <Route path="/unauthorized" element={
                    <div className="min-h-screen flex items-center justify-center">
                      <div className="text-center">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">
                          Accès non autorisé
                        </h1>
                        <p className="text-gray-600 mb-8">
                          Vous n'avez pas les permissions nécessaires pour accéder à cette page.
                        </p>
                        <button
                          onClick={() => window.history.back()}
                          className="btn-primary"
                        >
                          Retour
                        </button>
                      </div>
                    </div>
                  } />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
};

export default App;

