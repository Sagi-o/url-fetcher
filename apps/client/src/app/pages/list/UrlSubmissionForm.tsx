import { Button, Textarea, Stack, Card, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useQueryClient } from '@tanstack/react-query';
import { useFetchUrls } from '../../dal/url/url.api-hooks';
import { notifications } from '@mantine/notifications';

const validUrlPattern = /^[a-zA-Z0-9.\-_~:/?#[\]@!$&'()*+;=\s\n]*$/;

export const UrlSubmissionForm = () => {
  const queryClient = useQueryClient();
  const fetchUrls = useFetchUrls();

  const form = useForm({
    initialValues: {
      urlsInput: '',
    },
    validate: {
      urlsInput: (value) => {
        // Validate that at least one URL is provided
        const urls = value
          .split('\n')
          .map((url) => url.trim())
          .filter((url) => url.length > 0);

        if (urls.length === 0) {
          return 'Please enter at least one URL';
        }

        // Validate URL characters
        if (!validUrlPattern.test(value)) {
          return 'Contains invalid URL characters';
        }

        return null;
      },
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;

    // Allow only valid URL characters:
    // - Alphanumeric (a-z, A-Z, 0-9)
    // - URL special chars: . - _ ~ : / ? # [ ] @ ! $ & ' ( ) * + , ; =
    // - Newlines for multiple URLs
    // - Spaces (will be trimmed later)
    if (validUrlPattern.test(value)) {
      form.setFieldValue('urlsInput', value);
    }
    // If invalid characters, don't update state (prevents typing them)
  };

  const handleSubmit = form.onSubmit((values) => {
    const urls = values.urlsInput
      .split('\n')
      .map((url) => url.trim())
      .filter((url) => url.length > 0);

    fetchUrls.mutate(urls, {
      onSuccess: () => {
        notifications.show({
          title: 'Success',
          message: 'URLs submitted for fetching',
          color: 'green',
        });
        form.reset();
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
  });

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder data-testid="url-submission-form">
      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          <Title order={3}>Submit URLs</Title>
          <Textarea
            data-testid="url-input"
            placeholder="Enter URLs (one per line)&#10;http://example1.com&#10;http://example2.com"
            value={form.values.urlsInput}
            onChange={handleInputChange}
            error={form.errors.urlsInput}
            minRows={4}
            autosize
          />
          <Button data-testid="fetch-urls-button" type="submit" loading={fetchUrls.isPending} fullWidth>
            Fetch URLs
          </Button>
        </Stack>
      </form>
    </Card>
  );
};
