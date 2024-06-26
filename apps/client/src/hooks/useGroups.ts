import { useGroupsData } from '@/hooks/useServerData';

export const useGroups = () => {
  const { data: groups } = useGroupsData();
  return { groups };
};
