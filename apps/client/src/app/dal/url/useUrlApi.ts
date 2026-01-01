import { useMutation, useQuery } from '@tanstack/react-query';
import { urlApiService } from './url.api-service';

export const useUrlApi = () => {
  const getList = useQuery({
    queryKey: ['url', 'list'],
    queryFn: () => urlApiService.getList(),
  });

  const getContent = (url: string) =>
    useQuery({
      queryKey: ['url', 'content', url],
      queryFn: () => urlApiService.getContent(url),
      enabled: !!url,
    });

  const fetchUrls = useMutation({
    mutationFn: (urls: string[]) => urlApiService.fetchUrls(urls),
  });

  return {
    getList,
    getContent,
    fetchUrls,
  };
};
