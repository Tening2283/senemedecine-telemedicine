import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { Patient } from './patient.entity';
import { Consultation } from './consultation.entity';
import { Hospital } from './hospital.entity';

export enum DicomImageStatus {
  UPLOADED = 'UPLOADED',
  PROCESSING = 'PROCESSING',
  AVAILABLE = 'AVAILABLE',
  ERROR = 'ERROR',
  ARCHIVED = 'ARCHIVED',
}

export enum DicomModality {
  CR = 'CR', // Computed Radiography
  CT = 'CT', // Computed Tomography
  MR = 'MR', // Magnetic Resonance
  US = 'US', // Ultrasound
  XA = 'XA', // X-Ray Angiography
  RF = 'RF', // Radiofluoroscopy
  DX = 'DX', // Digital Radiography
  MG = 'MG', // Mammography
  PT = 'PT', // Positron Emission Tomography
  NM = 'NM', // Nuclear Medicine
  OT = 'OT', // Other
}

@Entity('dicom_images')
@Index(['patientId', 'studyDate'])
@Index(['consultationId'])
@Index(['orthancId'], { unique: true })
@Index(['hospitalId', 'status'])
export class DicomImage extends BaseEntity {
  @Column({ type: 'varchar', length: 255, unique: true })
  orthancId: string; // ID dans Orthanc

  @Column({ type: 'varchar', length: 255 })
  studyInstanceUID: string;

  @Column({ type: 'varchar', length: 255 })
  seriesInstanceUID: string;

  @Column({ type: 'varchar', length: 255 })
  sopInstanceUID: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  studyDescription: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  seriesDescription: string;

  @Column({ type: 'date' })
  studyDate: Date;

  @Column({ type: 'time', nullable: true })
  studyTime: string;

  @Column({
    type: 'enum',
    enum: DicomModality,
    nullable: true,
  })
  modality: DicomModality;

  @Column({ type: 'varchar', length: 255, nullable: true })
  bodyPartExamined: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  institutionName: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  manufacturerModelName: string;

  @Column({ type: 'int', nullable: true })
  instanceNumber: number;

  @Column({ type: 'int', nullable: true })
  seriesNumber: number;

  @Column({ type: 'int', nullable: true })
  rows: number;

  @Column({ type: 'int', nullable: true })
  columns: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  pixelSpacing: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  sliceThickness: string;

  @Column({ type: 'bigint', nullable: true })
  fileSize: number; // Taille en bytes

  @Column({
    type: 'enum',
    enum: DicomImageStatus,
    default: DicomImageStatus.UPLOADED,
  })
  status: DicomImageStatus;

  @Column({ type: 'text', nullable: true })
  radiologyReport: string; // Rapport de radiologie

  @Column({ type: 'text', nullable: true })
  findings: string; // Résultats

  @Column({ type: 'text', nullable: true })
  impression: string; // Impression diagnostique

  @Column({ type: 'json', nullable: true })
  annotations: {
    type: string;
    coordinates: number[];
    text: string;
    createdBy: string;
    createdAt: Date;
  }[];

  @Column({ type: 'json', nullable: true })
  measurements: {
    type: string;
    value: number;
    unit: string;
    coordinates: number[];
    createdBy: string;
    createdAt: Date;
  }[];

  @Column({ type: 'boolean', default: false })
  isReported: boolean;

  @Column({ type: 'timestamp', nullable: true })
  reportedAt: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  reportedBy: string;

  @Column({ type: 'boolean', default: false })
  isArchived: boolean;

  @Column({ type: 'timestamp', nullable: true })
  archivedAt: Date;

  @Column({ type: 'text', nullable: true })
  errorMessage: string;

  @Column({ type: 'json', nullable: true })
  dicomTags: Record<string, any>; // Tags DICOM importants

  @Column({ type: 'varchar', length: 255, nullable: true })
  thumbnailPath: string;

  @Column({ type: 'int', default: 0 })
  viewCount: number;

  @Column({ type: 'timestamp', nullable: true })
  lastViewedAt: Date;

  // Relations
  @Column({ type: 'uuid' })
  patientId: string;

  @ManyToOne(() => Patient, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'patientId' })
  patient: Patient;

  @Column({ type: 'uuid', nullable: true })
  consultationId: string;

  @ManyToOne(() => Consultation, (consultation) => consultation.dicomImages, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'consultationId' })
  consultation: Consultation;

  @Column({ type: 'uuid' })
  hospitalId: string;

  @ManyToOne(() => Hospital, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'hospitalId' })
  hospital: Hospital;

  // Propriétés calculées
  get isAvailable(): boolean {
    return this.status === DicomImageStatus.AVAILABLE;
  }

  get hasError(): boolean {
    return this.status === DicomImageStatus.ERROR;
  }

  get displayModality(): string {
    const modalityMap = {
      [DicomModality.CR]: 'Radiographie Numérisée',
      [DicomModality.CT]: 'Scanner',
      [DicomModality.MR]: 'IRM',
      [DicomModality.US]: 'Échographie',
      [DicomModality.XA]: 'Angiographie',
      [DicomModality.RF]: 'Radioscopie',
      [DicomModality.DX]: 'Radiographie Numérique',
      [DicomModality.MG]: 'Mammographie',
      [DicomModality.PT]: 'TEP',
      [DicomModality.NM]: 'Médecine Nucléaire',
      [DicomModality.OT]: 'Autre',
    };
    return modalityMap[this.modality] || this.modality;
  }

  get fileSizeFormatted(): string {
    if (!this.fileSize) return 'Inconnu';
    
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = this.fileSize;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  }

  get orthancUrl(): string {
    return `/instances/${this.orthancId}`;
  }

  get previewUrl(): string {
    return `/instances/${this.orthancId}/preview`;
  }
}

