import { Card, Text, Stack, Badge, Group } from '@mantine/core';
import { UrlRecord } from '@org/shared';
import { IconClock } from '@tabler/icons-react';
import classes from './UrlCard.module.css';

interface UrlCardProps {
  urlRecord: UrlRecord;
  onClick: () => void;
}

export const UrlCard = ({ urlRecord, onClick }: UrlCardProps) => {
  const isClickable = urlRecord.status === 'success';

  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      className={isClickable ? classes.card : undefined}
      style={{ cursor: isClickable ? 'pointer' : 'default' }}
      onClick={onClick}
    >
      <Stack gap="xs">
        <Text fw={500}>{urlRecord.url}</Text>
        <Group gap="xs">
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
          {urlRecord.status !== 'loading' && 'fetchTime' in urlRecord && (
            <Badge variant="outline" color="gray" leftSection={<IconClock size={12} />}>
              {urlRecord.fetchTime}ms
            </Badge>
          )}
        </Group>
        {urlRecord.status === 'failed' && 'errorMessage' in urlRecord && (
          <Text size="sm" c="red">
            Error: {urlRecord.errorMessage}
          </Text>
        )}
      </Stack>
    </Card>
  );
};
