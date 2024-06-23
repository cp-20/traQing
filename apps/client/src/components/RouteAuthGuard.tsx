import { FC, ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';

type Props = {
  component: ReactNode;
  fallback: ReactNode;
};

export const RouteAuthGuard: FC<Props> = ({ component, fallback }) => {
  const { me } = useAuth();
  return me ? <>{component}</> : <>{fallback}</>;
};
