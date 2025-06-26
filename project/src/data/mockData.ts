import { User, Hopital, Patient, Consultation, RendezVous, Medicament } from '../types';

export const mockHopitaux: Hopital[] = [
  {
    id: '1', 
    nom: 'Hôpital Principal de Dakar',
    adresse: 'Avenue Cheikh Anta Diop, Dakar',
    telephone: '+221 33 889 92 60',
    email: 'contact@hopital-dakar.sn',
    ville: 'Dakar',
    actif: true
  },
  {
    id: '2',
    nom: 'Centre Hospitalier de Saint-Louis',
    adresse: 'Rue Abdoulaye Mar Diop, Saint-Louis',
    telephone: '+221 33 961 15 51',
    email: 'info@ch-stlouis.sn',
    ville: 'Saint-Louis',
    actif: true
  },
  {
    id: '3',
    nom: 'Hôpital Régional de Thiès',
    adresse: 'Route de Mbour, Thiès',
    telephone: '+221 33 951 11 18',
    email: 'direction@hr-thies.sn',
    ville: 'Thiès',
    actif: true
  }
];

export const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@senemedecine.sn',
    nom: 'Diop',
    prenom: 'Aminata',
    role: 'ADMIN',
    telephone: '+221 77 123 45 67'
  },
  {
    id: '2',
    email: 'dr.fall@hopital-dakar.sn',
    nom: 'Fall',
    prenom: 'Mamadou',
    role: 'MEDECIN',
    hopital_id: '1',
    telephone: '+221 76 987 65 43',
    specialite: 'Cardiologie'
  },
  {
    id: '3',
    email: 'sec.ndiaye@hopital-dakar.sn',
    nom: 'Ndiaye',
    prenom: 'Fatou',
    role: 'SECRETAIRE',
    hopital_id: '1',
    telephone: '+221 78 456 78 90'
  },
  {
    id: '4',
    email: 'patient.sow@email.sn',
    nom: 'Sow',
    prenom: 'Ibrahima',
    role: 'PATIENT',
    hopital_id: '1',
    telephone: '+221 77 654 32 10'
  },
  {
    id: '5',
    email: 'dr.ba@ch-stlouis.sn',
    nom: 'Ba',
    prenom: 'Aïssatou',
    role: 'MEDECIN',
    hopital_id: '2',
    telephone: '+221 76 111 22 33',
    specialite: 'Radiologie'
  }
];

export const mockPatients: Patient[] = [
  {
    id: '1',
    nom: 'Diallo',
    prenom: 'Moussa',
    date_naissance: '1985-03-15',
    telephone: '+221 77 234 56 78',
    email: 'moussa.diallo@email.sn',
    adresse: 'Parcelles Assainies, Dakar',
    numero_patient: 'PAT-2024-001',
    hopital_id: '1',
    medecin_referent_id: '2'
  },
  {
    id: '2',
    nom: 'Sarr',
    prenom: 'Khady',
    date_naissance: '1992-07-22',
    telephone: '+221 78 345 67 89',
    adresse: 'Medina, Dakar',
    numero_patient: 'PAT-2024-002',
    hopital_id: '1',
    medecin_referent_id: '2'
  },
  {
    id: '3',
    nom: 'Gueye',
    prenom: 'Omar',
    date_naissance: '1978-11-08',
    telephone: '+221 76 456 78 90',
    adresse: 'HLM Grand Yoff, Dakar',
    numero_patient: 'PAT-2024-003',
    hopital_id: '1'
  }
];

export const mockMedicaments: Medicament[] = [
  {
    id: '1',
    nom: 'Amoxicilline',
    dosage: '500mg',
    frequence: '3 fois par jour',
    duree: '7 jours',
    instructions: 'À prendre avec les repas'
  },
  {
    id: '2',
    nom: 'Paracétamol',
    dosage: '1000mg',
    frequence: '3 fois par jour',
    duree: '5 jours',
    instructions: 'En cas de douleur ou fièvre'
  }
];

export const mockConsultations: Consultation[] = [
  {
    id: '1',
    patient_id: '1',
    medecin_id: '2',
    date: '2024-01-15T10:30:00Z',
    motif: 'Douleurs thoraciques',
    diagnostic: 'Angine de poitrine stable',
    notes: 'Patient présentant des douleurs thoraciques à l\'effort. ECG normal au repos.',
    statut: 'TERMINEE',
    hopital_id: '1',
    medicaments: [mockMedicaments[1]],
    images_dicom: ['dcm_001', 'dcm_002']
  },
  {
    id: '2',
    patient_id: '2',
    medecin_id: '2',
    date: '2024-01-16T14:00:00Z',
    motif: 'Contrôle de routine',
    statut: 'PROGRAMMEE',
    hopital_id: '1'
  }
];

export const mockRendezVous: RendezVous[] = [
  {
    id: '1',
    patient_id: '1',
    medecin_id: '2',
    date: '2024-01-20',
    heure: '09:00',
    motif: 'Suivi cardiologique',
    statut: 'CONFIRME',
    hopital_id: '1'
  },
  {
    id: '2',
    patient_id: '3',
    medecin_id: '2',
    date: '2024-01-20',
    heure: '10:30',
    motif: 'Première consultation',
    statut: 'EN_ATTENTE',
    hopital_id: '1'
  }
];