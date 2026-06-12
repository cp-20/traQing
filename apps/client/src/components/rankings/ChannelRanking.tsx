import type { MessagesQuery, StampsQuery } from '@traq-ing/database';
import clsx from 'clsx';
import type { FC } from 'react';
import { Fragment, useMemo } from 'react';
import { RankingItemSkeleton } from '@/components/rankings';
import { ChannelRankingItemWithSubscription, ChannelRankingItemWithUsers } from '@/components/rankings/channel';
import { type DateRange, dateRangeToQuery } from '@/composables/useDateRangePicker';
import { useMessages } from '@/hooks/useMessages';
import { useSubscriptionRanking } from '@/hooks/useServerData';
import { useStamps } from '@/hooks/useStamps';
import { useSubscriptions } from '@/hooks/useSubscriptions';

type RankingViewProps = {
  range?: DateRange;
  loading: boolean;
  data: { channel: string; count: number }[];
  limit: number;
  onlyTopUsers?: boolean;
};

const RankingView: FC<RankingViewProps> = ({ range, loading, data, limit, onlyTopUsers = true }) => {
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
            onlyTop={onlyTopUsers}
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
  onlyTopUsers?: boolean;
  subscriptionFilter?: 1 | 2;
};

export const MessagesChannelRanking: FC<MessagesChannelRankingProps> = ({ range, userId, limit, onlyTopUsers }) => {
  const query = useMemo(
    () =>
      ({
        userId,
        target: 'count',
        groupBy: 'channel',
        orderBy: 'target',
        order: 'desc',
        limit: limit ?? 10,
        ...(range && dateRangeToQuery(range)),
      }) satisfies MessagesQuery,
    [range, userId, limit],
  );
  const { messages, loading } = useMessages(query);

  return (
    <RankingView range={range} loading={loading} data={messages} limit={limit ?? 10} onlyTopUsers={onlyTopUsers} />
  );
};

export const MessagesChannelRankingWithSubscription: FC<MessagesChannelRankingProps> = ({
  range,
  userId,
  limit,
  subscriptionFilter,
}) => {
  const { getSubscriptionLevel } = useSubscriptions();
  const query = useMemo(
    () =>
      ({
        userId,
        target: 'count',
        groupBy: 'channel',
        orderBy: 'target',
        order: 'desc',
        ...(range && dateRangeToQuery(range)),
      }) satisfies MessagesQuery,
    [range, userId],
  );
  const { messages, loading } = useMessages(query);
  const filteredMessages = useMemo(
    () =>
      messages
        .map((message, index) => ({ ...message, rank: index + 1 }))
        .filter((m) => subscriptionFilter === undefined || getSubscriptionLevel(m.channel) === subscriptionFilter)
        .slice(0, limit ?? 10),
    [messages, getSubscriptionLevel, subscriptionFilter, limit],
  );

  const allMessagesCount = filteredMessages.map((m) => m.count).reduce((a, b) => a + b, 0);
  if (loading && filteredMessages.length === 0) {
    return (
      <div className="flex flex-col">
        {[...Array(limit ?? 10)].map((_, i) => (
          <RankingItemSkeleton key={i} rank={i + 1} />
        ))}
      </div>
    );
  }

  return (
    <div className={clsx('space-y-2', loading && 'opacity-80')}>
      <div className="flex flex-col">
        {filteredMessages.map((row) => (
          <Fragment key={row.channel}>
            <ChannelRankingItemWithSubscription
              channelId={row.channel}
              rank={row.rank}
              value={row.count}
              rate={row.count / allMessagesCount}
            />
          </Fragment>
        ))}
      </div>
    </div>
  );
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

  return (
    <RankingView
      loading={ranking === undefined}
      data={ranking?.slice(0, limit ?? 10).map((r) => ({ channel: r.group, count: r.count })) ?? []}
      limit={limit ?? 10}
    />
  );
};
