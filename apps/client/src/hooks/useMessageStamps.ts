import { useMessageStampsData } from '@/hooks/useServerData';
import { useCallback } from 'react';

export const useMessageStamps = () => {
  const { data: stamps } = useMessageStampsData();

  const getStampId = useCallback(
    (name: string): string | undefined => stamps?.find((s) => s.name === name)?.id,
    [stamps],
  );

  const getStamp = useCallback((id: string) => stamps?.find((s) => s.id === id), [stamps]);

  return { stamps, getStampId, getStamp };
};
