import { FastifyReply, FastifyRequest } from 'fastify';

export const createSSEConnection = (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  reply.raw.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': request.headers.origin || '*',
    'Access-Control-Allow-Credentials': 'true',
  });

  const sendEvent = <T>(data: T) => {
    reply.raw.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  const onClose = (callback: () => void) => {
    request.raw.on('close', callback);
  };

  return { sendEvent, onClose };
};
