import { Module } from '@nestjs/common';
import { CheckoutsModule } from './checkouts/checkouts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Checkout,
  CheckoutItem,
  CheckoutProduct,
} from './checkouts/entities/checkout.entity';
import { RabbitmqModule } from './rabbitmq/rabbitmq.module';
import { PaymentsModule } from './payments/payments.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3307,
      username: 'root',
      password: 'root',
      database: 'nest',
      entities: [Checkout, CheckoutProduct, CheckoutItem],
      synchronize: true,
      logging: true,
    }),
    CheckoutsModule,
    RabbitmqModule,
    PaymentsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
