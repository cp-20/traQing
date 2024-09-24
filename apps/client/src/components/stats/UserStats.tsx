import { Stat, StatSkeleton } from '@/components/stats';
import {
  useGaveMessageStampsRanking,
  useMessagesRanking,
  useReceivedMessageStampsRanking,
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
