import { Controller, Get, Post, Body, Param, Query, UseGuards, Request } from '@nestjs/common'
import { PaymentsService } from './payments.service'
import { CreatePaymentDto, VerifyPaymentDto } from './dto/create-payment.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles } from '../auth/decorators/roles.decorator'
import { Role } from '../auth/enums/role.enum'
import { PaymentStatus } from './entities/payment.entity'

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-order')
  @UseGuards(JwtAuthGuard)
  createOrder(@Body() createPaymentDto: CreatePaymentDto, @Request() req) {
    return this.paymentsService.createPaymentOrder(createPaymentDto, req.user.id)
  }

  @Post('verify')
  @UseGuards(JwtAuthGuard)
  verifyPayment(@Body() verifyPaymentDto: VerifyPaymentDto, @Request() req) {
    return this.paymentsService.verifyPayment(verifyPaymentDto, req.user.id)
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Request() req, @Query('status') status?: PaymentStatus) {
    const userId = req.user.role === 'customer' ? req.user.id : undefined
    return this.paymentsService.findAll(userId, status)
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.paymentsService.findOne(id)
  }

  @Post(':id/refund')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  refund(
    @Param('id') id: string,
    @Body('amount') amount?: number,
    @Body('reason') reason?: string
  ) {
    return this.paymentsService.initiateRefund(id, amount, reason)
  }
}
