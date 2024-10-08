import { RankingItemSkeleton } from '@/components/rankings';
import { ChannelRankingItemWithUsers } from '@/components/rankings/channel';
import { useMessages } from '@/hooks/useMessages';
import { useStamps } from '@/hooks/useStamps';

import { type DateRange, dateRangeToQuery } from '@/composables/useDateRangePicker';
import type { MessagesQuery, StampsQuery } from '@traq-ing/database';
import clsx from 'clsx';
import { Fragment, useMemo } from 'react';
import type { FC } from 'react';
import { useSubscriptionRanking } from '@/hooks/useServerData';

type RankingViewProps = {
  range?: DateRange;
  loading: boolean;
  data: { channel: string; count: number }[];
  limit: number;
};

const RankingView: FC<RankingViewProps> = ({ range, loading, data, limit }) => {
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
      {data.map((row, i) => (
        <Fragment key={row.channel}>
          <ChannelRankingItemWithUsers
            range={range}
            channelId={row.channel}
            rank={i + 1}
            value={row.count}
            rate={row.count / data[0].count}
            onlyTop
          />
        </Fragment>
      ))}
    </div>
  );
};

export type MessagesChannelRankingProps = {
  range?: DateRange;
  userId?: string;
  limit?: number;
};

export const MessagesChannelRanking: FC<MessagesChannelRankingProps> = ({ range, userId, limit }) => {
  const query = useMemo(
    () =>
      ({
        userId,
        groupBy: 'channel',
        orderBy: 'count',
        order: 'desc',
        limit: limit ?? 10,
        ...(range && dateRangeToQuery(range)),
      }) satisfies MessagesQuery,
    [range, userId, limit],
  );
  const { messages, loading } = useMessages(query);

  return <RankingView range={range} loading={loading} data={messages} limit={limit ?? 10} />;
};

export type ChannelStampsRankingProps = {
  range?: DateRange;
  stampId?: string;
  gaveUserId?: string;
  receivedUserId?: string;
  limit?: number;
};

export const StampsChannelRanking: FC<ChannelStampsRankingProps> = ({
  range,
  stampId,
  gaveUserId,
  receivedUserId,
  limit,
}) => {
  const query = useMemo(
    () =>
      ({
        stampId,
        userId: gaveUserId,
        messageUserId: receivedUserId,
        groupBy: 'channel',
        orderBy: 'count',
        order: 'desc',
        limit: limit ?? 10,
        ...(range && dateRangeToQuery(range)),
      }) satisfies StampsQuery,
    [range, stampId, gaveUserId, receivedUserId, limit],
  );
  const { stamps, loading } = useStamps(query);

  return <RankingView range={range} loading={loading} data={stamps} limit={limit ?? 10} />;
};

type SubscribersChannelRankingProps = {
  limit?: number;
};

export const SubscribersChannelRanking: FC<SubscribersChannelRankingProps> = ({ limit }) => {
  const { data: ranking } = useSubscriptionRanking('channel');

  console.log('ranking', ranking?.length);

  return (
    <RankingView
      loading={ranking === undefined}
      data={ranking?.slice(0, limit ?? 10).map((r) => ({ channel: r.group, count: r.count })) ?? []}
      limit={limit ?? 10}
    />
  );
};
