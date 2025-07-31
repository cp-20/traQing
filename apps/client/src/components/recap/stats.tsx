import type { MessagesQuery, StampsQuery } from '@traq-ing/database';
import { type FC, useMemo } from 'react';
import { AnimatedStat } from '@/components/animated-stats';
import { RankingIcon } from '@/components/RankingIcon';
import { yearToQuery } from '@/components/recap/common';
import { StatSkeleton } from '@/components/stats';
import { useMessages } from '@/hooks/useMessages';
import { useStamps } from '@/hooks/useStamps';

const RankAnnotation: FC<{ rank: number }> = ({ rank }) => {
  if (rank === 0) return <span>未ランクイン</span>;

  if (1 <= rank && rank <= 3) {
    return (
      <span className="inline-flex items-center gap-1 font-semibold">
        <RankingIcon rank={rank} />
        <span>{rank}位</span>
      </span>
    );
  }

  if (rank <= 10) return <span className="font-semibold">トップ10</span>;
  if (rank <= 30) return <span className="font-semibold">トップ30</span>;
  if (rank <= 50) return <span className="font-semibold">トップ50</span>;
  if (rank <= 100) return <span className="font-semibold">トップ100</span>;
};

export const TotalMessages: FC<{ userId: string; year: number }> = ({ userId, year }) => {
  const query = useMemo(
    () =>
      ({
        ...yearToQuery(year),
        target: 'count',
        groupBy: 'user',
        orderBy: 'target',
        order: 'desc',
      }) satisfies MessagesQuery,
    [year],
  );
  const { messages, loading } = useMessages(query);

  const userMessagesCount = messages.find((m) => m.user === userId);
  const rank = messages.findIndex((m) => m.user === userId) + 1;

  if (loading) {
    return <StatSkeleton label="総メッセージ数" />;
  }

  return (
    <AnimatedStat
      label="総メッセージ数"
      value={userMessagesCount?.count ?? 0}
      annotation={<RankAnnotation rank={rank} />}
      start={0}
    />
  );
};

export const TotalMessagesLength: FC<{ userId: string; year: number }> = ({ userId, year }) => {
  const query = useMemo(
    () =>
      ({
        ...yearToQuery(year),
        groupBy: 'user',
        target: 'contentSum',
        orderBy: 'target',
        order: 'desc',
      }) satisfies MessagesQuery,
    [year],
  );
  const { messages, loading } = useMessages(query);

  const userMessagesLength = messages.find((m) => m.user === userId);
  const rank = messages.findIndex((m) => m.user === userId) + 1;

  if (loading) {
    return <StatSkeleton label="総メッセージ長" />;
  }

  return (
    <AnimatedStat
      label="総メッセージ長"
      value={userMessagesLength?.contentSum ?? 0}
      unit="文字"
      annotation={<RankAnnotation rank={rank} />}
      start={0}
    />
  );
};

export const TotalReactionsGave: FC<{ userId: string; year: number }> = ({ userId, year }) => {
  const query = useMemo(
    () =>
      ({
        ...yearToQuery(year),
        groupBy: 'user',
        orderBy: 'count',
        order: 'desc',
      }) satisfies StampsQuery,
    [year],
  );
  const { stamps, loading } = useStamps(query);

  const userReactionsGave = stamps.find((s) => s.user === userId);
  const rank = stamps.findIndex((s) => s.user === userId) + 1;

  if (loading) {
    return <StatSkeleton label="つけた総リアクション数" />;
  }

  return (
    <AnimatedStat
      label="つけた総リアクション数"
      value={userReactionsGave?.count ?? 0}
      annotation={<RankAnnotation rank={rank} />}
      start={0}
    />
  );
};

export const TotalReactionsReceived: FC<{ userId: string; year: number }> = ({ userId, year }) => {
  const query = useMemo(
    () =>
      ({
        ...yearToQuery(year),
        groupBy: 'messageUser',
        orderBy: 'count',
        order: 'desc',
      }) satisfies StampsQuery,
    [year],
  );
  const { stamps, loading } = useStamps(query);

  const userReactionsReceived = stamps.find((s) => s.messageUser === userId);
  const rank = stamps.findIndex((s) => s.messageUser === userId) + 1;

  if (loading) {
    return <StatSkeleton label="もらった総リアクション数" />;
  }

  return (
    <AnimatedStat
      label="もらった総リアクション数"
      value={userReactionsReceived?.count ?? 0}
      annotation={<RankAnnotation rank={rank} />}
      start={0}
    />
  );
};
