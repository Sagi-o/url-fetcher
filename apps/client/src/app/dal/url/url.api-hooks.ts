import { useMutation, useQuery } from '@tanstack/react-query';
import { urlApiService } from './url.api-service';
import { UrlListQueryParams } from '@org/shared';

/**
 * Fetch URL list with caching strategy:
 * - staleTime: 30s - Data is considered fresh for 30 seconds
 * - gcTime: 5min - Unused data stays in cache for 5 minutes
 * - SSE updates keep cache synchronized in real-time
 */
export const useUrlList = (params?: UrlListQueryParams) => {
  return useQuery({
    queryKey: ['url', 'list', params],
    queryFn: () => urlApiService.getList(params),
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Fetch URL content with aggressive caching:
 * - staleTime: 5min - Content rarely changes once fetched
 * - gcTime: 10min - Keep content in memory longer
 */
export const useUrlContent = (url: string) => {
  return useQuery({
    queryKey: ['url', 'content', url],
    queryFn: () => urlApiService.getContent(url),
    enabled: !!url,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useFetchUrls = () => {
  return useMutation({
    mutationFn: (urls: string[]) => urlApiService.fetchUrls(urls),
  });
};
