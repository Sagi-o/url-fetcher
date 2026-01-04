import {
  Card,
  Text,
  Stack,
  Loader,
  Center,
  Title,
  Button,
  Group,
  Tabs,
  Code,
  Badge,
} from '@mantine/core';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { parseAsStringLiteral, useQueryState } from 'nuqs';
import { useUrlContent } from '../../dal/url/url.api-hooks';
import { EmptyState } from '../../components/EmptyState';
import { SafeHtmlRenderer } from '../../components/SafeHtmlRenderer';
import { BackButton } from '../../components/BackButton';
import { IconHome, IconEye, IconCode, IconClock } from '@tabler/icons-react';
import { formatDistanceToNow } from 'date-fns';

export const UrlContentPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const url = searchParams.get('url');

  const [tab, setTab] = useQueryState(
    'tab',
    parseAsStringLiteral(['preview', 'source'] as const).withDefault('preview')
  );

  const { data, isLoading, error } = useUrlContent(url || '');

  if (!url) {
    return <EmptyState message="No URL provided." />;
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

  if (error || !data?.success || !data?.data) {
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

  const urlRecord = data.data;

  const content = urlRecord.status === 'success' ? urlRecord.content : '';
  const timeAgo = formatDistanceToNow(
    urlRecord.updatedAt ?? urlRecord.createdAt,
    { addSuffix: true }
  );

  return (
    <Stack gap="md" data-testid="url-content-page">
      <Group justify="space-between" align="center">
        <BackButton />
        <Title order={2} data-testid="page-title">
          URL Content
        </Title>
        <div style={{ width: '120px' }} /> {/* Spacer for centering */}
      </Group>
      <Card
        shadow="sm"
        padding="lg"
        radius="md"
        withBorder
        data-testid="content-card"
      >
        <Stack gap="md">
          <Group justify="space-between" align="flex-start">
            <Text fw={600} size="lg" data-testid="current-url">
              {url}
            </Text>
            <Group gap="xs">
              <Badge
                data-testid="status-badge"
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
              {urlRecord.status === 'success' && 'fetchTime' in urlRecord && (
                <Badge
                  data-testid="fetch-time-badge"
                  variant="outline"
                  color="gray"
                  leftSection={<IconClock size={12} />}
                >
                  {urlRecord.fetchTime}ms
                </Badge>
              )}
            </Group>
          </Group>
          <Group gap="xs">
            <IconClock size={14} color="gray" />
            <Text size="xs" c="dimmed" data-testid="time-ago">
              Fetched {timeAgo}
            </Text>
          </Group>
          {urlRecord.status === 'failed' && 'errorMessage' in urlRecord && (
            <Text size="sm" c="red" data-testid="error-message">
              Error: {urlRecord.errorMessage}
            </Text>
          )}
          {urlRecord.status === 'success' && (
            <Tabs
              value={tab}
              onChange={(value) => setTab(value as 'preview' | 'source')}
              data-testid="content-tabs"
            >
              <Tabs.List>
                <Tabs.Tab
                  value="preview"
                  leftSection={<IconEye size={16} />}
                  data-testid="preview-tab"
                >
                  Preview
                </Tabs.Tab>
                <Tabs.Tab
                  value="source"
                  leftSection={<IconCode size={16} />}
                  data-testid="source-tab"
                >
                  Source
                </Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel value="preview" pt="md" data-testid="preview-panel">
                <Card withBorder p="md" bg="white" style={{ color: 'black' }}>
                  <SafeHtmlRenderer html={content} />
                </Card>
              </Tabs.Panel>

              <Tabs.Panel value="source" pt="md" data-testid="source-panel">
                <Card withBorder p="md" bg="gray.0">
                  <Code
                    block
                    style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
                    data-testid="source-code"
                  >
                    {content}
                  </Code>
                </Card>
              </Tabs.Panel>
            </Tabs>
          )}
        </Stack>
      </Card>
    </Stack>
  );
};

export default UrlContentPage;
