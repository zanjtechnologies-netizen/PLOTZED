import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, Index } from 'typeorm'
import { Listing } from './listing.entity'

export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
  FLOOR_PLAN = 'floor_plan',
  TOUR_360 = '360_tour',
  BROCHURE = 'brochure',
}

@Entity('listing_media')
export class ListingMedia {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => Listing, (listing) => listing.media, { onDelete: 'CASCADE' })
  @Index()
  listing: Listing

  @Column('text')
  url: string

  @Column({
    type: 'enum',
    enum: MediaType,
  })
  @Index()
  type: MediaType

  @Column({ length: 255, nullable: true })
  title: string

  @Column('int', { default: 0 })
  displayOrder: number

  @Column({ default: false })
  isPrimary: boolean

  @CreateDateColumn()
  createdAt: Date
}