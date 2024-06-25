import { Stat } from '@/components/Stat';
import { useMessages } from '@/hooks/useMessages';
import { useStamps } from '@/hooks/useStamps';
import { Skeleton } from '@mantine/core';
import type { MessagesQuery, StampsQuery } from '@traq-ing/database';
import { FC, useMemo } from 'react';

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
  if (index === -1) return <Stat label="投稿数" value={<Skeleton />} />;

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
  if (index === -1) return <Stat label="つけたスタンプ" value={<Skeleton />} />;

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
  if (index === -1)
    return <Stat label="もらったスタンプ" value={<Skeleton />} />;
  return (
    <Stat
      label="もらったスタンプ"
      value={stamps[index].count}
      annotation={`全体${index + 1}位`}
    />
  );
};
