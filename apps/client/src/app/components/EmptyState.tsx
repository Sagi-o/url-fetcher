import { Center, Stack, Text, Button } from '@mantine/core';
import { IconInbox } from '@tabler/icons-react';
import { ReactNode } from 'react';

interface EmptyStateProps {
  message: string;
  action?: ReactNode;
}

export const EmptyState = ({ message, action }: EmptyStateProps) => {
  return (
    <Center h="200px">
      <Stack align="center" gap="md">
        <IconInbox size={48} stroke={1.5} color="var(--mantine-color-dimmed)" />
        <Text c="dimmed" size="lg" ta="center">
          {message}
        </Text>
        {action}
      </Stack>
    </Center>
  );
};
