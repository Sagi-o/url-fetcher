import { FastifyInstance } from 'fastify';
import { urlService } from './url.service';
import { validateDTO } from '../../utils/dto-validation';
import { FetchUrlsDTO } from './url.dto';
import { BadRequestError } from '../../utils/http-errors';
import { HttpResponse, UrlServiceEvents, UrlListQueryParams } from '@org/shared';
import { createSSEConnection } from '../../utils/sse';
import { validatePaginationParams } from '../../utils/pagination';

export const urlController = (app: FastifyInstance) => {
  app.get<{ Querystring: UrlListQueryParams }>('/list', async (req, reply) => {
    const { sortBy, order, page, limit } = req.query;

    // Validate and build pagination params (defaults to page=1, limit=10 if not provided)
    const paginationParams = validatePaginationParams(page, limit);

    const data = urlService.getUrlList(sortBy, order, paginationParams);
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

  app.get('/events', async (req, reply) => {
    const { sendEvent, onClose } = createSSEConnection(req, reply);

    urlService.on(UrlServiceEvents.URL_UPDATED, sendEvent);

    onClose(() => {
      urlService.off(UrlServiceEvents.URL_UPDATED, sendEvent);
    });
  });
};
