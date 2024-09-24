import { RankingItemSkeleton } from '@/components/rankings';
import { StampRankingItem } from '@/components/rankings/stamp';
import { useStamps } from '@/hooks/useStamps';
import { dateRangeToQuery, type DateRange } from '@/models/useDateRangePicker';
import type { StampsQuery } from '@traq-ing/database';
import clsx from 'clsx';
import { Fragment, useMemo, type FC } from 'react';

type Props = {
  channelId?: string;
  gaveUserId?: string;
  receivedUserId?: string;
  range: DateRange;
};

export const StampRanking: FC<Props> = ({ channelId, gaveUserId, receivedUserId, range }) => {
  const query = useMemo(
    () =>
      ({
        channelId,
        userId: gaveUserId,
        messageUserId: receivedUserId,
        groupBy: 'stamp',
        orderBy: 'count',
        order: 'desc',
        limit: 10,
        ...dateRangeToQuery(range),
      }) satisfies StampsQuery,
    [range, channelId, gaveUserId, receivedUserId],
  );
  const { stamps, loading } = useStamps(query);

  if (loading && stamps.length === 0) {
    return (
      <div className="flex flex-col">
        {[...Array(10)].map((_, i) => (
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
