import { FastifyPluginAsync } from 'fastify';
import Redis from 'ioredis';

const routes: FastifyPluginAsync = async (fastify) => {
  const redis = new Redis(process.env.REDIS_URL);

  fastify.get('/:userId', async (request, reply) => {
    const { userId } = request.params as any;
    const data = await redis.get(`cart:${userId}`);
    return data ? JSON.parse(data) : { items: [] };
  });

  fastify.post('/:userId/items', async (request, reply) => {
    const { userId } = request.params as any;
    const body = request.body as any; // { productId, qty }
    const key = `cart:${userId}`;
    const current = await redis.get(key);
    const cart = current ? JSON.parse(current) : { items: [] };
    cart.items.push(body);
    await redis.set(key, JSON.stringify(cart));
    return reply.status(201).send(cart);
  });

  fastify.delete('/:userId/items/:index', async (request, reply) => {
    const { userId, index } = request.params as any;
    const key = `cart:${userId}`;
    const current = await redis.get(key);
    if (!current) return reply.status(404).send({ error: 'Cart not found' });
    const cart = JSON.parse(current);
    cart.items.splice(Number(index), 1);
    await redis.set(key, JSON.stringify(cart));
    return cart;
  });
};

export default routes;
