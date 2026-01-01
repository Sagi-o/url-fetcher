import { Card, Text, Stack, Loader, Center, Title, Alert } from '@mantine/core';
import { useSearchParams } from 'react-router-dom';
import { useUrlApi } from '../dal/url/useUrlApi';
import { IconInfoCircle } from '@tabler/icons-react';

export const UrlContentPage = () => {
  const [searchParams] = useSearchParams();
  const url = searchParams.get('url');

  const { getContent } = useUrlApi();
  const { data, isLoading, error } = getContent(url || '');

  if (!url) {
    return (
      <Center h="50vh">
        <Alert icon={<IconInfoCircle />} title="Missing URL" color="yellow">
          Please provide a URL query parameter
        </Alert>
      </Center>
    );
  }

  if (isLoading) {
    return (
      <Center h="50vh">
        <Stack align="center" gap="md">
          <Loader size="lg" />
          <Text c="dimmed">Fetching content...</Text>
        </Stack>
      </Center>
    );
  }

  if (error || !data?.success) {
    return (
      <Center h="50vh">
        <Alert icon={<IconInfoCircle />} title="Error" color="red">
          {data?.message || 'Failed to fetch content for this URL'}
        </Alert>
      </Center>
    );
  }

  return (
    <Stack gap="md">
      <Title order={2}>URL Content</Title>
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Stack gap="md">
          <Text fw={500} size="sm" c="dimmed">
            URL: {url}
          </Text>
          <Card withBorder p="md" bg="gray.0">
            <Text style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              {data.data}
            </Text>
          </Card>
        </Stack>
      </Card>
    </Stack>
  );
};

export default UrlContentPage;
