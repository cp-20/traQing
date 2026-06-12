import type { FC } from 'react';
import { Stat, StatSkeleton } from '@/components/stats';
import {
  useGaveMessageStampsRanking,
  useGroupRanking,
  useMessagesRanking,
  useReceivedMessageStampsRanking,
  useSubscriptionRanking,
  useTagRanking,
} from '@/hooks/useServerData';

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
  if (stamps === undefined) return <StatSkeleton label="つけたスタンプ数" />;
  const index = stamps.findIndex((s) => s.user === userId);

  if (index === -1) {
    return <Stat label="つけたスタンプ数" value={0} />;
  }

  return <Stat label="つけたスタンプ数" value={stamps[index].count} annotation={`全体${index + 1}位`} />;
};

export const UserReceivedStampStat: FC<UserStatsProps> = ({ userId }) => {
  const { data: stamps } = useReceivedMessageStampsRanking();
  if (stamps === undefined) return <StatSkeleton label="もらったスタンプ数" />;
  const index = stamps.findIndex((s) => s.messageUser === userId);

  if (index === -1) {
    return <Stat label="もらったスタンプ数" value={0} />;
  }

  return <Stat label="もらったスタンプ数" value={stamps[index].count} annotation={`全体${index + 1}位`} />;
};

export const UserGroupStat: FC<UserStatsProps> = ({ userId }) => {
  const { data: ranking } = useGroupRanking('user');
  if (ranking === undefined) return <StatSkeleton label="グループ所属数" />;
  const index = ranking.findIndex((r) => r.group === userId);

  if (index === -1) {
    return <Stat label="グループ所属数" value="0" />;
  }

  return <Stat label="グループ所属数" value={ranking[index].count} annotation={`全体${index + 1}位`} />;
};

export const UserTagStat: FC<UserStatsProps> = ({ userId }) => {
  const { data: ranking } = useTagRanking('user');
  if (ranking === undefined) return <StatSkeleton label="タグ数" />;
  const index = ranking.findIndex((r) => r.group === userId);

  if (index === -1) {
    return <Stat label="タグ数" value="0" />;
  }

  return <Stat label="タグ数" value={ranking[index].count} annotation={`全体${index + 1}位`} />;
};

export const UserSubscriptionStat: FC<UserStatsProps> = ({ userId }) => {
  const { data: ranking } = useSubscriptionRanking('user');
  if (ranking === undefined) return <StatSkeleton label="チャンネル購読数" />;
  const index = ranking.findIndex((r) => r.group === userId);

  if (index === -1) {
    return <Stat label="チャンネル購読数" value="0" />;
  }

  return <Stat label="チャンネル購読数" value={ranking[index].count} annotation={`全体${index + 1}位`} />;
};
