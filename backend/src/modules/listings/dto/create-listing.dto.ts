import { IsString, IsNumber, IsEnum, IsOptional, IsBoolean, IsArray, IsLatitude, IsLongitude, Min, Max } from 'class-validator'
import { Type } from 'class-transformer'
import { ListingType, ListingStatus } from '../entities/listing.entity'

export class CreateListingDto {
  @IsString()
  title: string

  @IsString()
  @IsOptional()
  description?: string

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  price: number

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  area: number

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  plotSize?: number

  @IsEnum(ListingType)
  type: ListingType

  @IsEnum(ListingStatus)
  @IsOptional()
  status?: ListingStatus

  @IsString()
  address: string

  @IsString()
  city: string

  @IsString()
  state: string

  @IsString()
  @IsOptional()
  pincode?: string

  @IsLatitude()
  @IsOptional()
  @Type(() => Number)
  latitude?: number

  @IsLongitude()
  @IsOptional()
  @Type(() => Number)
  longitude?: number

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  bedrooms?: number

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  bathrooms?: number

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  floors?: number

  @IsString()
  @IsOptional()
  facing?: string

  @IsNumber()
  @IsOptional()
  @Min(1900)
  @Max(new Date().getFullYear())
  @Type(() => Number)
  yearBuilt?: number

  @IsString()
  @IsOptional()
  reraNumber?: string

  @IsString()
  @IsOptional()
  metaTitle?: string

  @IsString()
  @IsOptional()
  metaDescription?: string

  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean

  @IsBoolean()
  @IsOptional()
  isPublished?: boolean

  @IsArray()
  @IsOptional()
  amenityIds?: string[]

  @IsString()
  @IsOptional()
  assignedAgentId?: string
}