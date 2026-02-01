import Fastify from 'fastify';
import routes from './routes';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();
const prisma = new PrismaClient();
const server = Fastify({ logger: true });

server.decorate('prisma', prisma as any);
server.register(routes, { prefix: '/products' });

const start = async () => {
  try {
    await server.listen({ port: process.env.PORT ? Number(process.env.PORT) : 3001, host: '0.0.0.0' });
    server.log.info(`Catalog service listening on ${process.env.PORT || 3001}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
