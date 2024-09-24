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

export type ChannelRankingItemWithUsersProps = {
  range: DateRange | null;
  channelId: string;
  rank: number;
  value: number;
  rate?: number;
  onlyTop?: boolean;
};

export const ChannelRankingItemWithUsers: FC<ChannelRankingItemWithUsersProps> = ({
  range,
  channelId,
  rank,
  value,
  rate,
  onlyTop,
}) => {
  const { getUserFromId, users } = useUsers();
  const { getChannelName } = useChannels();
  const query = useMemo(
    () =>
      ({
        channelId,
        groupBy: 'user',
        orderBy: 'count',
        order: 'desc',
        limit: onlyTop ? 1 : undefined,
        ...(range && dateRangeToQuery(range)),
      }) satisfies MessagesQuery,
    [channelId, range, onlyTop],
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
      <div className="flex-1 flex @2xl:flex-row flex-col @2xl:items-center @2xl:gap-2 gap-1 justify-between">
        <div className="font-semibold">
          {getChannelName(channelId) ? `#${getChannelName(channelId)}` : <Skeleton h={16} />}
        </div>
        {!onlyTop && (
          <div className="flex items-center -space-x-1">
            {(messages.length === 0 || users === undefined) &&
              new Array(10).fill(0).map((_, i) => (
                <div key={i} style={{ zIndex: 10 - i }}>
                  <Skeleton circle w={16} height={16} className="border-2 border-white" />
                </div>
              ))}
            {messages.slice(0, 10).map((m, i, arr) => {
              const user = getUserFromId(m.user);
              return (
                <div key={m.user} style={{ zIndex: arr.length - i }}>
                  <UserAvatar
                    userId={m.user}
                    size={16}
                    className="border-2 border-white bg-white"
                    title={user && `${user.displayName} (@${user.name.split('#')[0]})`}
                  />
                </div>
              );
            })}
            {messages.length > 10 && (
              <div>
                <div className="ml-2 text-xs font-medium grid place-content-center text-gray-400">
                  +{messages.length - 10}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <RankingItemValue value={value} />
    </RankingItemWithLink>
  );
};
