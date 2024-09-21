import { RankingItemSkeleton } from '@/components/rankings';
import { UserRankingItem } from '@/components/rankings/user';
import { useMessages } from '@/hooks/useMessages';
import { userRankingQuery } from '@/models/Rankings/user';
import { DateRange, dateRangeToQuery } from '@/models/useDateRangePicker';
import type { MessagesQuery } from '@traq-ing/database';
import clsx from 'clsx';
import { Fragment, useMemo } from 'react';
import type { FC } from 'react';

type Props = {
  range: DateRange;
};

export const UserPostRanking: FC<Props> = ({ range }) => {
  const query = useMemo(
    () =>
      ({
        ...userRankingQuery,
        ...dateRangeToQuery(range),
      } satisfies MessagesQuery),
    [range]
  );
  const { messages, loading } = useMessages(query);

  if (loading && messages.length === 0) {
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
      {messages.map((m, i) => (
        <Fragment key={m.user}>
          <UserRankingItem
            userId={m.user}
            rank={i + 1}
            value={m.count}
            rate={m.count / messages[0].count}
          />
        </Fragment>
      ))}
    </div>
  );
};
