import { Stat, StatSkeleton } from '@/components/stats';
import {
  useGaveMessageStampsRanking,
  useGroupRanking,
  useMessagesRanking,
  useReceivedMessageStampsRanking,
  useSubscriptionRanking,
  useTagRanking,
} from '@/hooks/useServerData';
import type { FC } from 'react';

type UserStatsProps = {
  userId: string;
};

export const UserMessageCountStat: FC<UserStatsProps> = ({ userId }) => {
  const { data: messages } = useMessagesRanking();
  if (messages === undefined) return <StatSkeleton label="投稿数" />;
  const index = messages.findIndex((m) => m.user === userId);

  if (index === -1) {
    return <Stat label="投稿数" value={0} />;
  }

  return <Stat label="投稿数" value={messages[index].count} annotation={`全体${index + 1}位`} />;
};

export const UserGaveStampStat: FC<UserStatsProps> = ({ userId }) => {
  const { data: stamps } = useGaveMessageStampsRanking();
  if (stamps === undefined) return <StatSkeleton label="つけたスタンプ" />;
  const index = stamps.findIndex((s) => s.user === userId);

  if (index === -1) {
    return <Stat label="つけたスタンプ" value={0} valueProps={{ className: 'text-teal-600' }} />;
  }

  return (
    <Stat
      label="つけたスタンプ"
      value={stamps[index].count}
      valueProps={{ className: 'text-teal-600' }}
      annotation={`全体${index + 1}位`}
    />
  );
};

export const UserReceivedStampStat: FC<UserStatsProps> = ({ userId }) => {
  const { data: stamps } = useReceivedMessageStampsRanking();
  if (stamps === undefined) return <StatSkeleton label="もらったスタンプ" />;
  const index = stamps.findIndex((s) => s.messageUser === userId);

  if (index === -1) {
    return <Stat label="もらったスタンプ" value={0} valueProps={{ className: 'text-indigo-600' }} />;
  }

  return (
    <Stat
      label="もらったスタンプ"
      value={stamps[index].count}
      valueProps={{ className: 'text-indigo-600' }}
      annotation={`全体${index + 1}位`}
    />
  );
};

export const UserGroupStat: FC<UserStatsProps> = ({ userId }) => {
  const { data: ranking } = useGroupRanking('user');
  if (ranking === undefined) return <StatSkeleton label="グループ" />;
  const index = ranking.findIndex((r) => r.group === userId);

  if (index === -1) {
    return <Stat label="グループ所属数" value="0" valueProps={{ className: 'text-orange-600' }} />;
  }

  return (
    <Stat
      label="グループ所属数"
      value={ranking[index].count}
      valueProps={{ className: 'text-orange-600' }}
      annotation={`全体${index + 1}位`}
    />
  );
};

export const UserTagStat: FC<UserStatsProps> = ({ userId }) => {
  const { data: ranking } = useTagRanking('user');
  if (ranking === undefined) return <StatSkeleton label="タグ" />;
  const index = ranking.findIndex((r) => r.group === userId);

  if (index === -1) {
    return <Stat label="タグ数" value="0" valueProps={{ className: 'text-pink-600' }} />;
  }

  return (
    <Stat
      label="タグ数"
      value={ranking[index].count}
      valueProps={{ className: 'text-pink-600' }}
      annotation={`全体${index + 1}位`}
    />
  );
};

export const UserSubscriptionStat: FC<UserStatsProps> = ({ userId }) => {
  const { data: ranking } = useSubscriptionRanking('user');
  if (ranking === undefined) return <StatSkeleton label="チャンネル購読数" />;
  const index = ranking.findIndex((r) => r.group === userId);

  if (index === -1) {
    return <Stat label="チャンネル購読数" value="0" valueProps={{ className: 'text-green-600' }} />;
  }

  return (
    <Stat
      label="チャンネル購読数"
      value={ranking[index].count}
      valueProps={{ className: 'text-green-600' }}
      annotation={`全体${index + 1}位`}
    />
  );
};
