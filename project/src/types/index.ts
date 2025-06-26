export interface User {
  id: string;
  email: string;
  nom: string;
  prenom: string;
  role: 'ADMIN' | 'MEDECIN' | 'SECRETAIRE' | 'PATIENT';
  hopital_id?: string;
  telephone?: string;
  specialite?: string;
}

export interface Hopital {
  id: string;
  nom: string;
  adresse: string;
  telephone: string;
  email: string;
  ville: string;
  actif: boolean;
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
  medicaments?: Medicament[];
  images_dicom?: string[];
}

export interface Medicament {
  id: string;
  nom: string;
  dosage: string;
  frequence: string;
  duree: string;
  instructions?: string;
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
}

export interface AuthContextType {
  user: User | null;
  hopital: Hopital | null;
  login: (email: string, password: string, hopitalId: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
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

// Orthanc Types
export interface OrthancStudy {
  ID: string;
  MainDicomTags: {
    PatientName?: string;
    PatientID?: string;
    StudyDate?: string;
    StudyDescription?: string;
    AccessionNumber?: string;
    StudyInstanceUID?: string;
  };
  PatientMainDicomTags: {
    PatientName?: string;
    PatientID?: string;
    PatientBirthDate?: string;
    PatientSex?: string;
  };
  Series: string[];
  LastUpdate: string;
}

export interface OrthancSeries {
  ID: string;
  MainDicomTags: {
    SeriesDescription?: string;
    SeriesDate?: string;
    SeriesTime?: string;
    Modality?: string;
    BodyPartExamined?: string;
    SeriesInstanceUID?: string;
  };
  Instances: string[];
  ParentStudy: string;
  LastUpdate: string;
}

export interface OrthancInstance {
  ID: string;
  MainDicomTags: {
    InstanceNumber?: string;
    ImageComments?: string;
    ImageType?: string;
    SOPInstanceUID?: string;
  };
  ParentSeries: string;
  ParentStudy: string;
  FileSize: number;
  FileUuid: string;
  IndexInSeries: number;
  LastUpdate: string;
}

export interface OrthancPatient {
  ID: string;
  MainDicomTags: {
    PatientName?: string;
    PatientID?: string;
    PatientBirthDate?: string;
    PatientSex?: string;
  };
  Studies: string[];
  LastUpdate: string;
}

export interface OrthancConnectionConfig {
  url: string;
  username: string;
  password: string;
}

export interface DicomViewerState {
  studies: OrthancStudy[];
  selectedStudy: OrthancStudy | null;
  selectedSeries: OrthancSeries | null;
  selectedInstance: OrthancInstance | null;
  loading: boolean;
  error: string | null;
  connectionStatus: 'disconnected' | 'connecting' | 'connected' | 'error';
}

export type LoginRequest = {
  email: string;
  password: string;
  hopital_id?: string;
};

export type LoginResponse = {
  token: string;
  user: any; // Remplace "any" par ton type User si tu en as un
};