import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Index,
} from 'typeorm';
import { Listing } from '../../listings/entities/listing.entity';
import { User } from '../../users/entities/user.entity';

export enum LeadStatus {
  NEW = 'new',
  CONTACTED = 'contacted',
  QUALIFIED = 'qualified',
  NEGOTIATION = 'negotiation',
  CONVERTED = 'converted',
  LOST = 'lost',
}

export enum LeadPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

@Entity('leads')
export class Lead {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Listing, { nullable: true })
  @Index()
  listing: Listing;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 255 })
  email: string;

  @Column({ length: 20 })
  phone: string;

  @Column('text', { nullable: true })
  message: string;

  @Column({ length: 100, default: 'website' })
  source: string;

  @Column({ length: 100, nullable: true })
  utm_source: string;

  @Column({ length: 100, nullable: true })
  utm_medium: string;

  @Column({ length: 100, nullable: true })
  utm_campaign: string;

  @Column({
    type: 'enum',
    enum: LeadStatus,
    default: LeadStatus.NEW,
  })
  @Index()
  status: LeadStatus;

  @Column({
    type: 'enum',
    enum: LeadPriority,
    default: LeadPriority.MEDIUM,
  })
  priority: LeadPriority;

  @ManyToOne(() => User, (user) => user.assignedLeads, { nullable: true })
  @Index()
  assigned_to: User;

  @Column('timestamp', { nullable: true })
  last_contacted_at: Date;

  @Column('timestamp', { nullable: true })
  next_follow_up: Date;

  @CreateDateColumn()
  @Index()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}