import { Button, Text } from '@mantine/core';
import { FC } from 'react';
import LogoImage from '@/assets/logo.svg';
import { useAuth } from '@/hooks/useAuth';

export const NeedLogin: FC = () => {
  const { login } = useAuth();
  return (
    <div className="w-screen h-screen grid place-content-center px-8">
      <img src={LogoImage} alt="" width={480} />
      <Button onClick={login} size="lg" className="mt-8 mb-4">
        traQで認証する
      </Button>
      <Text c="dimmed" ta="center">
        利用するにはtraPアカウントでの認証が必要です
      </Text>
    </div>
  );
};
