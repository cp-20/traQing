import { useAuth } from '@/hooks/useAuth';
import { Button } from '@mantine/core';
import { FC } from 'react';

export const LandingPage: FC = () => {
  const { login } = useAuth();
  return (
    <div className="w-screen h-screen grid place-content-center">
      <Button onClick={login}>traQで認証する</Button>
    </div>
  );
};
