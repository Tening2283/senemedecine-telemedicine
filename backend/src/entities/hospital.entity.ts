import {
  Entity,
  Column,
  OneToMany,
  Index,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { Patient } from './patient.entity';
import { Consultation } from './consultation.entity';
import { Appointment } from './appointment.entity';

export enum HospitalStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  MAINTENANCE = 'MAINTENANCE',
}

@Entity('hospitals')
@Index(['code'], { unique: true })
@Index(['isActive'])
export class Hospital extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  code: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  website: string;

  @Column({ type: 'varchar', length: 100 })
  databaseName: string;

  @Column({
    type: 'enum',
    enum: HospitalStatus,
    default: HospitalStatus.ACTIVE,
  })
  status: HospitalStatus;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  logo: string;

  @Column({ type: 'json', nullable: true })
  settings: Record<string, any>;

  @Column({ type: 'json', nullable: true })
  coordinates: {
    latitude: number;
    longitude: number;
  };

  @Column({ type: 'varchar', length: 100, nullable: true })
  director: string;

  @Column({ type: 'int', default: 0 })
  bedCount: number;

  @Column({ type: 'json', nullable: true })
  departments: string[];

  @Column({ type: 'json', nullable: true })
  services: string[];

  @Column({ type: 'varchar', length: 50, nullable: true })
  licenseNumber: string;

  @Column({ type: 'date', nullable: true })
  establishedDate: Date;

  // Relations
  @OneToMany(() => User, (user) => user.hospital)
  users: User[];

  @OneToMany(() => Patient, (patient) => patient.hospital)
  patients: Patient[];

  @OneToMany(() => Consultation, (consultation) => consultation.hospital)
  consultations: Consultation[];

  @OneToMany(() => Appointment, (appointment) => appointment.hospital)
  appointments: Appointment[];

  // Propriétés calculées
  get isOperational(): boolean {
    return this.isActive && this.status === HospitalStatus.ACTIVE;
  }

  get displayName(): string {
    return `${this.name} (${this.code})`;
  }
}

