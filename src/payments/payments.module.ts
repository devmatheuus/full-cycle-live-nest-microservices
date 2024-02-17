import { Module } from '@nestjs/common';
import { PaymentsConsumer } from './payments.consumer';

@Module({
  providers: [PaymentsConsumer],
})
export class PaymentsModule {}
