import { useUsersData } from '@/hooks/useServerData';
import { useCallback, useMemo } from 'react';

export const useUsers = () => {
  const { data: users } = useUsersData();

  const usersMapById = useMemo(() => new Map(users?.map((u) => [u.id, u])), [users]);
  const usersMapByName = useMemo(() => new Map(users?.map((u) => [u.name, u])), [users]);

  const getUserFromId = useCallback((id: string) => usersMapById.get(id), [usersMapById]);

  const getUserFromName = useCallback((name: string) => usersMapByName.get(name), [usersMapByName]);

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
