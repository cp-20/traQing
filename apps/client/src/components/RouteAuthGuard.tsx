import { FC, ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Loader } from '@mantine/core';

type Props = {
  component: ReactNode;
  fallback: ReactNode;
  loading?: ReactNode;
};

export const RouteAuthGuard: FC<Props> = ({ component, fallback, loading }) => {
  const { me, isLoading } = useAuth();
  if (isLoading) {
    return (
      loading || (
        <div className="bg-gray-100 min-h-screen grid place-content-center">
          <Loader type="bars" size="xl" />
        </div>
      )
    );
  }

  return me ? <>{component}</> : <>{fallback}</>;
};
