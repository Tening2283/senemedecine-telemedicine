export interface User {
  id: string;
  email: string;
  nom: string;
  prenom: string;
  role: 'ADMIN' | 'MEDECIN' | 'SECRETAIRE' | 'PATIENT';
  hopital_id?: string;
  telephone?: string;
  specialite?: string;
  password_hash?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface Hopital {
  id: string;
  nom: string;
  adresse: string;
  telephone: string;
  email: string;
  ville: string;
  actif: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface Patient {
  id: string;
  nom: string;
  prenom: string;
  date_naissance: string;
  telephone: string;
  email?: string;
  adresse: string;
  numero_patient: string;
  hopital_id: string;
  medecin_referent_id?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface Consultation {
  id: string;
  patient_id: string;
  medecin_id: string;
  date: string;
  motif: string;
  diagnostic?: string;
  notes?: string;
  statut: 'PROGRAMMEE' | 'EN_COURS' | 'TERMINEE' | 'ANNULEE';
  hopital_id: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface Medicament {
  id: string;
  nom: string;
  dosage: string;
  frequence: string;
  duree: string;
  instructions?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface ConsultationMedicament {
  id: string;
  consultation_id: string;
  medicament_id: string;
  posologie?: string;
  created_at?: Date;
}

export interface RendezVous {
  id: string;
  patient_id: string;
  medecin_id: string;
  date: string;
  heure: string;
  motif: string;
  statut: 'CONFIRME' | 'EN_ATTENTE' | 'ANNULE';
  hopital_id: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface ImageDICOM {
  id: string;
  consultation_id: string;
  nom_fichier: string;
  chemin_fichier: string;
  taille: number;
  type_mime: string;
  created_at?: Date;
}

export interface LoginRequest {
  email: string;
  password: string;
  hopital_id: string;
}

export interface LoginResponse {
  user: User;
  hopital: Hopital;
  token: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AuthContextType {
  user: User | null;
  hopital: Hopital | null;
  login: (email: string, password: string, hopitalId: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
} 