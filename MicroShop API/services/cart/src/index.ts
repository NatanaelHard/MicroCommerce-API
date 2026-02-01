import Fastify from 'fastify';
import routes from './routes';
import dotenv from 'dotenv';

dotenv.config();
const server = Fastify({ logger: true });
server.register(routes, { prefix: '/cart' });

const start = async () => {
  try {
    await server.listen({ port: process.env.PORT ? Number(process.env.PORT) : 3002, host: '0.0.0.0' });
    server.log.info(`Cart service listening on ${process.env.PORT || 3002}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
