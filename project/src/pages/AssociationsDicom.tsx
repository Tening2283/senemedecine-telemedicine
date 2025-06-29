import React, { useState } from 'react';
import { Activity, Link, X, Calendar, Stethoscope, User, FileText, Eye, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useConsultationDicomAssociations, ConsultationDicomAssociation } from '../hooks/useConsultationDicomAssociations';
import { useConsultations } from '../hooks/useConsultations';

const AssociationsDicom: React.FC = () => {
  const { user } = useAuth();
  const { data: associations, loading, error, deleteAssociation, refetch } = useConsultationDicomAssociations();
  const { consultations } = useConsultations();
  const [selectedAssociation, setSelectedAssociation] = useState<ConsultationDicomAssociation | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Only MEDECIN can access
  if (user?.role !== 'MEDECIN') {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Activity className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Accès réservé aux médecins
          </h3>
          <p className="text-gray-500">
            Seuls les médecins peuvent accéder aux associations DICOM.
          </p>
        </div>
      </div>
    );
  }

  const handleDelete = async (associationId: string) => {
    setDeletingId(associationId);
    try {
      await deleteAssociation(associationId);
      setShowDeleteModal(false);
      setSelectedAssociation(null);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    } finally {
      setDeletingId(null);
    }
  };

  const getConsultationById = (consultationId: string) => {
    return consultations.find(c => c.id === consultationId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Activity className="h-16 w-16 text-blue-500 mx-auto mb-4 animate-spin" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Chargement des associations...
          </h3>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Activity className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Erreur de chargement
          </h3>
          <p className="text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Associations Consultation-DICOM
          </h1>
          <p className="text-gray-600">
            Gestion des liens entre consultations et images médicales
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            {associations.length} association{associations.length > 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {associations.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8">
          <div className="text-center">
            <Link className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucune association trouvée
            </h3>
            <p className="text-gray-500 mb-4">
              Les associations entre consultations et images DICOM apparaîtront ici.
            </p>
            <p className="text-sm text-gray-400">
              Allez dans la page DICOM pour créer des associations.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {associations.map((association) => {
            const consultation = getConsultationById(association.consultation_id);
            
            return (
              <div
                key={association.id}
                className="bg-white rounded-lg shadow hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <Link className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">
                          Association DICOM
                        </h3>
                        <p className="text-xs text-gray-500">
                          ID: {association.id.slice(0, 8)}...
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedAssociation(association);
                        setShowDeleteModal(true);
                      }}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                      title="Supprimer l'association"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Consultation Info */}
                  <div className="space-y-3">
                    <div className="bg-blue-50 rounded-lg p-3">
                      <div className="flex items-center space-x-2 mb-2">
                        <Stethoscope className="h-4 w-4 text-blue-600" />
                        <h4 className="text-sm font-medium text-blue-900">Consultation</h4>
                      </div>
                      {consultation ? (
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <User className="h-3 w-3 text-gray-500" />
                            <span className="text-sm text-gray-700">
                              {consultation.patient_nom} {consultation.patient_prenom}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-3 w-3 text-gray-500" />
                            <span className="text-sm text-gray-700">
                              {new Date(consultation.date_consultation).toLocaleDateString('fr-FR')}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <FileText className="h-3 w-3 text-gray-500" />
                            <span className="text-sm text-gray-700 truncate">
                              {consultation.motif}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500">
                          Consultation non trouvée
                        </div>
                      )}
                    </div>

                    {/* DICOM Info */}
                    <div className="bg-green-50 rounded-lg p-3">
                      <div className="flex items-center space-x-2 mb-2">
                        <Eye className="h-4 w-4 text-green-600" />
                        <h4 className="text-sm font-medium text-green-900">Image DICOM</h4>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm text-gray-700">
                          <span className="font-medium">Study ID:</span> {association.orthanc_study_id}
                        </div>
                        {association.patient_nom && (
                          <div className="text-sm text-gray-700">
                            <span className="font-medium">Patient:</span> {association.patient_nom} {association.patient_prenom}
                          </div>
                        )}
                        {association.consultation_date && (
                          <div className="text-sm text-gray-700">
                            <span className="font-medium">Date étude:</span> {new Date(association.consultation_date).toLocaleDateString('fr-FR')}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="pt-3 border-t border-gray-100">
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>
                          Créé par: {association.created_by_nom} {association.created_by_prenom}
                        </span>
                        <span>
                          {new Date(association.created_at).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedAssociation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <X className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Supprimer l'association
                </h3>
                <p className="text-sm text-gray-500">
                  Cette action est irréversible
                </p>
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-700">
                Êtes-vous sûr de vouloir supprimer l'association entre la consultation et l'image DICOM ?
              </p>
              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                <div className="text-sm">
                  <div><strong>Consultation:</strong> {getConsultationById(selectedAssociation.consultation_id)?.patient_nom} {getConsultationById(selectedAssociation.consultation_id)?.patient_prenom}</div>
                  <div><strong>DICOM Study ID:</strong> {selectedAssociation.orthanc_study_id}</div>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                disabled={deletingId === selectedAssociation.id}
              >
                Annuler
              </button>
              <button
                onClick={() => handleDelete(selectedAssociation.id)}
                disabled={deletingId === selectedAssociation.id}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {deletingId === selectedAssociation.id ? 'Suppression...' : 'Supprimer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssociationsDicom; 