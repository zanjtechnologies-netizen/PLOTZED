import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { Payment } from './entities/payment.entity';
import { RazorpayService } from '../razorpay/razorpay.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import payments from 'razorpay/dist/types/payments';

@Module({
  imports: [TypeOrmModule.forFeature([payments])],
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [RazorpayService],
})
export class PaymentsModule {}
