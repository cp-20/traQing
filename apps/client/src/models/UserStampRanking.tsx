import { StampRankingItem } from '@/components/rankings/stamp';
import { useStamps } from '@/hooks/useStamps';
import type { StampsQuery } from '@traq-ing/database';
import { type FC, useMemo } from 'react';

type UserStampRankingProps = {
  userId: string;
};

export const UserGaveStampRanking: FC<UserStampRankingProps> = ({ userId }) => {
  const query = useMemo(
    () =>
      ({
        userId,
        groupBy: 'stamp',
        orderBy: 'count',
        limit: 10,
      }) satisfies StampsQuery,
    [userId],
  );
  const { stamps } = useStamps(query);

  return (
    <div>
      {stamps.map((s, i) => (
        <StampRankingItem
          key={s.stamp}
          stampId={s.stamp}
          rank={i + 1}
          value={s.count}
          rate={s.count / stamps[0].count}
        />
      ))}
    </div>
  );
};

export const UserReceivedStampRanking: FC<UserStampRankingProps> = ({ userId }) => {
  const query = useMemo(
    () =>
      ({
        messageUserId: userId,
        groupBy: 'stamp',
        orderBy: 'count',
        limit: 10,
      }) satisfies StampsQuery,
    [userId],
  );
  const { stamps } = useStamps(query);

  return (
    <div>
      {stamps.map((s, i) => (
        <StampRankingItem
          key={s.stamp}
          stampId={s.stamp}
          rank={i + 1}
          value={s.count}
          rate={s.count / stamps[0].count}
        />
      ))}
    </div>
  );
};
