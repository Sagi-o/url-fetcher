import { Button, Textarea, Stack, Card, Title } from '@mantine/core';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useUrlApi } from '../dal/url/useUrlApi';
import { notifications } from '@mantine/notifications';

export const UrlSubmissionForm = () => {
  const [urlsInput, setUrlsInput] = useState('');
  const queryClient = useQueryClient();
  const { fetchUrls } = useUrlApi();

  const handleSubmit = () => {
    const urls = urlsInput
      .split('\n')
      .map((url) => url.trim())
      .filter((url) => url.length > 0);

    if (urls.length === 0) {
      notifications.show({
        title: 'Warning',
        message: 'Please enter at least one URL',
        color: 'yellow',
      });
      return;
    }

    fetchUrls.mutate(urls, {
      onSuccess: () => {
        notifications.show({
          title: 'Success',
          message: 'URLs submitted for fetching',
          color: 'green',
        });
        setUrlsInput('');
        queryClient.invalidateQueries({ queryKey: ['url', 'list'] });
      },
      onError: () => {
        notifications.show({
          title: 'Error',
          message: 'Failed to submit URLs',
          color: 'red',
        });
      },
    });
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Stack gap="md">
        <Title order={3}>Submit URLs</Title>
        <Textarea
          placeholder="Enter URLs (one per line)&#10;http://example1.com&#10;http://example2.com"
          value={urlsInput}
          onChange={(e) => setUrlsInput(e.target.value)}
          minRows={4}
          autosize
        />
        <Button onClick={handleSubmit} loading={fetchUrls.isPending} fullWidth>
          Fetch URLs
        </Button>
      </Stack>
    </Card>
  );
};
