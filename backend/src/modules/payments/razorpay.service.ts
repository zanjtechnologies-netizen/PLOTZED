import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import Razorpay from 'razorpay'
import * as crypto from 'crypto'

@Injectable()
export class RazorpayService {
  private razorpay: any

  constructor(private configService: ConfigService) {
    this.razorpay = new Razorpay({
      key_id: this.configService.get<string>('RAZORPAY_KEY_ID'),
      key_secret: this.configService.get<string>('RAZORPAY_KEY_SECRET'),
    })
  }

  async createOrder(amount: number, currency: string = 'INR', receipt: string, notes?: any) {
    try {
      const options = {
        amount: Math.round(amount * 100), // Convert to paise
        currency,
        receipt,
        notes: notes || {},
      }

      const order = await this.razorpay.orders.create(options)
      return order
    } catch (error) {
      throw new InternalServerErrorException('Failed to create Razorpay order')
    }
  }

  verifyPaymentSignature(orderId: string, paymentId: string, signature: string): boolean {
    try {
      const text = `${orderId}|${paymentId}`
      const secret = this.configService.get<string>('RAZORPAY_KEY_SECRET')
      if (!secret) {
        throw new Error('RAZORPAY_KEY_SECRET is not defined')
      }
      const generatedSignature = crypto
        .createHmac('sha256', secret)
        .update(text)
        .digest('hex')

      return generatedSignature === signature
    } catch (error) {
      return false
    }
  }

  async getPaymentDetails(paymentId: string) {
    try {
      return await this.razorpay.payments.fetch(paymentId)
    } catch (error) {
      throw new BadRequestException('Failed to fetch payment details')
    }
  }

  async capturePayment(paymentId: string, amount: number, currency: string = 'INR') {
    try {
      return await this.razorpay.payments.capture(paymentId, Math.round(amount * 100), currency)
    } catch (error) {
      throw new BadRequestException('Failed to capture payment')
    }
  }

  async refundPayment(paymentId: string, amount?: number, notes?: any) {
    try {
      const refundOptions: any = {
        payment_id: paymentId,
      }

      if (amount) {
        refundOptions.amount = Math.round(amount * 100)
      }

      if (notes) {
        refundOptions.notes = notes
      }

      return await this.razorpay.refunds.create(refundOptions)
    } catch (error) {
      throw new BadRequestException('Failed to process refund')
    }
  }

  async getRefundDetails(refundId: string) {
    try {
      return await this.razorpay.refunds.fetch(refundId)
    } catch (error) {
      throw new BadRequestException('Failed to fetch refund details')
    }
  }
}
