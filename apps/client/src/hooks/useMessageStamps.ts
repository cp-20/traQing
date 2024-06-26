import { useMessageStampsData } from '@/hooks/useServerData';
import { useCallback } from 'react';

export const useMessageStamps = () => {
  const { data: stamps } = useMessageStampsData();

  const getStamp = useCallback(
    (id: string) => stamps?.find((s) => s.id === id),
    [stamps]
  );

  return { stamps, getStamp };
};
