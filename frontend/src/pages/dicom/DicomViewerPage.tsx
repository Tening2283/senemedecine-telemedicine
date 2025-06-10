import React from 'react';

const DicomViewerPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Visualiseur DICOM</h1>
      <p className="text-gray-600">
        Cette page permettra de visualiser les images DICOM avec CornerstoneJS.
      </p>
    </div>
  );
};

export default DicomViewerPage;
