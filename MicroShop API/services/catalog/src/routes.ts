import { FastifyPluginAsync } from 'fastify';

const routes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/', async (request, reply) => {
    const products = await (fastify as any).prisma.product.findMany();
    return products;
  });

  fastify.get('/:id', async (request, reply) => {
    const { id } = request.params as any;
    const product = await (fastify as any).prisma.product.findUnique({ where: { id: Number(id) } });
    if (!product) return reply.status(404).send({ error: 'Not found' });
    return product;
  });

  fastify.post('/', async (request, reply) => {
    const body = request.body as any;
    const product = await (fastify as any).prisma.product.create({ data: body });
    return reply.status(201).send(product);
  });
};

export default routes;
