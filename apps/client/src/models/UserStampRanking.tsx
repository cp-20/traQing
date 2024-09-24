import { RankingItemSkeleton } from '@/components/rankings';
import { StampRankingItem } from '@/components/rankings/stamp';
import { useStamps } from '@/hooks/useStamps';
import type { StampsQuery } from '@traq-ing/database';
import clsx from 'clsx';
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
  const { stamps, loading } = useStamps(query);

  if (loading && stamps.length === 0) {
    return (
      <div>
        {[...Array(10)].map((_, i) => (
          <RankingItemSkeleton key={i} rank={i + 1} showIcon={false} />
        ))}
      </div>
    );
  }

  return (
    <div className={clsx(loading && 'opacity-80')}>
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
  const { stamps, loading } = useStamps(query);

  if (loading && stamps.length === 0) {
    return (
      <div>
        {[...Array(10)].map((_, i) => (
          <RankingItemSkeleton key={i} rank={i + 1} showIcon={false} />
        ))}
      </div>
    );
  }

  return (
    <div className={clsx(loading && 'opacity-80')}>
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
