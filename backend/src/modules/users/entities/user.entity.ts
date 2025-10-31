import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { Listing } from '../../listings/entities/listing.entity';
import { Lead } from '../../leads/entities/lead.entity';
import { Booking } from '../../bookings/entities/booking.entity';
import { Payment } from '../../payments/entities/payment.entity';

export enum UserRole {
  ADMIN = 'admin',
  AGENT = 'agent',
  CUSTOMER = 'customer',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 255, unique: true })
  @Index()
  email: string;

  @Column({ length: 255 })
  password_hash: string;

  @Column({
    type: 'enum',
    enum: UserRole,
  })
  @Index()
  role: UserRole;

  @Column({ length: 20, nullable: true })
  phone: string;

  @Column('text', { nullable: true })
  avatar_url: string;

  @Column({ default: false })
  is_verified: boolean;

  @Column({ default: true })
  is_active: boolean;

  @Column('timestamp', { nullable: true })
  last_login: Date;

  @OneToMany(() => Listing, (listing) => listing.createdBy)
  createdListings: Listing[];

  @OneToMany(() => Listing, (listing) => listing.assignedAgent)
  assignedListings: Listing[];

  @OneToMany(() => Lead, (lead) => lead.assigned_to)
  assignedLeads: Lead[];

  @OneToMany(() => Booking, (booking) => booking.user)
  bookings: Booking[];

  @OneToMany(() => Payment, (payment) => payment.user)
  payments: Payment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}