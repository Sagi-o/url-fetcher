import { Loader, Center, Title, Stack, Text } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useUrlList } from '../../dal/url/url.api-hooks';
import { UrlSubmissionForm } from './UrlSubmissionForm';
import { EmptyState } from '../../components/EmptyState';
import { useUrlEvents } from '../../hooks/useUrlEvents';
import { UrlCard } from '../../components/UrlCard';

export const UrlListPage = () => {
  useUrlEvents();
  const navigate = useNavigate();
  const { data, isLoading, error } = useUrlList();

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

      <Title order={2}>URL List</Title>
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
          />
        ))
      ) : (
        <EmptyState message="No URLs submitted yet. Submit URLs above to get started!" />
      )}
    </Stack>
  );
};

export default UrlListPage;
