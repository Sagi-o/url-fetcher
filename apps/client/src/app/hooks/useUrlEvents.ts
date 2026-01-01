import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { UrlRecord, HttpResponse } from '@org/shared';
import { API_URL } from '../dal/api';

const parseSSEData = <T>(data: string): T => {
  return JSON.parse(data) as T;
};

export const useUrlEvents = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const eventSource = new EventSource(`${API_URL}/url/events`);

    eventSource.onmessage = (event: MessageEvent<string>) => {
      const updatedUrlRecord = parseSSEData<UrlRecord>(event.data);

      // Update the cache with the new URL status
      queryClient.setQueryData<HttpResponse<UrlRecord[]>>(
        ['url', 'list'],
        (oldData) => {
          if (!oldData || !oldData.data) return oldData;

          const updatedList = oldData.data.map((url) =>
            url.url === updatedUrlRecord.url ? updatedUrlRecord : url
          );

          return {
            ...oldData,
            data: updatedList,
          };
        }
      );
    };

    eventSource.onerror = (error) => {
      console.error('SSE Error:', error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [queryClient]);
};
