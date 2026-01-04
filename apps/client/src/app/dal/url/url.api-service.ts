import { api } from '../api';
import {
  HttpResponse,
  UrlRecord,
  UrlListQueryParams,
  PaginatedResponse,
} from '@org/shared';
import { buildSortQueryString } from '../../utils/query-params';

const controllerPath = '/url';

export const urlApiService = {
  getList: async (params?: UrlListQueryParams) => {
    const queryString = buildSortQueryString(params);
    const url = queryString
      ? `${controllerPath}/list?${queryString}`
      : `${controllerPath}/list`;

    const { data } = await api.get<HttpResponse<PaginatedResponse<UrlRecord>>>(
      url
    );
    return data;
  },

  getContent: async (url: string) => {
    const { data } = await api.get<HttpResponse<UrlRecord>>(
      `${controllerPath}/content?url=${url}`
    );
    return data;
  },

  fetchUrls: async (urls: string[], fetchCss?: boolean) => {
    const { data } = await api.post<
      HttpResponse<UrlRecord[]>
    >(`${controllerPath}/fetch`, { urls, fetchCss });
    return data;
  },
};
