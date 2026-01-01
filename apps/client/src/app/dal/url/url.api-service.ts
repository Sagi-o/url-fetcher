import { api } from '../api';
import { HttpResponse, UrlRecordBase } from '@org/shared';

const controllerPath = '/url';

export const urlApiService = {
  getList: async () => {
    const { data } = await api.get<HttpResponse<UrlRecordBase[]>>(
      `${controllerPath}/list`
    );
    return data.data!;
  },

  getContent: async (url: string) => {
    const { data } = await api.get<HttpResponse<string>>(
      `${controllerPath}/content?url=${url}`
    );
    return data.data!;
  },

  fetchUrls: async (urls: string[]) => {
    const { data } = await api.post<HttpResponse<UrlRecordBase[]>>(
      `${controllerPath}/fetch`,
      { urls }
    );
    return data.data!;
  },
};
