import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Payment, PaymentStatus } from './entities/payment.entity'
import { RazorpayService } from './razorpay.service'
import { CreatePaymentDto, VerifyPaymentDto } from './dto/create-payment.dto'

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentsRepository: Repository<Payment>,
    private razorpayService: RazorpayService,
  ) {}

  async createPaymentOrder(createPaymentDto: CreatePaymentDto, userId: string) {
    // Generate receipt number
    const receipt = `receipt_${Date.now()}_${userId.substring(0, 8)}`

    // Create Razorpay order
    const razorpayOrder = await this.razorpayService.createOrder(
      createPaymentDto.amount,
      createPaymentDto.currency,
      receipt,
      {
        userId,
        bookingId: createPaymentDto.bookingId,
        listingId: createPaymentDto.listingId,
      }
    )

    // Save payment record
    const payment = this.paymentsRepository.create({
      amount: createPaymentDto.amount,
      currency: createPaymentDto.currency,
      paymentType: createPaymentDto.paymentType,
      description: createPaymentDto.description,
      razorpayOrderId: razorpayOrder.id,
      status: PaymentStatus.PENDING,
      user: { id: userId } as any,
      booking: createPaymentDto.bookingId ? ({ id: createPaymentDto.bookingId } as any) : null,
      listing: createPaymentDto.listingId ? ({ id: createPaymentDto.listingId } as any) : null,
    })

    const savedPayment = await this.paymentsRepository.save(payment)

    return {
      paymentId: savedPayment.id,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      receipt: razorpayOrder.receipt,
    }
  }

  async verifyPayment(verifyPaymentDto: VerifyPaymentDto, userId: string) {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = verifyPaymentDto

    // Find payment by order ID
    const payment = await this.paymentsRepository.findOne({
      where: { razorpayOrderId },
      relations: ['user', 'booking', 'listing'],
    })

    if (!payment) {
      throw new NotFoundException('Payment not found')
    }

    // Verify payment signature
    const isValid = this.razorpayService.verifyPaymentSignature(
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    )

    if (!isValid) {
      payment.status = PaymentStatus.FAILED
      await this.paymentsRepository.save(payment)
      throw new BadRequestException('Invalid payment signature')
    }

    // Fetch payment details from Razorpay
    const paymentDetails = await this.razorpayService.getPaymentDetails(razorpayPaymentId)

    // Update payment record
    payment.razorpayPaymentId = razorpayPaymentId
    payment.razorpaySignature = razorpaySignature
    payment.status = PaymentStatus.COMPLETED
    payment.paymentMethod = paymentDetails.method
    payment.completedAt = new Date()
    payment.invoiceNumber = `INV-${Date.now()}`

    const updatedPayment = await this.paymentsRepository.save(payment)

    // TODO: Send confirmation email
    // TODO: Update booking status

    return {
      success: true,
      payment: updatedPayment,
      message: 'Payment verified successfully',
    }
  }

  async findAll(userId?: string, status?: PaymentStatus) {
    const where: any = {}
    
    if (userId) {
      where.user = { id: userId }
    }
    
    if (status) {
      where.status = status
    }

    return await this.paymentsRepository.find({
      where,
      relations: ['user', 'booking', 'listing'],
      order: { createdAt: 'DESC' },
    })
  }

  async findOne(id: string) {
    const payment = await this.paymentsRepository.findOne({
      where: { id },
      relations: ['user', 'booking', 'listing'],
    })

    if (!payment) {
      throw new NotFoundException('Payment not found')
    }

    return payment
  }

  async initiateRefund(paymentId: string, amount?: number, reason?: string) {
    const payment = await this.findOne(paymentId)

    if (payment.status !== PaymentStatus.COMPLETED) {
      throw new BadRequestException('Only completed payments can be refunded')
    }

    const refund = await this.razorpayService.refundPayment(
      payment.razorpayPaymentId,
      amount,
      { reason }
    )

    payment.status = PaymentStatus.REFUNDED
    payment.refundAmount = amount || payment.amount
    if (reason) {
      payment.refundReason = reason
    }
    payment.refundedAt = new Date()

    return await this.paymentsRepository.save(payment)
  }
}
