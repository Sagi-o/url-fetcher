import { Button } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

export const BackButton = () => {
  const navigate = useNavigate();

  return (
    <Button
      data-testid="back-button"
      variant="subtle"
      leftSection={<IconArrowLeft size={16} />}
      onClick={() => navigate('/')}
    >
      Back to List
    </Button>
  );
};
