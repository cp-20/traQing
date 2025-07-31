import { Loader } from '@mantine/core';
import clsx from 'clsx';
import type { FC, ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';

type Props = {
  component: ReactNode;
  fallback: ReactNode;
  loading?: ReactNode;
};

export const RouteAuthGuard: FC<Props> = ({ component, fallback, loading }) => {
  const { me, isLoading, isValidating } = useAuth();

  return (
    <>
      <div
        className={clsx(
          'bg-gray-100 inset-0 grid place-content-center fixed transition-all duration-200 ease-in',
          !isLoading && 'invisible opacity-0',
        )}
      >
        {loading || <Loader type="bars" size="xl" />}
      </div>
      {(!isLoading || isValidating) && (me ? component : fallback)}
    </>
  );
};
