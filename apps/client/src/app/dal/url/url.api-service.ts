import { api } from '../api';
import { HttpResponse, UrlRecord } from '@org/shared';

const controllerPath = '/url';

export const urlApiService = {
  getList: async () => {
    const { data } = await api.get<HttpResponse<UrlRecord[]>>(
      `${controllerPath}/list`
    );
    return data;
  },

  getContent: async (url: string) => {
    const { data } = await api.get<HttpResponse<string>>(
      `${controllerPath}/content?url=${url}`
    );
    return data;
  },

  fetchUrls: async (urls: string[]) => {
    const { data } = await api.post<HttpResponse<UrlRecord[]>>(
      `${controllerPath}/fetch`,
      { urls }
    );
    return data;
  },
};
