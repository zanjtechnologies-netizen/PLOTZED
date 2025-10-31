import { IsString, IsEnum, IsOptional, IsDateString, IsNumber, Min, Max } from 'class-validator';
import { BookingType } from '../entities/booking.entity';

export class CreateBookingDto {
  @IsString()
  @IsOptional()
  leadId?: string;

  @IsString()
  listingId: string;

  @IsString()
  @IsOptional()
  userId?: string;

  @IsDateString()
  booking_date: string;

  @IsString()
  @IsOptional()
  booking_time?: string;

  @IsEnum(BookingType)
  @IsOptional()
  booking_type?: BookingType;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(10)
  attendees?: number;
}