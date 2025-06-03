import { useMeData } from '@/hooks/useServerData';

export const useAuth = () => {
  const { data, isLoading, isValidating } = useMeData();

  const login = () => {
    location.href = `/api/auth/request?callback=${encodeURIComponent(`${location.href.slice(location.origin.length)}`)}`;
  };

  return { me: data, isLoading, isValidating, login };
};
