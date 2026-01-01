import { FastifyInstance } from 'fastify';
import { urlController } from './url/url.controller';

export default async function (fastify: FastifyInstance) {
  fastify.register(urlController, { prefix: '/api/url' });
}
