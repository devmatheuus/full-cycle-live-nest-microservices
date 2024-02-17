import { Nack, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PaymentsConsumer {
  @RabbitSubscribe({
    exchange: 'amq.direct',
    routingKey: 'checkout.created',
    queue: 'microservice-payment',
  })
  async consume(msg: { checkout_id: number; total: number }) {
    try {
      console.log(
        `Payment Service: processing payment for checkout ${msg.checkout_id}`,
      );

      throw new Error('Payment failed');
    } catch (e) {
      return new Nack();
    }
  }
}
