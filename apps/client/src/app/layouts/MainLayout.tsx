import { AppShell, Container, Box } from '@mantine/core';
import { Outlet } from 'react-router-dom';
import { Logo } from '../components/Logo';

export const MainLayout = () => {
  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShell.Header>
        <Box h="100%" display="flex" style={{ alignItems: 'center', paddingLeft: '1rem' }}>
          <Logo />
        </Box>
      </AppShell.Header>

      <AppShell.Main>
        <Container size="lg">
          <Outlet />
        </Container>
      </AppShell.Main>
    </AppShell>
  );
};
