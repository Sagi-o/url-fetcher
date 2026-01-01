import { AppShell, Container } from '@mantine/core';
import { Outlet } from 'react-router-dom';
import { Logo } from '../components/Logo';

export const MainLayout = () => {
  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShell.Header>
        <Container h="100%" display="flex" style={{ alignItems: 'center' }}>
          <Logo />
        </Container>
      </AppShell.Header>

      <AppShell.Main>
        <Container size="lg">
          <Outlet />
        </Container>
      </AppShell.Main>
    </AppShell>
  );
};
