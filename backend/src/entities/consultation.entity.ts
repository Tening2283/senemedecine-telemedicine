import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { Patient } from './patient.entity';
import { User } from './user.entity';
import { Hospital } from './hospital.entity';
import { DicomImage } from './dicom-image.entity';

export enum ConsultationType {
  CONSULTATION = 'CONSULTATION',
  URGENCE = 'URGENCE',
  CONTROLE = 'CONTROLE',
  TELEMEDICINE = 'TELEMEDICINE',
  CHIRURGIE = 'CHIRURGIE',
}

export enum ConsultationStatus {
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  NO_SHOW = 'NO_SHOW',
}

export enum ConsultationPriority {
  LOW = 'LOW',
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

@Entity('consultations')
@Index(['patientId', 'consultationDate'])
@Index(['doctorId', 'consultationDate'])
@Index(['hospitalId', 'status'])
export class Consultation extends BaseEntity {
  @Column({ type: 'varchar', length: 50, unique: true })
  consultationNumber: string;

  @Column({ type: 'timestamp' })
  consultationDate: Date;

  @Column({
    type: 'enum',
    enum: ConsultationType,
    default: ConsultationType.CONSULTATION,
  })
  type: ConsultationType;

  @Column({
    type: 'enum',
    enum: ConsultationStatus,
    default: ConsultationStatus.SCHEDULED,
  })
  status: ConsultationStatus;

  @Column({
    type: 'enum',
    enum: ConsultationPriority,
    default: ConsultationPriority.NORMAL,
  })
  priority: ConsultationPriority;

  @Column({ type: 'text', nullable: true })
  chiefComplaint: string; // Motif de consultation

  @Column({ type: 'text', nullable: true })
  historyOfPresentIllness: string; // Histoire de la maladie actuelle

  @Column({ type: 'text', nullable: true })
  physicalExamination: string; // Examen physique

  @Column({ type: 'json', nullable: true })
  vitalSigns: {
    temperature?: number; // °C
    bloodPressure?: {
      systolic: number;
      diastolic: number;
    };
    heartRate?: number; // bpm
    respiratoryRate?: number; // /min
    oxygenSaturation?: number; // %
    weight?: number; // kg
    height?: number; // cm
  };

  @Column({ type: 'text', nullable: true })
  diagnosis: string; // Diagnostic

  @Column({ type: 'json', nullable: true })
  icdCodes: string[]; // Codes CIM-10

  @Column({ type: 'text', nullable: true })
  treatmentPlan: string; // Plan de traitement

  @Column({ type: 'json', nullable: true })
  prescriptions: {
    medication: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string;
  }[];

  @Column({ type: 'json', nullable: true })
  labOrders: {
    test: string;
    urgency: string;
    instructions: string;
  }[];

  @Column({ type: 'json', nullable: true })
  imagingOrders: {
    type: string; // X-Ray, CT, MRI, etc.
    bodyPart: string;
    urgency: string;
    instructions: string;
  }[];

  @Column({ type: 'text', nullable: true })
  followUpInstructions: string;

  @Column({ type: 'date', nullable: true })
  nextAppointmentDate: Date;

  @Column({ type: 'text', nullable: true })
  doctorNotes: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  consultationFee: number;

  @Column({ type: 'boolean', default: false })
  isPaid: boolean;

  @Column({ type: 'int', nullable: true })
  duration: number; // Durée en minutes

  @Column({ type: 'timestamp', nullable: true })
  startTime: Date;

  @Column({ type: 'timestamp', nullable: true })
  endTime: Date;

  // Relations
  @Column({ type: 'uuid' })
  patientId: string;

  @ManyToOne(() => Patient, (patient) => patient.consultations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'patientId' })
  patient: Patient;

  @Column({ type: 'uuid' })
  doctorId: string;

  @ManyToOne(() => User, (user) => user.consultationsAsDoctors, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'doctorId' })
  doctor: User;

  @Column({ type: 'uuid' })
  hospitalId: string;

  @ManyToOne(() => Hospital, (hospital) => hospital.consultations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'hospitalId' })
  hospital: Hospital;

  @OneToMany(() => DicomImage, (dicomImage) => dicomImage.consultation)
  dicomImages: DicomImage[];

  // Propriétés calculées
  get isCompleted(): boolean {
    return this.status === ConsultationStatus.COMPLETED;
  }

  get isInProgress(): boolean {
    return this.status === ConsultationStatus.IN_PROGRESS;
  }

  get isScheduled(): boolean {
    return this.status === ConsultationStatus.SCHEDULED;
  }

  get actualDuration(): number | null {
    if (this.startTime && this.endTime) {
      return Math.round((this.endTime.getTime() - this.startTime.getTime()) / (1000 * 60));
    }
    return null;
  }

  get displayStatus(): string {
    const statusMap = {
      [ConsultationStatus.SCHEDULED]: 'Programmée',
      [ConsultationStatus.IN_PROGRESS]: 'En cours',
      [ConsultationStatus.COMPLETED]: 'Terminée',
      [ConsultationStatus.CANCELLED]: 'Annulée',
      [ConsultationStatus.NO_SHOW]: 'Absent',
    };
    return statusMap[this.status] || this.status;
  }
}

