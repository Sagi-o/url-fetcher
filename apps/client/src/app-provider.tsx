import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';

import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

export const AppProvider = () => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider defaultColorScheme="light">
        <Notifications />
        <RouterProvider router={router} />
      </MantineProvider>
    </QueryClientProvider>
  );
};
