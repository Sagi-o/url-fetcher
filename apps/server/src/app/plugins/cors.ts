import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import fastifyCors from '@fastify/cors';

export const APP_URL_DEV = 'http://localhost:4200';

const ALLOWED_ORIGINS = [APP_URL_DEV];

export default fp(async function (fastify: FastifyInstance) {
  fastify.register(fastifyCors, {
    origin: ALLOWED_ORIGINS,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    exposedHeaders: ['Content-Type', 'Cache-Control', 'X-Accel-Buffering'],
  });
});
