import { useCallback } from 'react';
import { useGroupsData } from '@/hooks/useServerData';

export const useGroups = () => {
  const { data: groups } = useGroupsData();

  const getGroup = useCallback(
    (groupId: string) => {
      return groups?.find((group) => group.id === groupId);
    },
    [groups],
  );

  const getGroupId = useCallback(
    (groupName: string) => {
      const group = groups?.find((group) => group.name === groupName);
      return group?.id;
    },
    [groups],
  );

  return { groups, getGroup, getGroupId };
};
