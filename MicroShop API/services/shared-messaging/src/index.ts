import amqp from 'amqplib';

export async function connect(rabbitUrl: string) {
  const conn = await amqp.connect(rabbitUrl);
  const ch = await conn.createChannel();
  return { conn, ch };
}

export async function publish(ch: amqp.Channel, exchange: string, routingKey: string, payload: any) {
  await ch.assertExchange(exchange, 'topic', { durable: true });
  ch.publish(exchange, routingKey, Buffer.from(JSON.stringify(payload)));
}

export async function consume(ch: amqp.Channel, exchange: string, bindingKey: string, onMessage: (msg: any) => void) {
  await ch.assertExchange(exchange, 'topic', { durable: true });
  const q = await ch.assertQueue('', { exclusive: true });
  await ch.bindQueue(q.queue, exchange, bindingKey);
  ch.consume(q.queue, (msg) => {
    if (!msg) return;
    onMessage(JSON.parse(msg.content.toString()));
    ch.ack(msg);
  });
}
