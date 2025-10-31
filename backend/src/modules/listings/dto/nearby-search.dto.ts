import { IsLatitude, IsLongitude, IsNumber, IsOptional } from 'class-validator'
import { Type } from 'class-transformer'

export class NearbySearchDto {
  @IsLatitude()
  @Type(() => Number)
  latitude: number

  @IsLongitude()
  @Type(() => Number)
  longitude: number

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  radius?: number = 10 // Default 10km

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  limit?: number = 20
}