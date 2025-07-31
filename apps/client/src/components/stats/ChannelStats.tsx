import type { FC } from 'react';
import { Stat, StatSkeleton } from '@/components/stats';
import { useChannelMessagesRanking, useChannelStampsRanking, useSubscriptionRanking } from '@/hooks/useServerData';

type ChannelStatsProps = {
  channelId: string;
};

export const ChannelMessageCountStat: FC<ChannelStatsProps> = ({ channelId }) => {
  const { data: messages } = useChannelMessagesRanking();
  if (messages === undefined) return <StatSkeleton label="投稿数" />;
  const index = messages.findIndex((m) => m.channel === channelId);

  if (index === -1) {
    return <Stat label="投稿数" value={0} />;
  }

  return <Stat label="投稿数" value={messages[index].count} annotation={`全体${index + 1}位`} />;
};

export const ChannelStampCountStat: FC<ChannelStatsProps> = ({ channelId }) => {
  const { data: stamps } = useChannelStampsRanking();
  if (stamps === undefined) return <StatSkeleton label="スタンプ数" />;
  const index = stamps.findIndex((m) => m.channel === channelId);

  if (index === -1) {
    return <Stat label="スタンプ数" value={0} valueProps={{ className: 'text-teal-600' }} />;
  }

  return (
    <Stat
      label="スタンプ数"
      value={stamps[index].count}
      annotation={`全体${index + 1}位`}
      valueProps={{ className: 'text-teal-600' }}
    />
  );
};

export const ChannelSubscribersCountStat: FC<ChannelStatsProps> = ({ channelId }) => {
  const { data: subscribers } = useSubscriptionRanking('channel');
  if (subscribers === undefined) return <StatSkeleton label="メンバー数" />;
  const index = subscribers.findIndex((s) => s.group === channelId);

  if (index === -1) {
    return <Stat label="メンバー数" value={0} valueProps={{ className: 'text-indigo-600' }} />;
  }

  return (
    <Stat
      label="メンバー数"
      value={subscribers[index].count}
      annotation={`全体${index + 1}位`}
      valueProps={{ className: 'text-indigo-600' }}
    />
  );
};
