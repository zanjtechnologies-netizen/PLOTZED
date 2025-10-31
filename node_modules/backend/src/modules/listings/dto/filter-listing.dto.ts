import { IsOptional, IsString, IsNumber, IsEnum, IsBoolean } from 'class-validator'
import { Type } from 'class-transformer'
import { ListingType, ListingStatus } from '../entities/listing.entity'

export class FilterListingDto {
  @IsOptional()
  @IsString()
  search?: string

  @IsOptional()
  @IsEnum(ListingType)
  type?: ListingType

  @IsOptional()
  @IsEnum(ListingStatus)
  status?: ListingStatus

  @IsOptional()
  @IsString()
  city?: string

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  minPrice?: number

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  maxPrice?: number

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  minArea?: number

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  maxArea?: number

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  bedrooms?: number

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  bathrooms?: number

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isFeatured?: boolean

  @IsOptional()
  @IsString({ each: true })
  amenities?: string[]

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number = 1

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit?: number = 10

  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt'

  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC' = 'DESC'
}
