import { Button, Textarea, Stack, Card, Title, Group, Checkbox } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useQueryClient } from '@tanstack/react-query';
import { useFetchUrls } from '../../dal/url/url.api-hooks';
import { notifications } from '@mantine/notifications';

const validUrlPattern = /^[a-zA-Z0-9.\-_~:/?#[\]@!$&'()*+;=\s\n]*$/;

const EXAMPLE_URLS = [
  'https://github.com',
  'https://stackoverflow.com',
  'https://developer.mozilla.org',
  'https://www.npmjs.com',
  'https://react.dev',
  'https://nodejs.org',
  'https://www.typescriptlang.org',
  'https://vitejs.dev',
  'https://mantine.dev',
  'https://tanstack.com/query',
];

export const UrlSubmissionForm = () => {
  const queryClient = useQueryClient();
  const fetchUrls = useFetchUrls();

  const form = useForm({
    initialValues: {
      urlsInput: '',
      fetchCss: false,
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

  const handleAddExamples = () => {
    form.setFieldValue('urlsInput', EXAMPLE_URLS.join('\n'));
  };

  const handleSubmit = form.onSubmit((values) => {
    const urls = values.urlsInput
      .split('\n')
      .map((url) => url.trim())
      .filter((url) => url.length > 0);

    fetchUrls.mutate({ urls, fetchCss: values.fetchCss }, {
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
          <Checkbox
            data-testid="fetch-css-checkbox"
            label="Fetch and inline CSS (slower but preserves styling)"
            checked={form.values.fetchCss}
            onChange={(e) => form.setFieldValue('fetchCss', e.currentTarget.checked)}
          />
          <Group gap="sm">
            <Button variant="light" onClick={handleAddExamples} disabled={fetchUrls.isPending}>
              Add 10 Example URLs
            </Button>
            <Button data-testid="fetch-urls-button" type="submit" loading={fetchUrls.isPending} style={{ flex: 1 }}>
              Fetch URLs
            </Button>
          </Group>
        </Stack>
      </form>
    </Card>
  );
};
