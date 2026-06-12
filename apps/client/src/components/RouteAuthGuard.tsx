import type { FC, ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';

type Props = {
  component: ReactNode;
  fallback: ReactNode;
  loading?: ReactNode;
};

export const RouteAuthGuard: FC<Props> = ({ component, fallback, loading }) => {
  const { me, isLoading, isValidating } = useAuth();

  if (me || isLoading || isValidating) return component;

  return loading ?? fallback;
};
