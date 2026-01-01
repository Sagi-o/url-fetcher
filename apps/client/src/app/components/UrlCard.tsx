import { Card, Text, Stack, Badge, Group, ActionIcon, Tooltip } from '@mantine/core';
import { UrlRecord } from '@org/shared';
import { IconClock, IconRefresh } from '@tabler/icons-react';
import { formatDistanceToNow } from 'date-fns';
import classes from './UrlCard.module.css';

interface UrlCardProps {
  urlRecord: UrlRecord;
  onClick: () => void;
  onRefetch?: (url: string) => void;
}

export const UrlCard = ({ urlRecord, onClick, onRefetch }: UrlCardProps) => {
  const isClickable = urlRecord.status === 'success';
  const timestamp = urlRecord.updatedAt ?? urlRecord.createdAt;
  const timeAgo = formatDistanceToNow(timestamp, { addSuffix: true });

  const handleRefetch = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRefetch?.(urlRecord.url);
  };

  return (
    <Card
      data-testid="url-card"
      data-url={urlRecord.url}
      data-status={urlRecord.status}
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      className={isClickable ? classes.card : undefined}
      style={{ cursor: isClickable ? 'pointer' : 'default' }}
      onClick={onClick}
    >
      <Stack gap="xs">
        <Group justify="space-between" align="flex-start">
          <Text fw={500} data-testid="url-text" style={{ flex: 1 }}>{urlRecord.url}</Text>
          {onRefetch && urlRecord.status !== 'loading' && (
            <Tooltip label="Refetch URL">
              <ActionIcon
                variant="subtle"
                color="gray"
                size="sm"
                onClick={handleRefetch}
                data-testid="refetch-button"
              >
                <IconRefresh size={16} />
              </ActionIcon>
            </Tooltip>
          )}
        </Group>
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
          {urlRecord.status !== 'loading' && 'fetchTime' in urlRecord && (
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
        <Text size="xs" c="dimmed" data-testid="time-ago">
          {timeAgo}
        </Text>
        {urlRecord.status === 'failed' && 'errorMessage' in urlRecord && (
          <Text size="sm" c="red" data-testid="error-message">
            Error: {urlRecord.errorMessage}
          </Text>
        )}
      </Stack>
    </Card>
  );
};
