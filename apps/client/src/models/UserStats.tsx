import { Stat } from '@/components/Stat';
import { useMessages } from '@/hooks/useMessages';
import { useStamps } from '@/hooks/useStamps';
import { Skeleton } from '@mantine/core';
import type { MessagesQuery, StampsQuery } from '@traq-ing/database';
import { FC, ReactNode, useMemo } from 'react';

type UserStatsProps = {
  userId: string;
};

export const UserMessageCountStat: FC<UserStatsProps> = ({ userId }) => {
  const query = useMemo(
    () =>
      ({
        groupBy: 'user',
        orderBy: 'count',
        order: 'desc',
      } satisfies MessagesQuery),
    [userId]
  );
  const { messages } = useMessages(query);
  const index = messages.findIndex((m) => m.user === userId);
  if (index === -1) return <UserStatSkeleton label="投稿数" />;

  return (
    <Stat
      label="投稿数"
      value={messages[index].count}
      annotation={`全体${index + 1}位`}
    />
  );
};

export const UserGaveStampStat: FC<UserStatsProps> = ({ userId }) => {
  const query = useMemo(
    () => ({ groupBy: 'user' } satisfies StampsQuery),
    [userId]
  );
  const { stamps } = useStamps(query);
  const index = stamps.findIndex((s) => s.user === userId);
  if (index === -1) return <UserStatSkeleton label="つけたスタンプ" />;

  return (
    <Stat
      label="つけたスタンプ"
      value={stamps[index].count}
      annotation={`全体${index + 1}位`}
    />
  );
};

export const UserReceivedStampStat: FC<UserStatsProps> = ({ userId }) => {
  const query = useMemo(
    () => ({ groupBy: 'messageUser' } satisfies StampsQuery),
    [userId]
  );
  const { stamps } = useStamps(query);
  const index = stamps.findIndex((s) => s.messageUser === userId);
  if (index === -1) return <UserStatSkeleton label="もらったスタンプ" />;

  return (
    <Stat
      label="もらったスタンプ"
      value={stamps[index].count}
      annotation={`全体${index + 1}位`}
    />
  );
};

type UserStatSkeletonProps = {
  label: ReactNode;
};

const UserStatSkeleton: FC<UserStatSkeletonProps> = ({ label }) => (
  <Stat
    label={label}
    value={
      <div className="h-10 flex items-center">
        <Skeleton h={32} />
      </div>
    }
    annotation={
      <div className="h-5 flex items-center">
        <Skeleton h={16} />
      </div>
    }
  />
);
