import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { BaseEntity } from './base.entity';
import { Hospital } from './hospital.entity';
import { Patient } from './patient.entity';
import { Consultation } from './consultation.entity';
import { Appointment } from './appointment.entity';

export enum UserRole {
  ADMIN = 'ADMIN',
  MEDECIN = 'MEDECIN',
  SECRETAIRE = 'SECRETAIRE',
  PATIENT = 'PATIENT',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  PENDING = 'PENDING',
}

@Entity('users')
@Index(['email'], { unique: true })
@Index(['hospitalId', 'role'])
export class User extends BaseEntity {
  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  @Exclude({ toPlainOnly: true })
  passwordHash: string;

  @Column({ type: 'varchar', length: 100 })
  firstName: string;

  @Column({ type: 'varchar', length: 100 })
  lastName: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.PATIENT,
  })
  role: UserRole;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ACTIVE,
  })
  status: UserStatus;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string;

  @Column({ type: 'date', nullable: true })
  dateOfBirth: Date;

  @Column({ type: 'varchar', length: 10, nullable: true })
  gender: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  speciality: string; // Pour les médecins

  @Column({ type: 'varchar', length: 50, nullable: true })
  licenseNumber: string; // Numéro d'ordre pour les médecins

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  avatar: string;

  @Column({ type: 'timestamp', nullable: true })
  lastLoginAt: Date;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'boolean', default: false })
  emailVerified: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  emailVerificationToken: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  passwordResetToken: string;

  @Column({ type: 'timestamp', nullable: true })
  passwordResetExpiresAt: Date;

  // Relations
  @Column({ type: 'uuid', nullable: true })
  hospitalId: string;

  @ManyToOne(() => Hospital, (hospital) => hospital.users, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'hospitalId' })
  hospital: Hospital;

  // Relations pour les patients (si l'utilisateur est un patient)
  @OneToMany(() => Patient, (patient) => patient.user)
  patientProfiles: Patient[];

  // Relations pour les médecins
  @OneToMany(() => Consultation, (consultation) => consultation.doctor)
  consultationsAsDoctors: Consultation[];

  @OneToMany(() => Appointment, (appointment) => appointment.doctor)
  appointmentsAsDoctor: Appointment[];

  // Relations pour les secrétaires
  @OneToMany(() => Appointment, (appointment) => appointment.createdBy)
  appointmentsCreated: Appointment[];

  // Propriétés calculées
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  get isDoctor(): boolean {
    return this.role === UserRole.MEDECIN;
  }

  get isSecretary(): boolean {
    return this.role === UserRole.SECRETAIRE;
  }

  get isPatient(): boolean {
    return this.role === UserRole.PATIENT;
  }

  get isAdmin(): boolean {
    return this.role === UserRole.ADMIN;
  }
}

