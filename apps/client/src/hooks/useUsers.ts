import { useUsersData } from '@/hooks/useServerData';
import { useCallback } from 'react';

export const useUsers = () => {
  const { data: users } = useUsersData();

  const getUserFromId = useCallback((id: string) => users?.find((u) => u.id === id), [users]);

  const getUserFromName = useCallback((name: string) => users?.find((u) => u.name === name), [users]);

  const getUsername = useCallback(
    (id: string): string => {
      const user = getUserFromId(id);
      if (!user) return '';
      return user.name;
    },
    [getUserFromId],
  );

  const getUserId = useCallback(
    (username: string): string | undefined => getUserFromName(username)?.id,
    [getUserFromName],
  );

  return { users, getUsername, getUserId, getUserFromId, getUserFromName };
};
