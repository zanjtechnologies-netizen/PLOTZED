import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Index,
} from 'typeorm'
import { User } from '../../users/entities/user.entity'
import { Booking } from '../../bookings/entities/booking.entity'
import { Listing } from '../../listings/entities/listing.entity'
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

export enum PaymentType {
  BOOKING = 'booking',
  TOKEN = 'token',
  INSTALLMENT = 'installment',
  FULL = 'full',
}

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => Booking, { nullable: true })
  @Index()
  booking: Booking

  @ManyToOne(() => Listing, { nullable: true })
  listing: Listing

  @ManyToOne(() => User, { nullable: true })
  user: User

  @Column('decimal', { precision: 15, scale: 2 })
  amount: number

  @Column()
  status: string

  @Column({ length: 10, default: 'INR' })
  currency: string

  @Column({
    type: 'enum',
    enum: PaymentType,
  })
  paymentType: PaymentType

  @Column({ length: 255, unique: true, nullable: true })
  @Index()
  razorpayOrderId: string

  @Column({ length: 255, unique: true, nullable: true })
  @Index()
  razorpayPaymentId: string

  @Column({ length: 500, nullable: true })
  razorpaySignature: string

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  @Index()
  status: PaymentStatus

  @Column({ length: 50, nullable: true })
  paymentMethod: string

  @Column('text', { nullable: true })
  description: string

  @Column({ length: 100, unique: true, nullable: true })
  invoiceNumber: string

  @Column('text', { nullable: true })
  receiptUrl: string

  @Column('decimal', { precision: 15, scale: 2, nullable: true })
  refundAmount: number

  @Column('text', { nullable: true })
  refundReason: string

  @Column('timestamp', { nullable: true })
  refundedAt: Date

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @Column('timestamp', { nullable: true })
  completedAt: Date
}