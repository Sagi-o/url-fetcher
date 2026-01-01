import { FastifyInstance } from 'fastify';
import { urlService } from './url.service';
import { validateDTO } from '../../utils/dto-validation';
import { FetchUrlsDTO } from './url.dto';
import { BadRequestError } from '../../utils/http-errors';
import { HttpResponse } from '@org/shared';

export const urlController = (app: FastifyInstance) => {
  app.get('/list', async (_req, reply) => {
    const data = urlService.getUrlList();
    const response: HttpResponse<typeof data> = {
      success: true,
      data,
    };
    reply.send(response);
  });

  app.get<{ Querystring: { url?: string } }>('/content', async (req, reply) => {
    const { url } = req.query;
    if (!url) throw new BadRequestError("'url' query param is missing");

    const data = urlService.getUrlContent(url);
    const response: HttpResponse<typeof data> = {
      success: true,
      data,
    };
    reply.send(response);
  });

  app.post('/fetch', async (req, reply) => {
    const body = await validateDTO(FetchUrlsDTO, req.body);

    try {
      const data = await urlService.fetchUrls(body.urls);
      const response: HttpResponse<typeof data> = {
        success: true,
        data,
      };
      reply.send(response);
    } catch {
      reply.send({
        success: false,
        message: 'Error with fetching provided url',
      });
    }
  });
};
