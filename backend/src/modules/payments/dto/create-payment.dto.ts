import { IsNumber, IsEnum, IsString, IsOptional, IsUUID, Min } from 'class-validator'
import { PaymentType } from '../entities/payment.entity'

export class CreatePaymentDto {
  @IsNumber()
  @Min(1)
  amount: number

  @IsEnum(PaymentType)
  paymentType: PaymentType

  @IsUUID()
  @IsOptional()
  bookingId?: string

  @IsUUID()
  @IsOptional()
  listingId?: string

  @IsString()
  @IsOptional()
  description?: string

  @IsString()
  @IsOptional()
  currency?: string = 'INR'
}

export class VerifyPaymentDto {
  @IsString()
  razorpayOrderId: string

  @IsString()
  razorpayPaymentId: string

  @IsString()
  razorpaySignature: string
}