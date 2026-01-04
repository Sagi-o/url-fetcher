import { FastifyInstance } from 'fastify';
import { urlController } from './url/url.controller';

export default async function (fastify: FastifyInstance) {
  // Health check endpoint
  fastify.get('/api/health', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  });

  fastify.register(urlController, { prefix: '/api/url' });
}
