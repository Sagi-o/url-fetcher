import { useMutation, useQuery } from '@tanstack/react-query';
import { urlApiService } from './url.api-service';

export const useUrlList = () => {
  return useQuery({
    queryKey: ['url', 'list'],
    queryFn: () => urlApiService.getList(),
  });
};

export const useUrlContent = (url: string) => {
  return useQuery({
    queryKey: ['url', 'content', url],
    queryFn: () => urlApiService.getContent(url),
    enabled: !!url,
  });
};

export const useFetchUrls = () => {
  return useMutation({
    mutationFn: (urls: string[]) => urlApiService.fetchUrls(urls),
  });
};
