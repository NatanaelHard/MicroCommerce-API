import amqp from 'amqplib';
import dotenv from 'dotenv';

dotenv.config();

const run = async () => {
  const conn = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
  const ch = await conn.createChannel();
  const exchange = 'events';
  await ch.assertExchange(exchange, 'topic', { durable: true });
  const q = await ch.assertQueue('payment_worker', { durable: true });
  await ch.bindQueue(q.queue, exchange, 'order.created');

  console.log('Payment worker waiting for order.created...');
  ch.consume(q.queue, async (msg) => {
    if (!msg) return;
    const order = JSON.parse(msg.content.toString());
    console.log('Received order:', order);

    // Simula processamento de pagamento
    const payment = { paymentId: `pmt-${Date.now()}`, orderId: order.orderId, status: 'COMPLETED' };

    // Publica PaymentCompleted
    ch.publish(exchange, 'payment.completed', Buffer.from(JSON.stringify(payment)));
    ch.ack(msg);
  });
};

run().catch(console.error);
