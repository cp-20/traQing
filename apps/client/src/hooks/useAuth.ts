import { useMeData } from '@/hooks/useServerData';

export const useAuth = () => {
  const { data, isLoading } = useMeData();

  const login = () => {
    location.href = '/api/auth/request';
  };

  return { me: data, isLoading, login };
};
