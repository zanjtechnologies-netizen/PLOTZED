import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm'

@Entity('amenities')
export class Amenity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ length: 255, unique: true })
  name: string

  @Column({ length: 100, nullable: true })
  icon: string

  @Column({ length: 100, nullable: true })
  category: string

  @CreateDateColumn()
  createdAt: Date
}