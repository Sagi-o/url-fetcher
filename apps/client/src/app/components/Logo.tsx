import { Text } from '@mantine/core';

export const Logo = () => {
  return (
    <Text
      size="xl"
      fw={700}
      variant="gradient"
      gradient={{ from: 'blue', to: 'cyan', deg: 90 }}
    >
      UrlFetcher
    </Text>
  );
};
