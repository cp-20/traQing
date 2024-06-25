import { client } from '@/features/api';
import { atom, useAtom } from 'jotai';
import { useCallback, useEffect } from 'react';
import type { User } from 'traq-bot-ts';

const usersAtom = atom<User[]>([]);

export const useUsers = () => {
  const [users, setUsers] = useAtom(usersAtom);

  const getUserFromId = useCallback(
    (id: string): User | undefined => users.find((u) => u.id === id),
    [users]
  );

  const getUserFromName = useCallback(
    (name: string): User | undefined => users.find((u) => u.name === name),
    [users]
  );

  const getUsername = useCallback(
    (id: string): string => {
      const user = getUserFromId(id);
      if (!user) return '';
      return user.name;
    },
    [getUserFromId]
  );

  const getUserId = useCallback(
    (username: string): string | undefined => getUserFromName(username)?.id,
    [getUserFromName]
  );

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await client.users.$get();
      if (!res.ok) {
        console.error('Failed to fetch users');
        return;
      }
      const data = await res.json();
      setUsers(data);
    };

    fetchUsers();
  }, [setUsers]);

  return { users, getUsername, getUserId, getUserFromId, getUserFromName };
};
