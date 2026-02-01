import Fastify from 'fastify';
import dotenv from 'dotenv';
import amqp from 'amqplib';

dotenv.config();
const server = Fastify({ logger: true });

server.post('/payments', async (request, reply) => {
  const body = request.body as any; // { orderId, amount, userId }
  // Simula processamento síncrono rápido
  const payment = { paymentId: `pmt-${Date.now()}`, orderId: body.orderId, status: 'COMPLETED' };

  // Publica evento PaymentCompleted
  try {
    const conn = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
    const ch = await conn.createChannel();
    const exchange = 'events';
    await ch.assertExchange(exchange, 'topic', { durable: true });
    ch.publish(exchange, 'payment.completed', Buffer.from(JSON.stringify(payment)));
    setTimeout(() => conn.close(), 500);
  } catch (err) {
    server.log.error('Failed to publish payment event', err);
  }

  return reply.status(201).send(payment);
});

const start = async () => {
  try {
    await server.listen({ port: process.env.PORT ? Number(process.env.PORT) : 3003, host: '0.0.0.0' });
    server.log.info(`Payment service listening on ${process.env.PORT || 3003}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
