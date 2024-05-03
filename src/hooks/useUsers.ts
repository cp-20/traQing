import { atom, useAtom } from 'jotai';
import { useCallback, useEffect } from 'react';
import type { User } from 'traq-bot-ts';

const usersAtom = atom<User[]>([]);

export const useUsers = () => {
  const [users, setUsers] = useAtom(usersAtom);

  const getUsername = useCallback(
    (id: string): string => {
      const user = users.find((u) => u.id === id);
      if (!user) {
        console.error(`User not found: ${id}`);
        return 'Unknown';
      }

      return user.name;
    },
    [users]
  );

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch('/api/users');
      const data = await res.json();
      setUsers(data);
    };

    fetchUsers();
  }, [setUsers]);

  return { users, getUsername };
};
