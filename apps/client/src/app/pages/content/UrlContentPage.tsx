import { Card, Text, Stack, Loader, Center, Title, Button, Group, Tabs, Code } from '@mantine/core';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useUrlContent } from '../../dal/url/url.api-hooks';
import { EmptyState } from '../../components/EmptyState';
import { SafeHtmlRenderer } from '../../components/SafeHtmlRenderer';
import { BackButton } from '../../components/BackButton';
import { IconHome, IconEye, IconCode } from '@tabler/icons-react';

export const UrlContentPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const url = searchParams.get('url');

  const { data, isLoading, error } = useUrlContent(url || '');

  if (!url) {
    return <EmptyState message="Please provide a URL query parameter" />;
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
      <EmptyState
        message={data?.message || 'Failed to fetch content for this URL'}
        action={
          <Button
            leftSection={<IconHome size={16} />}
            onClick={() => navigate('/')}
          >
            Back to Home
          </Button>
        }
      />
    );
  }

  return (
    <Stack gap="md">
      <Group justify="space-between" align="center">
        <BackButton />
        <Title order={2}>URL Content</Title>
        <div style={{ width: '120px' }} /> {/* Spacer for centering */}
      </Group>
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Stack gap="md">
          <Text fw={500} size="sm" c="dimmed">
            URL: {url}
          </Text>
          <Tabs defaultValue="preview">
            <Tabs.List>
              <Tabs.Tab value="preview" leftSection={<IconEye size={16} />}>
                Preview
              </Tabs.Tab>
              <Tabs.Tab value="source" leftSection={<IconCode size={16} />}>
                Source
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="preview" pt="md">
              <Card withBorder p="md" bg="gray.0">
                <SafeHtmlRenderer html={data.data || ''} />
              </Card>
            </Tabs.Panel>

            <Tabs.Panel value="source" pt="md">
              <Card withBorder p="md" bg="gray.0">
                <Code block style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  {data.data || ''}
                </Code>
              </Card>
            </Tabs.Panel>
          </Tabs>
        </Stack>
      </Card>
    </Stack>
  );
};

export default UrlContentPage;
