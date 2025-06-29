import { 
  OrthancStudy, 
  OrthancSeries, 
  OrthancInstance, 
  OrthancPatient
} from '../types';

class OrthancService {
  async connect(): Promise<boolean> {
    const response = await fetch('http://localhost:3001/api/orthanc/system');
    if (!response.ok) throw new Error('Erreur de connexion à Orthanc');
    return true;
  }

  async getStudies(): Promise<string[]> {
    const response = await fetch('http://localhost:3001/api/orthanc/studies');
    if (!response.ok) throw new Error('Erreur lors de la récupération des études');
    return response.json();
  }

  async getAllSeries(): Promise<string[]> {
    const response = await fetch('http://localhost:3001/api/orthanc/series');
    if (!response.ok) throw new Error('Erreur lors de la récupération des séries');
    return response.json();
  }

  async getStudy(id: string): Promise<OrthancStudy> {
    const response = await fetch(`http://localhost:3001/api/orthanc/studies/${id}`);
    if (!response.ok) throw new Error('Erreur lors de la récupération de l\'étude');
    return response.json();
  }

  async getStudySeries(studyId: string): Promise<OrthancSeries[]> {
    const response = await fetch(`http://localhost:3001/api/orthanc/studies/${studyId}/series`);
    if (!response.ok) throw new Error('Erreur lors de la récupération des séries');
    return response.json();
  }

  async getSeries(seriesId: string): Promise<OrthancSeries> {
    const response = await fetch(`http://localhost:3001/api/orthanc/series/${seriesId}`);
    if (!response.ok) throw new Error('Erreur lors de la récupération de la série');
    return response.json();
  }

  async getSeriesInstances(seriesId: string): Promise<OrthancInstance[]> {
    const response = await fetch(`http://localhost:3001/api/orthanc/series/${seriesId}/instances`);
    if (!response.ok) throw new Error('Erreur lors de la récupération des instances');
    return response.json();
  }

  async getInstance(instanceId: string): Promise<OrthancInstance> {
    const response = await fetch(`http://localhost:3001/api/orthanc/instances/${instanceId}`);
    if (!response.ok) throw new Error('Erreur lors de la récupération de l\'instance');
    return response.json();
  }

  async getInstanceImage(instanceId: string): Promise<string> {
    const response = await fetch(`http://localhost:3001/api/orthanc/instances/${instanceId}/preview`);
    if (!response.ok) throw new Error(`Failed to get image: ${response.status}`);
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  }

  // Get DICOM file
  async getInstanceFile(instanceId: string): Promise<Blob> {
    const response = await fetch(`http://localhost:3001/api/orthanc/instances/${instanceId}/file`);
    if (!response.ok) {
      throw new Error(`Failed to get DICOM file: ${response.status}`);
    }
    return response.blob();
  }

  // Search studies
  async searchStudies(query: string): Promise<OrthancStudy[]> {
    const response = await fetch('http://localhost:3001/api/orthanc/tools/find', {
      method: 'POST',
      body: JSON.stringify({
        Level: 'Study',
        Query: {
          PatientName: query
        }
      })
    });
    if (!response.ok) throw new Error('Erreur lors de la recherche des études');
    const ids: string[] = await response.json();

    if (ids.length > 0) {
      const studyPromises = ids.map((id: string) => this.getStudy(id));
      return Promise.all(studyPromises);
    }

    return [];
  }

  // Get patient by ID
  async getPatient(patientId: string): Promise<OrthancPatient> {
    const response = await fetch(`http://localhost:3001/api/orthanc/patients/${patientId}`);
    if (!response.ok) throw new Error('Erreur lors de la récupération du patient');
    return response.json();
  }
}

export const orthancService = new OrthancService(); 