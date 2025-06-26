import React, { useState, useRef, useEffect } from 'react';
import { Activity, Upload, Download, ZoomIn, ZoomOut, RotateCw, Move } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { orthancService } from '../services/orthancService';
import { OrthancStudy, OrthancSeries, OrthancInstance, OrthancConnectionConfig } from '../types';

const DICOM: React.FC = () => {
  const { user } = useAuth();
  const [orthancConnected, setOrthancConnected] = useState(false);
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
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Form state for Orthanc connection
  const [orthancUrl, setOrthancUrl] = useState('http://localhost:8042');
  const [orthancUsername, setOrthancUsername] = useState('orthanc');
  const [orthancPassword, setOrthancPassword] = useState('othanc');
  const [connecting, setConnecting] = useState(false);

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
    setConnecting(true);
    setConnectionError(null);
    try {
      await orthancService.connect();
      setOrthancConnected(true);
      console.log('Orthanc connecté !');
    } catch (err: any) {
      setConnectionError(err.message || 'Erreur de connexion à Orthanc');
      setOrthancConnected(false);
    } finally {
      setConnecting(false);
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
            Visualisation et analyse des images médicales (Orthanc)
          </p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors" disabled>
          <Upload className="h-4 w-4" />
          <span>Charger DICOM</span>
        </button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* DICOM Files List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Études DICOM</h2>
            </div>
            <div className="p-4">
              {loadingStudies ? (
                <div className="text-center text-gray-500">Chargement...</div>
              ) : studies.length === 0 ? (
                <div className="text-center text-gray-500">Aucune étude trouvée</div>
              ) : (
                <div className="space-y-3">
                  {studies.map((study) => (
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
                        <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-xs font-bold text-gray-500">
                          DICOM
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
                        </div>
                      </div>
                    </div>
                  ))}
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
          <div className="bg-white rounded-lg shadow">
            {/* Toolbar */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Visualiseur
                  </h2>
                  {selectedInstance && (
                    <div className="text-sm text-gray-500">
                      Zoom: {zoom}%
                    </div>
                  )}
                </div>
                {selectedInstance && (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleZoomOut}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                      title="Zoom arrière"
                    >
                      <ZoomOut className="h-4 w-4" />
                    </button>
                    <button
                      onClick={handleZoomIn}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                      title="Zoom avant"
                    >
                      <ZoomIn className="h-4 w-4" />
                    </button>
                    <button
                      onClick={handleReset}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                      title="Réinitialiser"
                    >
                      <RotateCw className="h-4 w-4" />
                    </button>
                    <button
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                      title="Déplacer"
                      disabled
                    >
                      <Move className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-gray-600 hover:bg-gray-100 rounded transition-colors" disabled>
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
            {/* Viewer Content */}
            <div className="p-4">
              {selectedInstance && dicomImageUrl ? (
                <div className="relative bg-black rounded-lg overflow-hidden" style={{ minHeight: '500px' }}>
                  <div className="flex items-center justify-center h-full">
                    <img
                      src={dicomImageUrl}
                      alt="DICOM Preview"
                      className="max-w-full max-h-full"
                      style={{ transform: `scale(${zoom / 100})`, cursor: isDragging ? 'grabbing' : 'grab' }}
                    />
                  </div>
                  {/* Image Info Overlay */}
                  <div className="absolute top-4 left-4 bg-black bg-opacity-75 text-white text-xs p-2 rounded">
                    <div>Patient: {selectedStudy?.PatientMainDicomTags.PatientName}</div>
                    <div>Modalité: {selectedSeries?.MainDicomTags.Modality}</div>
                    <div>Série: {selectedSeries?.MainDicomTags.SeriesDescription}</div>
                    <div>Date: {selectedStudy?.MainDicomTags.StudyDate}</div>
                  </div>
                  {/* Measurement Tools Overlay */}
                  <div className="absolute bottom-4 right-4 bg-black bg-opacity-75 text-white text-xs p-2 rounded">
                    <div>Contraste: Auto</div>
                    <div>Luminosité: 50%</div>
                    <div>Filtre: Aucun</div>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-100 rounded-lg flex items-center justify-center" style={{ minHeight: '500px' }}>
                  <div className="text-center">
                    <Activity className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {selectedSeries ? 'Sélectionnez une image DICOM' : selectedStudy ? 'Sélectionnez une série' : 'Sélectionnez une étude DICOM'}
                    </h3>
                    <p className="text-gray-500">
                      {selectedSeries ? 'Choisissez une image à visualiser.' : selectedStudy ? 'Choisissez une série à explorer.' : 'Choisissez une étude dans la liste à gauche.'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Analysis Tools (optionnel, inchangé) */}
      {selectedInstance && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Outils d'analyse
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Mesures</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div>Longueur: 45.2 mm</div>
                <div>Aire: 324.5 mm²</div>
                <div>Angle: 12.5°</div>
              </div>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Annotations</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div>• Zone d'intérêt marquée</div>
                <div>• Anomalie détectée</div>
                <div>• Calcification présente</div>
              </div>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Historique</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div>Zoom appliqué: {zoom}%</div>
                <div>Contraste ajusté</div>
                <div>Annotation ajoutée</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DICOM;