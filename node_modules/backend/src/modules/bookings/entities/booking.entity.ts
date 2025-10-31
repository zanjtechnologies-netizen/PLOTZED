import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Index,
} from 'typeorm';
import { Lead } from '../../leads/entities/lead.entity';
import { Listing } from '../../listings/entities/listing.entity';
import { User } from '../../users/entities/user.entity';

export enum BookingType {
  SITE_VISIT = 'site_visit',
  CONSULTATION = 'consultation',
  DOCUMENTATION = 'documentation',
}

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  RESCHEDULED = 'rescheduled',
}

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Lead, { nullable: true })
  lead: Lead;

  @ManyToOne(() => Listing, { nullable: false })
  @Index()
  listing: Listing;

  @ManyToOne(() => User, { nullable: true })
  @Index()
  user: User;

  @Column('date')
  @Index()
  booking_date: Date;

  @Column('time', { nullable: true })
  booking_time: string;

  @Column({
    type: 'enum',
    enum: BookingType,
    default: BookingType.SITE_VISIT,
  })
  booking_type: BookingType;

  @Column({
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.PENDING,
  })
  @Index()
  status: BookingStatus;

  @Column('text', { nullable: true })
  notes: string;

  @Column('int', { default: 1 })
  attendees: number;

  @Column('timestamp', { nullable: true })
  cancelled_at: Date;

  @Column('text', { nullable: true })
  cancellation_reason: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}