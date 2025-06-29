import React, { useEffect, useRef, useState } from 'react';

interface DicomViewerProps {
  imageUrl: string;
  patientName?: string;
  studyDate?: string;
  modality?: string;
  seriesDescription?: string;
}

const DicomViewer: React.FC<DicomViewerProps> = ({
  imageUrl,
  patientName,
  studyDate,
  modality,
  seriesDescription
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [zoom, setZoom] = useState(100);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [activeTool, setActiveTool] = useState<string>('pan');

  useEffect(() => {
    if (!canvasRef.current || !imageUrl) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      setIsLoading(false);
      
      // Ajuster la taille du canvas
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Dessiner l'image
      ctx.drawImage(img, 0, 0);
    };
    
    img.onerror = () => {
      setError('Erreur lors du chargement de l\'image');
      setIsLoading(false);
    };
    
    img.src = imageUrl;
  }, [imageUrl]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (activeTool === 'pan') {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && activeTool === 'pan') {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (activeTool === 'zoom') {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      setZoom(prev => Math.max(25, Math.min(400, prev * delta)));
    }
  };

  const handleToolChange = (toolName: string) => {
    setActiveTool(toolName);
  };

  const handleReset = () => {
    setZoom(100);
    setPosition({ x: 0, y: 0 });
  };

  const handleDownload = () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = `dicom-${patientName || 'image'}-${new Date().getTime()}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="text-red-800">
          <h3 className="font-medium">Erreur de chargement</h3>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h3 className="text-lg font-semibold text-gray-900">Visualiseur DICOM Pro</h3>
            
            {/* Outils de navigation */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleToolChange('pan')}
                className={`px-3 py-1 text-sm rounded ${
                  activeTool === 'pan' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                }`}
                title="Déplacer"
              >
                🖐️ Déplacer
              </button>
              <button
                onClick={() => handleToolChange('zoom')}
                className={`px-3 py-1 text-sm rounded ${
                  activeTool === 'zoom' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                }`}
                title="Zoom"
              >
                🔍 Zoom
              </button>
            </div>

            {/* Informations */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                Zoom: {Math.round(zoom)}%
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleReset}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
              title="Réinitialiser"
            >
              🔄 Reset
            </button>
            <button
              onClick={handleDownload}
              className="px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200"
              title="Télécharger"
            >
              💾 Télécharger
            </button>
          </div>
        </div>
      </div>

      {/* Viewer */}
      <div className="relative bg-black overflow-hidden">
        <div 
          className="relative"
          style={{ 
            minHeight: '400px',
            cursor: activeTool === 'pan' ? (isDragging ? 'grabbing' : 'grab') : 'default'
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
        >
          <canvas
            ref={canvasRef}
            className="block"
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${zoom / 100})`,
              transformOrigin: '0 0',
              transition: isDragging ? 'none' : 'transform 0.1s ease-out'
            }}
          />
        </div>
        
        {isLoading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-white text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
              <p>Chargement de l'image...</p>
            </div>
          </div>
        )}

        {/* Informations DICOM */}
        <div className="absolute top-4 left-4 bg-black bg-opacity-75 text-white text-xs p-3 rounded">
          <div><strong>Patient:</strong> {patientName || 'N/A'}</div>
          <div><strong>Modalité:</strong> {modality || 'N/A'}</div>
          <div><strong>Série:</strong> {seriesDescription || 'N/A'}</div>
          <div><strong>Date:</strong> {studyDate || 'N/A'}</div>
        </div>

        {/* Instructions */}
        <div className="absolute bottom-4 right-4 bg-black bg-opacity-75 text-white text-xs p-3 rounded">
          <div><strong>Instructions:</strong></div>
          <div>• Clic gauche + glisser pour déplacer</div>
          <div>• Molette pour zoomer</div>
          <div>• Bouton Reset pour réinitialiser</div>
        </div>
      </div>
    </div>
  );
};

export default DicomViewer; 