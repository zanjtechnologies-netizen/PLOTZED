import { IsString, IsEmail, IsEnum, IsOptional, MinLength, Matches } from 'class-validator';
import { LeadPriority } from '../entities/lead.entity';

export class CreateLeadDto {
  @IsString()
  @IsOptional()
  listingId?: string;

  @IsString()
  @MinLength(2)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @Matches(/^[6-9]\d{9}$/, { message: 'Invalid Indian phone number' })
  phone: string;

  @IsString()
  @IsOptional()
  message?: string;

  @IsString()
  @IsOptional()
  source?: string;

  @IsString()
  @IsOptional()
  utm_source?: string;

  @IsString()
  @IsOptional()
  utm_medium?: string;

  @IsString()
  @IsOptional()
  utm_campaign?: string;

  @IsEnum(LeadPriority)
  @IsOptional()
  priority?: LeadPriority;

  @IsString()
  @IsOptional()
  recaptchaToken?: string;
}