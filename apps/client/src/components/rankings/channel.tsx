import { ActionIcon, Skeleton } from '@mantine/core';
import type { MessagesQuery } from '@traq-ing/database';
import { type FC, useCallback, useMemo } from 'react';
import { ChannelIcon } from '@/components/icons/ChannelIcon';
import { NotificationIcon } from '@/components/NotificationIcon';
import {
  RankingItem,
  RankingItemBar,
  RankingItemRank,
  RankingItemSkeleton,
  RankingItemValue,
  RankingItemWithLink,
} from '@/components/rankings';
import { UserAvatar } from '@/components/UserAvatar';
import { type DateRange, dateRangeToQuery } from '@/composables/useDateRangePicker';
import { useChannels } from '@/hooks/useChannels';
import { useMessages } from '@/hooks/useMessages';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { useUsers } from '@/hooks/useUsers';

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
    <RankingItemWithLink to={`/channels/${getChannelName(channelId)}`}>
      {rate && <RankingItemBar rate={rate} />}
      <RankingItemRank rank={rank} />
      <span className="font-medium break-all">#{channel}</span>
      <RankingItemValue value={value} />
    </RankingItemWithLink>
  );
};

export type ChannelRankingItemWithUsersProps = {
  range?: DateRange;
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
        orderBy: 'target',
        order: 'desc',
        limit: onlyTop ? 1 : undefined,
        ...(range && dateRangeToQuery(range)),
      }) satisfies MessagesQuery,
    [channelId, range, onlyTop],
  );
  const { messages, loading } = useMessages(query);
  const firstUser = messages.length > 0 ? getUserFromId(messages[0]?.user) : undefined;

  const icon = firstUser ? (
    <UserAvatar user={firstUser} size={24} />
  ) : loading || users === undefined ? (
    <Skeleton circle height={24} />
  ) : (
    <div className="size-6" />
  );

  return (
    <RankingItemWithLink to={`/channels/${getChannelName(channelId)}`}>
      {rate && <RankingItemBar rate={rate} />}
      <RankingItemRank rank={rank} />
      {icon}
      <div className="flex-1 flex @2xl:flex-row flex-col @2xl:items-center @2xl:gap-2 gap-1 justify-between">
        <div className="font-semibold break-all">
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
                  {user ? (
                    <UserAvatar
                      user={user}
                      size={16}
                      className="border-2 border-white bg-white"
                      title={`${user.displayName} (@${user.name.split('#')[0]})`}
                    />
                  ) : (
                    <Skeleton circle w={16} height={16} className="border-2 border-white" />
                  )}
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

export type ChannelRankingItemWithSubscriptionProps = {
  channelId: string;
  rank: number;
  value: number;
  rate?: number;
};

export const ChannelRankingItemWithSubscription: FC<ChannelRankingItemWithSubscriptionProps> = ({
  channelId,
  rank,
  value,
  rate,
}) => {
  const { getChannelName } = useChannels();
  const { getSubscriptionLevel, setSubscriptionLevel } = useSubscriptions();

  const currentLevel = useMemo(() => getSubscriptionLevel(channelId), [channelId, getSubscriptionLevel]);
  const handleClick = useCallback(
    () => setSubscriptionLevel(channelId, ((currentLevel + 1) % 3) as 0 | 1 | 2),
    [setSubscriptionLevel, channelId, currentLevel],
  );

  return (
    <RankingItem>
      <RankingItemRank rank={rank} />
      <ActionIcon variant="transparent" className="text-text-primary hover:text-text-primary" onClick={handleClick}>
        <NotificationIcon level={currentLevel} />
      </ActionIcon>
      <ChannelIcon />
      <div className="flex-1 flex">
        <div className="font-semibold">{getChannelName(channelId) ?? <Skeleton h={16} />}</div>
      </div>
      <RankingItemValue value={value} />
      {rate && <div>({(rate * 100).toFixed(2)}%)</div>}
    </RankingItem>
  );
};
