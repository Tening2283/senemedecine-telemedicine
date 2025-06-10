import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Patient } from './patient.entity';
import { User } from './user.entity';
import { Hospital } from './hospital.entity';

export enum AppointmentStatus {
  SCHEDULED = 'SCHEDULED',
  CONFIRMED = 'CONFIRMED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  NO_SHOW = 'NO_SHOW',
  RESCHEDULED = 'RESCHEDULED',
}

export enum AppointmentType {
  CONSULTATION = 'CONSULTATION',
  FOLLOW_UP = 'FOLLOW_UP',
  EMERGENCY = 'EMERGENCY',
  TELEMEDICINE = 'TELEMEDICINE',
  SURGERY = 'SURGERY',
  DIAGNOSTIC = 'DIAGNOSTIC',
}

export enum AppointmentPriority {
  LOW = 'LOW',
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

@Entity('appointments')
@Index(['appointmentDate', 'doctorId'])
@Index(['patientId', 'appointmentDate'])
@Index(['hospitalId', 'status'])
export class Appointment extends BaseEntity {
  @Column({ type: 'varchar', length: 50, unique: true })
  appointmentNumber: string;

  @Column({ type: 'timestamp' })
  appointmentDate: Date;

  @Column({ type: 'int' })
  duration: number; // Durée en minutes

  @Column({
    type: 'enum',
    enum: AppointmentType,
    default: AppointmentType.CONSULTATION,
  })
  type: AppointmentType;

  @Column({
    type: 'enum',
    enum: AppointmentStatus,
    default: AppointmentStatus.SCHEDULED,
  })
  status: AppointmentStatus;

  @Column({
    type: 'enum',
    enum: AppointmentPriority,
    default: AppointmentPriority.NORMAL,
  })
  priority: AppointmentPriority;

  @Column({ type: 'text', nullable: true })
  reason: string; // Motif du rendez-vous

  @Column({ type: 'text', nullable: true })
  notes: string; // Notes de la secrétaire

  @Column({ type: 'text', nullable: true })
  doctorNotes: string; // Notes du médecin

  @Column({ type: 'varchar', length: 100, nullable: true })
  room: string; // Salle de consultation

  @Column({ type: 'boolean', default: false })
  isRecurring: boolean;

  @Column({ type: 'json', nullable: true })
  recurringPattern: {
    frequency: 'daily' | 'weekly' | 'monthly';
    interval: number;
    endDate?: Date;
    daysOfWeek?: number[]; // Pour les rendez-vous hebdomadaires
  };

  @Column({ type: 'boolean', default: false })
  reminderSent: boolean;

  @Column({ type: 'timestamp', nullable: true })
  reminderSentAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  checkedInAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  startedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  completedAt: Date;

  @Column({ type: 'text', nullable: true })
  cancellationReason: string;

  @Column({ type: 'timestamp', nullable: true })
  cancelledAt: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  estimatedCost: number;

  @Column({ type: 'boolean', default: false })
  isTelemedicine: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  telemedicineLink: string;

  // Relations
  @Column({ type: 'uuid' })
  patientId: string;

  @ManyToOne(() => Patient, patient => patient.appointments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'patientId' })
  patient: Patient;

  @Column({ type: 'uuid' })
  doctorId: string;

  @ManyToOne(() => User, user => user.appointmentsAsDoctor, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'doctorId' })
  doctor: User;

  @Column({ type: 'uuid' })
  hospitalId: string;

  @ManyToOne(() => Hospital, hospital => hospital.appointments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'hospitalId' })
  hospital: Hospital;

  @Column({ type: 'uuid', nullable: true })
  createdById: string;

  @ManyToOne(() => User, user => user.appointmentsCreated, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'createdById' })
  createdBy: User;

  // Propriétés calculées
  get endTime(): Date {
    const endTime = new Date(this.appointmentDate);
    endTime.setMinutes(endTime.getMinutes() + this.duration);
    return endTime;
  }

  get isToday(): boolean {
    const today = new Date();
    const appointmentDate = new Date(this.appointmentDate);
    return (
      today.getDate() === appointmentDate.getDate() &&
      today.getMonth() === appointmentDate.getMonth() &&
      today.getFullYear() === appointmentDate.getFullYear()
    );
  }

  get isPast(): boolean {
    return new Date() > this.appointmentDate;
  }

  get isFuture(): boolean {
    return new Date() < this.appointmentDate;
  }

  get canBeCheckedIn(): boolean {
    const now = new Date();
    const appointmentTime = new Date(this.appointmentDate);
    const timeDiff = appointmentTime.getTime() - now.getTime();
    const minutesDiff = timeDiff / (1000 * 60);

    return (
      this.status === AppointmentStatus.CONFIRMED &&
      minutesDiff <= 30 && // Peut s'enregistrer 30 minutes avant
      minutesDiff >= -15 // Jusqu'à 15 minutes après l'heure prévue
    );
  }

  get displayStatus(): string {
    const statusMap = {
      [AppointmentStatus.SCHEDULED]: 'Programmé',
      [AppointmentStatus.CONFIRMED]: 'Confirmé',
      [AppointmentStatus.IN_PROGRESS]: 'En cours',
      [AppointmentStatus.COMPLETED]: 'Terminé',
      [AppointmentStatus.CANCELLED]: 'Annulé',
      [AppointmentStatus.NO_SHOW]: 'Absent',
      [AppointmentStatus.RESCHEDULED]: 'Reprogrammé',
    };
    return statusMap[this.status] || this.status;
  }
}
