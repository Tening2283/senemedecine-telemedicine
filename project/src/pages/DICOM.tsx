import React, { useState, useRef, useEffect } from 'react';
import { Activity, Upload, Download, ZoomIn, ZoomOut, RotateCw, Move, UserPlus, Link, Search, Users, Calendar, Stethoscope, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { orthancService } from '../services/orthancService';
import { OrthancStudy, OrthancSeries, OrthancInstance, OrthancConnectionConfig } from '../types';
import { useConsultations } from '../hooks/useConsultations';
import { useConsultationDicomAssociations, ConsultationDicomAssociation } from '../hooks/useConsultationDicomAssociations';
import { apiService } from '../services/api';
import DicomViewer from '../components/DicomViewer';
import { usePatients } from '../hooks/usePatients';

const DICOM: React.FC = () => {
  const { user } = useAuth();
  const [orthancConnected, setOrthancConnected] = useState(false);
  const { consultations, loading: consultationsLoading } = useConsultations();
  const { data: associations, loading: associationsLoading, createAssociation, deleteAssociation, refetch: refetchAssociations } = useConsultationDicomAssociations();
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [studies, setStudies] = useState<OrthancStudy[]>([]);
  const [loadingStudies, setLoadingStudies] = useState(false);
  const [selectedStudy, setSelectedStudy] = useState<OrthancStudy | null>(null);
  const [series, setSeries] = useState<OrthancSeries[]>([]);
  const [selectedSeries, setSelectedSeries] = useState<OrthancSeries | null>(null);
  const [instances, setInstances] = useState<OrthancInstance[]>([]);
  const [selectedInstance, setSelectedInstance] = useState<OrthancInstance | null>(null);
  const [dicomImageUrl, setDicomImageUrl] = useState<string | null>(null);
  const [zoom, setZoom] = useState(100);
  const [isDragging, setIsDragging] = useState(false);
  const [showAssociationModal, setShowAssociationModal] = useState(false);
  const [selectedConsultationId, setSelectedConsultationId] = useState<string>('');
  const [associationLoading, setAssociationLoading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { patients, loading: patientsLoading } = usePatients();
  
  // Only MEDECIN can access Orthanc
  if (user?.role !== 'MEDECIN') {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Activity className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Accès réservé aux médecins
          </h3>
          <p className="text-gray-500">
            Seuls les médecins peuvent accéder à l'imagerie DICOM.
          </p>
        </div>
      </div>
    );
  }

  // Handle Orthanc connection
  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    setConnectionError(null);
    try {
      await orthancService.connect();
      setOrthancConnected(true);
      console.log('Orthanc connecté !');
    } catch (err: any) {
      setConnectionError(err.message || 'Erreur de connexion à Orthanc');
      setOrthancConnected(false);
    }
  };

  // Fetch studies when connected
  useEffect(() => {
    console.log('useEffect studies, orthancConnected:', orthancConnected);
    if (orthancConnected) {
      setLoadingStudies(true);
      orthancService.getStudies()
        .then(async (ids: string[]) => {
          const studyDetails = await Promise.all(ids.map((id: string) => orthancService.getStudy(id)));
          setStudies(studyDetails);
          console.log('studyDetails:', studyDetails);
        })
        .catch((err) => {
          setConnectionError('Erreur lors du chargement des études DICOM');
          console.error('Erreur studies:', err);
        })
        .finally(() => setLoadingStudies(false));
    }
  }, [orthancConnected]);

  // Fetch series when a study is selected
  useEffect(() => {
    if (selectedStudy) {
      orthancService.getStudySeries(selectedStudy.ID)
        .then(setSeries)
        .catch(() => setSeries([]));
      setSelectedSeries(null);
      setInstances([]);
      setSelectedInstance(null);
      setDicomImageUrl(null);
    }
  }, [selectedStudy]);

  // Fetch instances when a series is selected
  useEffect(() => {
    if (selectedSeries) {
      orthancService.getSeriesInstances(selectedSeries.ID)
        .then(setInstances)
        .catch(() => setInstances([]));
      setSelectedInstance(null);
      setDicomImageUrl(null);
    }
  }, [selectedSeries]);

  // Fetch image when an instance is selected
  useEffect(() => {
    if (selectedInstance) {
      orthancService.getInstanceImage(selectedInstance.ID)
        .then(setDicomImageUrl)
        .catch(() => setDicomImageUrl(null));
    }
  }, [selectedInstance]);

  useEffect(() => {
    const tryConnect = async () => {
      try {
        await orthancService.connect();
        setOrthancConnected(true);
      } catch (err) {
        setConnectionError('Erreur de connexion à Orthanc');
      }
    };
    tryConnect();
  }, []);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 25, 400));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 25, 25));
  const handleReset = () => setZoom(100);

  // Association functions
  const handleAssociateWithConsultation = async () => {
    if (!selectedStudy || !selectedConsultationId) return;
    
    setAssociationLoading(true);
    try {
      await createAssociation(selectedConsultationId, selectedStudy.ID);
      setShowAssociationModal(false);
      setSelectedConsultationId('');
      // Refresh associations
      await refetchAssociations();
    } catch (error) {
      console.error('Erreur lors de l\'association:', error);
    } finally {
      setAssociationLoading(false);
    }
  };

  const handleDeleteAssociation = async (associationId: string) => {
    try {
      await deleteAssociation(associationId);
      await refetchAssociations();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const isStudyAssociated = (studyId: string) => {
    return associations.some(assoc => assoc.orthanc_study_id === studyId);
  };

  const getAssociatedConsultation = (studyId: string) => {
    return associations.find(assoc => assoc.orthanc_study_id === studyId);
  };

  // UI
  console.log('studies:', studies);
  console.log('series:', series);
  console.log('instances:', instances);
  console.log('selectedInstance:', selectedInstance);
  console.log('dicomImageUrl:', dicomImageUrl);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Visualiseur DICOM
          </h1>
          <p className="text-gray-600">
            Visualisation et association des images médicales avec les consultations
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* DICOM Files List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Études DICOM</h2>
              <p className="text-xs text-gray-500 mt-1">
                {studies.length} total
              </p>
            </div>
            <div className="p-4">
              {loadingStudies ? (
                <div className="text-center text-gray-500">Chargement...</div>
              ) : studies.length === 0 ? (
                <div className="text-center text-gray-500">Aucune étude trouvée</div>
              ) : (
              <div className="space-y-3">
                  {studies.map((study) => {
                    const isAssociated = isStudyAssociated(study.ID);
                    const association = getAssociatedConsultation(study.ID);
                    
                    return (
                    <div
                        key={study.ID}
                        onClick={() => setSelectedStudy(study)}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedStudy?.ID === study.ID
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                          <div className={`w-12 h-12 rounded flex items-center justify-center text-xs font-bold ${
                            selectedStudy?.ID === study.ID ? 'bg-blue-200 text-blue-700' : 
                            isAssociated ? 'bg-green-200 text-green-700' : 'bg-gray-200 text-gray-500'
                          }`}>
                            {selectedStudy?.ID === study.ID ? '✓' : 
                             isAssociated ? '🔗' : 'DICOM'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-900 truncate">
                              {study.PatientMainDicomTags.PatientName || 'Patient inconnu'}
                          </div>
                          <div className="text-xs text-gray-500">
                              {study.MainDicomTags.StudyDescription || 'Étude'}
                          </div>
                          <div className="text-xs text-gray-400">
                              {study.MainDicomTags.StudyDate ? new Date(study.MainDicomTags.StudyDate).toLocaleDateString('fr-FR') : ''}
                            </div>
                            {isAssociated && (
                              <div className="text-xs text-green-600 mt-1">
                                🔗 Associé à consultation
                              </div>
                            )}
                          </div>
                        </div>
                        {selectedStudy?.ID === study.ID && (
                          <div className="mt-3 flex space-x-2">
                            {!isAssociated ? (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setShowAssociationModal(true);
                                }}
                                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs transition-colors"
                              >
                                <Link className="h-3 w-3 mr-1" />
                                Associer
                              </button>
                            ) : (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (association) {
                                    handleDeleteAssociation(association.id);
                                  }
                                }}
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs transition-colors"
                              >
                                <X className="h-3 w-3 mr-1" />
                                Dissocier
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            {/* Series list if study selected */}
            {selectedStudy && series.length > 0 && (
              <div className="p-4 border-t border-gray-100">
                <div className="text-xs font-semibold mb-2 text-gray-700">Séries</div>
                <div className="space-y-2">
                  {series.map(s => (
                    <div
                      key={s.ID}
                      onClick={() => setSelectedSeries(s)}
                      className={`p-2 border rounded cursor-pointer text-xs ${selectedSeries?.ID === s.ID ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
                    >
                      {s.MainDicomTags.SeriesDescription || 'Série'}
                  </div>
                ))}
                </div>
              </div>
            )}
            {/* Instances list if series selected */}
            {selectedSeries && instances.length > 0 && (
              <div className="p-4 border-t border-gray-100">
                <div className="text-xs font-semibold mb-2 text-gray-700">Images</div>
                <div className="space-y-2">
                  {instances.map(inst => (
                    <div
                      key={inst.ID}
                      onClick={() => setSelectedInstance(inst)}
                      className={`p-2 border rounded cursor-pointer text-xs ${selectedInstance?.ID === inst.ID ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
                    >
                      Image {inst.MainDicomTags.InstanceNumber || inst.ID}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* DICOM Viewer */}
        <div className="lg:col-span-3">
          {selectedInstance && dicomImageUrl ? (
            <DicomViewer
              imageUrl={dicomImageUrl}
              patientName={selectedStudy?.PatientMainDicomTags.PatientName}
              studyDate={selectedStudy?.MainDicomTags.StudyDate}
              modality={selectedSeries?.MainDicomTags.Modality}
              seriesDescription={selectedSeries?.MainDicomTags.SeriesDescription}
            />
          ) : (
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Visualiseur DICOM Pro
                </h2>
              </div>
              <div className="p-4">
                <div className="bg-gray-100 rounded-lg flex items-center justify-center" style={{ minHeight: '500px' }}>
                  <div className="text-center">
                    <Activity className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {selectedSeries ? 'Sélectionnez une image DICOM' : selectedStudy ? 'Sélectionnez une série' : 'Sélectionnez une étude DICOM'}
                    </h3>
                    <p className="text-gray-500">
                      {selectedSeries ? 'Choisissez une image à visualiser avec les outils professionnels.' : selectedStudy ? 'Choisissez une série à explorer.' : 'Choisissez une étude dans la liste à gauche.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Association Modal */}
      {showAssociationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Associer à une consultation
              </h3>
              <button
                onClick={() => setShowAssociationModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sélectionner une consultation
              </label>
              <select
                value={selectedConsultationId}
                onChange={(e) => setSelectedConsultationId(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                disabled={consultationsLoading}
              >
                <option value="">Choisir une consultation...</option>
                {consultations.map((consultation) => {
                  const patient = patients.find((p: any) => p.id === consultation.patient_id);
                  return (
                    <option key={consultation.id} value={consultation.id}>
                      {patient?.prenom} {patient?.nom} - {new Date(consultation.date).toLocaleDateString('fr-FR')} - {consultation.motif}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowAssociationModal(false)}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleAssociateWithConsultation}
                disabled={!selectedConsultationId || associationLoading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {associationLoading ? 'Association...' : 'Associer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DICOM;