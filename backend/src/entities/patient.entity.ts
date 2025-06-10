import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { Hospital } from './hospital.entity';
import { Consultation } from './consultation.entity';
import { Appointment } from './appointment.entity';

export enum PatientStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DECEASED = 'DECEASED',
  TRANSFERRED = 'TRANSFERRED',
}

export enum BloodType {
  A_POSITIVE = 'A+',
  A_NEGATIVE = 'A-',
  B_POSITIVE = 'B+',
  B_NEGATIVE = 'B-',
  AB_POSITIVE = 'AB+',
  AB_NEGATIVE = 'AB-',
  O_POSITIVE = 'O+',
  O_NEGATIVE = 'O-',
}

@Entity('patients')
@Index(['patientNumber'], { unique: true })
@Index(['hospitalId', 'status'])
@Index(['userId'])
export class Patient extends BaseEntity {
  @Column({ type: 'varchar', length: 50, unique: true })
  patientNumber: string;

  @Column({ type: 'varchar', length: 100 })
  firstName: string;

  @Column({ type: 'varchar', length: 100 })
  lastName: string;

  @Column({ type: 'date' })
  dateOfBirth: Date;

  @Column({ type: 'varchar', length: 10 })
  gender: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  emergencyContactName: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  emergencyContactPhone: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  emergencyContactRelation: string;

  @Column({
    type: 'enum',
    enum: BloodType,
    nullable: true,
  })
  bloodType: BloodType;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  height: number; // en cm

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  weight: number; // en kg

  @Column({
    type: 'enum',
    enum: PatientStatus,
    default: PatientStatus.ACTIVE,
  })
  status: PatientStatus;

  @Column({ type: 'text', nullable: true })
  medicalHistory: string;

  @Column({ type: 'json', nullable: true })
  allergies: string[];

  @Column({ type: 'json', nullable: true })
  chronicDiseases: string[];

  @Column({ type: 'json', nullable: true })
  currentMedications: {
    name: string;
    dosage: string;
    frequency: string;
    startDate: Date;
  }[];

  @Column({ type: 'varchar', length: 100, nullable: true })
  insuranceNumber: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  insuranceProvider: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  avatar: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'timestamp', nullable: true })
  lastVisitAt: Date;

  // Relations
  @Column({ type: 'uuid', nullable: true })
  userId: string;

  @ManyToOne(() => User, (user) => user.patientProfiles, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'uuid' })
  hospitalId: string;

  @ManyToOne(() => Hospital, (hospital) => hospital.patients, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'hospitalId' })
  hospital: Hospital;

  @OneToMany(() => Consultation, (consultation) => consultation.patient)
  consultations: Consultation[];

  @OneToMany(() => Appointment, (appointment) => appointment.patient)
  appointments: Appointment[];

  // Propriétés calculées
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  get age(): number {
    const today = new Date();
    const birthDate = new Date(this.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }

  get bmi(): number | null {
    if (this.height && this.weight) {
      const heightInMeters = this.height / 100;
      return Number((this.weight / (heightInMeters * heightInMeters)).toFixed(1));
    }
    return null;
  }

  get displayName(): string {
    return `${this.fullName} (${this.patientNumber})`;
  }
}

