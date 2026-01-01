import { Card, Text, Stack, Badge, Loader, Center, Title } from '@mantine/core';
import { useUrlApi } from '../dal/url/useUrlApi';
import { UrlSubmissionForm } from '../components/UrlSubmissionForm';

export const UrlListPage = () => {
  const { getList } = useUrlApi();
  const { data, isLoading, error } = getList;

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
      {data.data?.map((urlRecord) => (
        <Card key={urlRecord.url} shadow="sm" padding="lg" radius="md" withBorder>
          <Stack gap="xs">
            <Text fw={500}>{urlRecord.url}</Text>
            <Badge
              color={
                urlRecord.status === 'success'
                  ? 'green'
                  : urlRecord.status === 'loading'
                  ? 'blue'
                  : 'red'
              }
              variant="light"
            >
              {urlRecord.status}
            </Badge>
          </Stack>
        </Card>
      ))}
    </Stack>
  );
};

export default UrlListPage;
