import type { StampsQuery } from '@traq-ing/database';
import clsx from 'clsx';
import { type FC, Fragment, useMemo } from 'react';
import { RankingItemSkeleton } from '@/components/rankings';
import { StampRankingItem } from '@/components/rankings/stamp';
import { type DateRange, dateRangeToQuery } from '@/composables/useDateRangePicker';
import { useStamps } from '@/hooks/useStamps';

type Props = {
  range?: DateRange;
  channelId?: string;
  gaveUserId?: string;
  receivedUserId?: string;
  limit?: number;
};

export const StampRanking: FC<Props> = ({ range, channelId, gaveUserId, receivedUserId, limit }) => {
  const query = useMemo(
    () =>
      ({
        channelId,
        userId: gaveUserId,
        messageUserId: receivedUserId,
        groupBy: 'stamp',
        orderBy: 'count',
        order: 'desc',
        limit: limit ?? 10,
        ...(range && dateRangeToQuery(range)),
      }) satisfies StampsQuery,
    [range, channelId, gaveUserId, receivedUserId, limit],
  );
  const { stamps, loading } = useStamps(query);

  if (loading && stamps.length === 0) {
    return (
      <div className="flex flex-col">
        {[...Array(limit ?? 10)].map((_, i) => (
          <RankingItemSkeleton key={i} rank={i + 1} />
        ))}
      </div>
    );
  }

  return (
    <div className={clsx('flex flex-col', loading && 'opacity-80')}>
      {stamps.map((s, i) => (
        <Fragment key={s.stamp}>
          <StampRankingItem stampId={s.stamp} rank={i + 1} value={s.count} rate={s.count / stamps[0].count} />
        </Fragment>
      ))}
    </div>
  );
};
