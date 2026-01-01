import createError from '@fastify/error';

export const BadRequestError = createError(
  'BAD_REQUEST',
  'Invalid request: ',
  400
);
