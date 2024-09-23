import { UserAvatar } from '@/components/UserAvatar';
import {
  RankingItemBar,
  RankingItemRank,
  RankingItemSkeleton,
  RankingItemValue,
  RankingItemWithLink,
} from '@/components/rankings';
import { useChannels } from '@/hooks/useChannels';
import { useMessages } from '@/hooks/useMessages';
import { useUsers } from '@/hooks/useUsers';
import { type DateRange, dateRangeToQuery } from '@/models/useDateRangePicker';
import { Skeleton } from '@mantine/core';
import type { MessagesQuery } from '@traq-ing/database';
import { type FC, useMemo } from 'react';

export type ChannelRankingItemProps = {
  channelId: string;
  rank: number;
  value: number;
  rate?: number;
};

export const ChannelRankingItem: FC<ChannelRankingItemProps> = ({ channelId, rank, value, rate }) => {
  const { getChannelName } = useChannels();

  const channel = getChannelName(channelId);
  if (channel === undefined) return <RankingItemSkeleton rank={rank} showIcon={false} />;

  return (
    <RankingItemWithLink to={`/channels/${encodeURIComponent(channel)}`}>
      {rate && <RankingItemBar rate={rate} />}
      <RankingItemRank rank={rank} />
      <span className="font-medium">#{channel}</span>
      <RankingItemValue value={value} />
    </RankingItemWithLink>
  );
};

export type ChannelRankingWithUsersProps = {
  range: DateRange;
  channelId: string;
  rank: number;
  value: number;
  rate?: number;
};

export const ChannelRankingWithUsers: FC<ChannelRankingWithUsersProps> = ({ range, channelId, rank, value, rate }) => {
  const { getUserFromId, users } = useUsers();
  const { getChannelName } = useChannels();
  const query = useMemo(
    () =>
      ({
        channelId,
        groupBy: 'user',
        orderBy: 'count',
        order: 'desc',
        limit: 1,
        ...dateRangeToQuery(range),
      }) satisfies MessagesQuery,
    [channelId, range],
  );
  const { messages, loading } = useMessages(query);
  const firstUser = messages.length > 0 ? getUserFromId(messages[0]?.user) : undefined;

  const icon = firstUser ? (
    <UserAvatar userId={firstUser.id} size={24} />
  ) : loading || users === undefined ? (
    <Skeleton circle height={24} />
  ) : (
    <div className="size-6" />
  );

  return (
    <RankingItemWithLink to={`/channels/${encodeURIComponent(channelId)}`}>
      {rate && <RankingItemBar rate={rate} />}
      <RankingItemRank rank={rank} />
      {icon}
      <div className="font-semibold">
        {getChannelName(channelId) ? `#${getChannelName(channelId)}` : <Skeleton h={16} />}
      </div>
      <RankingItemValue value={value} />
    </RankingItemWithLink>
  );
};
