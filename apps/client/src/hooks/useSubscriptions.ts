import { client } from '@/features/api';
import { useSubscriptionsData } from '@/hooks/useServerData';
import { useCallback, useMemo } from 'react';

export const useSubscriptions = () => {
  const { data: subscriptions, mutate } = useSubscriptionsData();

  const subscriptionsMap = useMemo(() => {
    if (!subscriptions) return new Map<string, number>();
    return new Map(subscriptions.map((s) => [s.channelId, s.level]));
  }, [subscriptions]);

  const getSubscriptionLevel = useCallback(
    (channelId: string) => {
      return subscriptionsMap.get(channelId) ?? 0;
    },
    [subscriptionsMap]
  );

  const setSubscriptionLevel = useCallback(
    async (channelId: string, level: number) => {
      if (!subscriptions) return;
      const newSubscriptions = subscriptions.map((s) =>
        s.channelId === channelId ? { ...s, level } : s
      );
      await mutate(
        (async () => {
          const res = await client.subscriptions[':id'].$put({
            param: { id: channelId },
            json: { level },
          });
          if (!res.ok) throw new Error('Failed to update subscription');
          return newSubscriptions;
        })(),
        { optimisticData: newSubscriptions }
      );
    },
    [subscriptionsMap]
  );

  return {
    subscriptions,
    getSubscriptionLevel,
    setSubscriptionLevel,
  };
};
