import { RankingItemSkeleton } from '@/components/rankings';
import { UserRankingItem } from '@/components/rankings/user';
import { useMessages } from '@/hooks/useMessages';
import { useStamps } from '@/hooks/useStamps';
import { type DateRange, dateRangeToQuery } from '@/models/useDateRangePicker';
import type { MessagesQuery, StampsQuery } from '@traq-ing/database';
import clsx from 'clsx';
import { Fragment, useMemo } from 'react';
import type { FC } from 'react';

type RankingViewProps = {
  loading: boolean;
  data: { user: string; count: number }[];
  limit: number;
};

const RankingView: FC<RankingViewProps> = ({ loading, data, limit }) => {
  if (loading && data.length === 0) {
    return (
      <div className="flex flex-col">
        {[...Array(limit)].map((_, i) => (
          <RankingItemSkeleton key={i} rank={i + 1} />
        ))}
      </div>
    );
  }

  return (
    <div className={clsx('flex flex-col', loading && 'opacity-80')}>
      {data.map((m, i) => (
        <Fragment key={m.user}>
          <UserRankingItem userId={m.user} rank={i + 1} value={m.count} rate={m.count / data[0].count} />
        </Fragment>
      ))}
    </div>
  );
};

export type MessagesUserRankingProps = {
  range?: DateRange;
  channelId?: string;
  limit?: number;
};
export const MessagesUserRanking: FC<MessagesUserRankingProps> = ({ range, channelId, limit }) => {
  const query = useMemo(
    () =>
      ({
        channelId,
        groupBy: 'user',
        orderBy: 'count',
        order: 'desc',
        limit: limit ?? 10,
        ...(range && dateRangeToQuery(range)),
      }) satisfies MessagesQuery,
    [range, channelId, limit],
  );
  const { messages, loading } = useMessages(query);

  return <RankingView loading={loading} data={messages} limit={limit ?? 10} />;
};

export type StampsUserRankingProps = {
  range?: DateRange;
  stampId?: string;
  channelId?: string;
  limit?: number;
};

export const StampsUserRanking: FC<StampsUserRankingProps> = ({ range, stampId, channelId, limit }) => {
  const query = useMemo(
    () =>
      ({
        stampId,
        channelId,
        groupBy: 'user',
        orderBy: 'count',
        order: 'desc',
        limit: limit ?? 10,
        ...(range && dateRangeToQuery(range)),
      }) satisfies StampsQuery,
    [range, stampId, channelId, limit],
  );
  const { stamps, loading } = useStamps(query);

  return <RankingView loading={loading} data={stamps} limit={limit ?? 10} />;
};
