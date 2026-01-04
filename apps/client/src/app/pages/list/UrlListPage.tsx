import { Loader, Center, Title, Stack, Text, Group } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useUrlList, useFetchUrls } from '../../dal/url/url.api-hooks';
import { UrlSubmissionForm } from './UrlSubmissionForm';
import { EmptyState } from '../../components/EmptyState';
import { useUrlSseEvents } from '../../hooks/useUrlSseEvents';
import { UrlCard } from '../../components/UrlCard';
import { SortControl } from '../../components/SortControl';
import { Pagination } from '../../components/Pagination';
import { useUrlListParams } from '../../hooks/useUrlListParams';

export const UrlListPage = () => {
  useUrlSseEvents();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { params, handleSortChange, handlePageChange } = useUrlListParams();

  const { data, isLoading, error } = useUrlList(params);
  const { mutate: refetchUrl } = useFetchUrls();

  const paginatedData = data?.data;
  const urlList = paginatedData?.data;

  const handleRefetch = (url: string) => {
    refetchUrl([url]);

    queryClient.invalidateQueries({
      queryKey: ['url', 'content', url],
    });
  };

  if (isLoading) {
    return (
      <Center h="50vh">
        <Loader size="lg" />
      </Center>
    );
  }

  if (error || !data?.success) {
    return (
      <Center h="50vh">
        <Text c="red">{data?.message || 'Error loading URL list'}</Text>
      </Center>
    );
  }

  return (
    <Stack gap="md">
      <UrlSubmissionForm />

      <Group justify="space-between" align="flex-end">
        <Title order={2}>URL List</Title>
        {urlList?.length && (
          <SortControl
            sortBy={params.sortBy}
            order={params.order}
            onSortChange={handleSortChange}
          />
        )}
      </Group>

      {urlList?.length ? (
        <>
          {urlList.map((urlRecord) => (
            <UrlCard
              key={urlRecord.url}
              urlRecord={urlRecord}
              onClick={() => {
                if (urlRecord.status === 'success') {
                  navigate(`/content?url=${encodeURIComponent(urlRecord.url)}`);
                }
              }}
              onRefetch={handleRefetch}
            />
          ))}

          {paginatedData?.meta && (
            <Pagination
              meta={paginatedData.meta}
              onPageChange={handlePageChange}
            />
          )}
        </>
      ) : (
        <EmptyState message="No URLs submitted yet. Submit URLs above to get started!" />
      )}
    </Stack>
  );
};

export default UrlListPage;
