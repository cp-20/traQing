import { ChannelRankingItemWithUsers } from '@/components/rankings/channel';
import { yearToQuery, RankingSkeleton } from '@/components/recap/common';
import { useMessages } from '@/hooks/useMessages';
import { useStamps } from '@/hooks/useStamps';
import type { MessagesQuery, StampsQuery } from '@traq-ing/database';
import { type FC, useMemo } from 'react';

export const TopPostedChannels: FC<{ userId: string; year: number }> = ({ userId, year }) => {
  const query = useMemo(
    () =>
      ({
        ...yearToQuery(year),
        userId,
        target: 'count',
        groupBy: 'channel',
        orderBy: 'target',
        order: 'desc',
        limit: 10,
      }) satisfies MessagesQuery,
    [year, userId],
  );
  const { messages, loading } = useMessages(query);

  if (loading) {
    return <RankingSkeleton length={10} />;
  }

  return (
    <div>
      {messages.map((m, i) => (
        <ChannelRankingItemWithUsers key={m.channel} rank={i + 1} channelId={m.channel} value={m.count} onlyTop />
      ))}
    </div>
  );
};

export const TopReactionsGaveChannels: FC<{ userId: string; year: number }> = ({ userId, year }) => {
  const query = useMemo(
    () =>
      ({
        ...yearToQuery(year),
        userId,
        groupBy: 'channel',
        orderBy: 'count',
        order: 'desc',
        limit: 10,
      }) satisfies StampsQuery,
    [year, userId],
  );
  const { stamps, loading } = useStamps(query);

  if (loading) {
    return <RankingSkeleton length={10} />;
  }

  return (
    <div>
      {stamps.map((m, i) => (
        <ChannelRankingItemWithUsers key={m.channel} rank={i + 1} channelId={m.channel} value={m.count} onlyTop />
      ))}
    </div>
  );
};
