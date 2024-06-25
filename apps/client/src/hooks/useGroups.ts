import { client } from '@/features/api';
import { useState, useEffect } from 'react';
import type { UserGroup } from 'traq-bot-ts';

export const useGroups = () => {
  const [groups, setGroups] = useState<UserGroup[]>([]);

  useEffect(() => {
    const fetchGroups = async () => {
      const res = await client.groups.$get();
      if (!res.ok) {
        console.error('Failed to fetch groups');
        return;
      }
      const data = await res.json();
      setGroups(data);
    };

    fetchGroups();
  }, []);

  return { groups };
};
