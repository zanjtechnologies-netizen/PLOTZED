import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
  Index,
} from 'typeorm'
import { User } from '../../users/entities/user.entity'
import { ListingMedia } from './listing-media.entity'
import { Amenity } from './amenity.entity'
import { Lead } from '../../leads/entities/lead.entity'
import { Booking } from '../../bookings/entities/booking.entity'

export enum ListingType {
  PLOT = 'plot',
  VILLA = 'villa',
  APARTMENT = 'apartment',
  COMMERCIAL = 'commercial',
  FARMHOUSE = 'farmhouse',
}

export enum ListingStatus {
  AVAILABLE = 'available',
  SOLD = 'sold',
  RESERVED = 'reserved',
  UNDER_CONSTRUCTION = 'under_construction',
}

@Entity('listings')
@Index(['latitude', 'longitude'])
export class Listing {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ length: 500 })
  @Index()
  title: string

  @Column({ length: 500, unique: true })
  @Index()
  slug: string

  @Column('text', { nullable: true })
  description: string

  @Column('decimal', { precision: 15, scale: 2 })
  @Index()
  price: number

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  pricePerSqft: number

  @Column('decimal', { precision: 10, scale: 2 })
  area: number

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  plotSize: number

  @Column({
    type: 'enum',
    enum: ListingType,
  })
  @Index()
  type: ListingType

  @Column({
    type: 'enum',
    enum: ListingStatus,
    default: ListingStatus.AVAILABLE,
  })
  @Index()
  status: ListingStatus

  // Location
  @Column('text')
  address: string

  @Column({ length: 100 })
  @Index()
  city: string

  @Column({ length: 100 })
  state: string

  @Column({ length: 10, nullable: true })
  pincode: string

  @Column('decimal', { precision: 10, scale: 8, nullable: true })
  latitude: number

  @Column('decimal', { precision: 11, scale: 8, nullable: true })
  longitude: number

  // Property details
  @Column('int', { nullable: true })
  bedrooms: number

  @Column('int', { nullable: true })
  bathrooms: number

  @Column('int', { nullable: true })
  floors: number

  @Column({ length: 50, nullable: true })
  facing: string

  @Column('int', { nullable: true })
  yearBuilt: number

  @Column({ length: 100, nullable: true })
  reraNumber: string

  // SEO
  @Column({ length: 255, nullable: true })
  metaTitle: string

  @Column('text', { nullable: true })
  metaDescription: string

  // Flags
  @Column({ default: false })
  @Index()
  isFeatured: boolean

  @Column({ default: true })
  isPublished: boolean

  // Relations
  @ManyToOne(() => User, { nullable: true })
  createdBy: User

  @ManyToOne(() => User, { nullable: true })
  assignedAgent: User

  @OneToMany(() => ListingMedia, (media) => media.listing, { cascade: true })
  media: ListingMedia[]

  @ManyToMany(() => Amenity)
  @JoinTable({
    name: 'listing_amenities',
    joinColumn: { name: 'listing_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'amenity_id', referencedColumnName: 'id' },
  })
  amenities: Amenity[]

  @OneToMany(() => Lead, (lead) => lead.listing)
  leads: Lead[]

  @OneToMany(() => Booking, (booking) => booking.listing)
  bookings: Booking[]

  // Timestamps
  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @Column('timestamp', { nullable: true })
  publishedAt: Date
}