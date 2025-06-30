import { 
  User, 
  Hopital, 
  Patient, 
  Consultation, 
  RendezVous, 
  Medicament,
  LoginRequest,
  LoginResponse,
  ApiResponse,
  PaginatedResponse
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiService {
  private token: string | null = null;

  constructor() {
    // Récupérer le token depuis le localStorage
    this.token = localStorage.getItem('token');
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers && typeof options.headers === 'object' && !Array.isArray(options.headers)
        ? options.headers as Record<string, string>
        : {}),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur de requête');
      }

      return data;
    } catch (error) {
      console.error('Erreur API:', error);
      throw error;
    }
  }

  // Authentification
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await this.request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (response.data) {
      this.token = response.data.token;
      localStorage.setItem('token', this.token);
    }

    return response.data!;
  }

  async getProfile(): Promise<User> {
    const response = await this.request<User>('/auth/profile');
    return response.data!;
  }

  logout(): void {
    this.token = null;
    localStorage.removeItem('token');
  }

  async deleteUser(id: string): Promise<void> {
    await this.request(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  // Hôpitaux
  async getHopitaux(page = 1, limit = 10): Promise<PaginatedResponse<Hopital>> {
    const response = await this.request<PaginatedResponse<Hopital>>(
      `/hopitaux?page=${page}&limit=${limit}`
    );
    return response.data!;
  }
  async getUsers(): Promise<User[]> {
    const response = await this.request<User[]>('/users');
    return response.data!;
  }
  async getHopitalById(id: string): Promise<Hopital> {
    const response = await this.request<Hopital>(`/hopitaux/${id}`);
    return response.data!;
  }

  async createHopital(hopital: Omit<Hopital, 'id' | 'created_at' | 'updated_at'>): Promise<Hopital> {
    const response = await this.request<Hopital>('/hopitaux', {
      method: 'POST',
      body: JSON.stringify(hopital),
    });
    return response.data!;
  }

  async updateHopital(id: string, hopital: Partial<Hopital>): Promise<Hopital> {
    const response = await this.request<Hopital>(`/hopitaux/${id}`, {
      method: 'PUT',
      body: JSON.stringify(hopital),
    });
    return response.data!;
  }

  async deleteHopital(id: string): Promise<void> {
    await this.request(`/hopitaux/${id}`, {
      method: 'DELETE',
    });
  }

  // Patients
  async getPatients(page = 1, limit = 10, hopitalId?: string): Promise<PaginatedResponse<Patient>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (hopitalId) params.append('hopital_id', hopitalId);

    console.log('🌐 API - getPatients appelé avec params:', params.toString());
    const response = await this.request<PaginatedResponse<Patient>>(`/patients?${params}`);
    console.log('🌐 API - getPatients réponse brute:', response);
    return response.data!;
  }

  async getPatientById(id: string): Promise<Patient> {
    const response = await this.request<Patient>(`/patients/${id}`);
    return response.data!;
  }

  async createPatient(patient: Omit<Patient, 'id' | 'created_at' | 'updated_at'>): Promise<Patient> {
    const response = await this.request<Patient>('/patients', {
      method: 'POST',
      body: JSON.stringify(patient),
    });
    return response.data!;
  }

  async updatePatient(id: string, patient: Partial<Patient>): Promise<Patient> {
    const response = await this.request<Patient>(`/patients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(patient),
    });
    return response.data!;
  }

  async deletePatient(id: string): Promise<void> {
    await this.request(`/patients/${id}`, {
      method: 'DELETE',
    });
  }

  // Consultations
  async getConsultations(page = 1, limit = 10, hopitalId?: string): Promise<PaginatedResponse<Consultation>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (hopitalId) params.append('hopital_id', hopitalId);

    const response = await this.request<PaginatedResponse<Consultation>>(`/consultations?${params}`);
    return response.data!;
  }

  async getConsultationById(id: string): Promise<Consultation> {
    const response = await this.request<Consultation>(`/consultations/${id}`);
    return response.data!;
  }

  async createConsultation(consultation: Omit<Consultation, 'id' | 'created_at' | 'updated_at'>): Promise<Consultation> {
    const response = await this.request<Consultation>('/consultations', {
      method: 'POST',
      body: JSON.stringify(consultation),
    });
    return response.data!;
  }

  async updateConsultation(id: string, consultation: Partial<Consultation>): Promise<Consultation> {
    const response = await this.request<Consultation>(`/consultations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(consultation),
    });
    return response.data!;
  }

  async deleteConsultation(id: string): Promise<void> {
    await this.request(`/consultations/${id}`, {
      method: 'DELETE',
    });
  }

  // Rendez-vous
  async getRendezVous(page = 1, limit = 10, hopitalId?: string): Promise<PaginatedResponse<RendezVous>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (hopitalId) params.append('hopital_id', hopitalId);

    const response = await this.request<PaginatedResponse<RendezVous>>(`/rendez-vous?${params}`);
    return response.data!;
  }

  async getRendezVousById(id: string): Promise<RendezVous> {
    const response = await this.request<RendezVous>(`/rendez-vous/${id}`);
    return response.data!;
  }

  async createRendezVous(rendezVous: Omit<RendezVous, 'id' | 'created_at' | 'updated_at'>): Promise<RendezVous> {
    const response = await this.request<RendezVous>('/rendez-vous', {
      method: 'POST',
      body: JSON.stringify(rendezVous),
    });
    return response.data!;
  }

  async updateRendezVous(id: string, rendezVous: Partial<RendezVous>): Promise<RendezVous> {
    const response = await this.request<RendezVous>(`/rendez-vous/${id}`, {
      method: 'PUT',
      body: JSON.stringify(rendezVous),
    });
    return response.data!;
  }

  async deleteRendezVous(id: string): Promise<void> {
    await this.request(`/rendez-vous/${id}`, {
      method: 'DELETE',
    });
  }

  // Médicaments
  async getMedicaments(page = 1, limit = 10): Promise<PaginatedResponse<Medicament>> {
    const response = await this.request<PaginatedResponse<Medicament>>(
      `/medicaments?page=${page}&limit=${limit}`
    );
    return response.data!;
  }

  async getMedicamentById(id: string): Promise<Medicament> {
    const response = await this.request<Medicament>(`/medicaments/${id}`);
    return response.data!;
  }

  async createMedicament(medicament: Omit<Medicament, 'id' | 'created_at' | 'updated_at'>): Promise<Medicament> {
    const response = await this.request<Medicament>('/medicaments', {
      method: 'POST',
      body: JSON.stringify(medicament),
    });
    return response.data!;
  }

  async updateMedicament(id: string, medicament: Partial<Medicament>): Promise<Medicament> {
    const response = await this.request<Medicament>(`/medicaments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(medicament),
    });
    return response.data!;
  }

  async deleteMedicament(id: string): Promise<void> {
    await this.request(`/medicaments/${id}`, {
      method: 'DELETE',
    });
  }

  // Upload d'images DICOM
  async uploadDicomFile(consultationId: string, file: File): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('consultation_id', consultationId);

    const url = `${API_BASE_URL}/dicom/upload`;
    
    const headers: Record<string, string> = {};
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erreur lors de l\'upload');
    }

    return response.json();
  }

  // Statistiques
  async getDashboardStats(hopitalId?: string): Promise<any> {
    const params = hopitalId ? `?hopital_id=${hopitalId}` : '';
    const response = await this.request(`/stats/dashboard${params}`);
    return response.data;
  }

  // Utilisateurs
  async createUser(user: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> {
    const response = await this.request<User>('/users', {
      method: 'POST',
      body: JSON.stringify(user),
    });
    return response.data!;
  }

  // Associations patient-DICOM
  async getPatientDicomAssociations(params = {}): Promise<any[]> {
    const queryString = new URLSearchParams(params as Record<string, string>).toString();
    const url = queryString ? `/patient-dicom?${queryString}` : '/patient-dicom';
    const response = await this.request<PaginatedResponse<any>>(url);
    return response.data!.data;
  }

  async getPatientDicomAssociationsByPatient(patientId: string): Promise<any[]> {
    const response = await this.request<PaginatedResponse<any>>('/patient-dicom/patient/' + patientId);
    return response.data!.data;
  }

  async createPatientDicomAssociation(data: { patient_id: string; orthanc_study_id: string }): Promise<any> {
    const response = await this.request<any>('/patient-dicom', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.data;
  }

  async deletePatientDicomAssociation(id: string): Promise<void> {
    await this.request(`/patient-dicom/${id}`, {
      method: 'DELETE',
    });
  }

  // Associations consultation-DICOM
  async getConsultationDicomAssociations(params = {}): Promise<any[]> {
    const queryString = new URLSearchParams(params as Record<string, string>).toString();
    const url = queryString ? `/consultation-dicom?${queryString}` : '/consultation-dicom';
    const response = await this.request<PaginatedResponse<any>>(url);
    return response.data!.data;
  }

  async getConsultationDicomAssociationsByConsultation(consultationId: string): Promise<any[]> {
    const response = await this.request<PaginatedResponse<any>>(`/consultation-dicom/consultation/${consultationId}`);
    return response.data!.data;
  }

  async createConsultationDicomAssociation(data: { consultation_id: string; orthanc_study_id: string }): Promise<any> {
    const response = await this.request<any>('/consultation-dicom', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.data;
  }

  async deleteConsultationDicomAssociation(id: string): Promise<void> {
    await this.request(`/consultation-dicom/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();
export default apiService;

export const apiStats = {
  async getConsultationsParMois() {
    const res = await apiService.get('/stats/consultations-par-mois');
    return res.data;
  },
  async getRepartitionRoles() {
    const res = await apiService.get('/stats/repartition-roles');
    return res.data;
  },
  async getPatientsParHopital() {
    const res = await apiService.get('/stats/patients-par-hopital');
    return res.data;
  },
  async getConsultationsParHopital() {
    const res = await apiService.get('/stats/consultations-par-hopital');
    return res.data;
  },
}; 