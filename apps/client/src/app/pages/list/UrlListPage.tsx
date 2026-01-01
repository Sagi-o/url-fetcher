import { Loader, Center, Title, Stack, Text, Group } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { UrlSortField, SortOrder } from '@org/shared';
import { useUrlList, useFetchUrls } from '../../dal/url/url.api-hooks';
import { UrlSubmissionForm } from './UrlSubmissionForm';
import { EmptyState } from '../../components/EmptyState';
import { useUrlSseEvents } from '../../hooks/useUrlSseEvents';
import { UrlCard } from '../../components/UrlCard';
import { SortControl } from '../../components/SortControl';

export const UrlListPage = () => {
  useUrlSseEvents();
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState<UrlSortField>('updatedAt');
  const [order, setOrder] = useState<SortOrder>('desc');

  const { data, isLoading, error } = useUrlList({ sortBy, order });
  const { mutate: refetchUrl } = useFetchUrls();

  const handleSortChange = (newSortBy: UrlSortField, newOrder: SortOrder) => {
    setSortBy(newSortBy);
    setOrder(newOrder);
  };

  const handleRefetch = (url: string) => {
    refetchUrl([url]);
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
        {data.data && data.data.length > 0 && (
          <SortControl sortBy={sortBy} order={order} onSortChange={handleSortChange} />
        )}
      </Group>

      {data.data && data.data.length > 0 ? (
        data.data.map((urlRecord) => (
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
        ))
      ) : (
        <EmptyState message="No URLs submitted yet. Submit URLs above to get started!" />
      )}
    </Stack>
  );
};

export default UrlListPage;
