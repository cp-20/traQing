import { useMessagesByMultipleQueries } from '@/hooks/useMessages';
import { useChannelMessagesRanking, useMessagesRanking } from '@/hooks/useServerData';
import { useUsers } from '@/hooks/useUsers';
import type { MessagesQuery } from '@traq-ing/database';
import { type FC, useMemo } from 'react';
import { timelineCommonQuery } from '@/components/timelines/common';
import { useChannels } from '@/hooks/useChannels';
import { TimelineView } from '@/components/timelines/top-timeline';

export const TopUserMessagesTimeline: FC = () => {
  const { getUsername } = useUsers();
  const { data: rankings } = useMessagesRanking();
  const topUsers = useMemo(() => rankings?.slice(0, 10).map((u) => u.user) ?? [], [rankings]);
  const queries = useMemo(
    () =>
      topUsers.map(
        (u) =>
          ({
            ...timelineCommonQuery,
            userId: u,
          }) satisfies MessagesQuery,
      ),
    [topUsers],
  );
  const { messages } = useMessagesByMultipleQueries(queries);
  const labels = [...new Set(messages.flatMap((m) => m.map((m) => m.month)))].toSorted((a, b) => a.localeCompare(b));
  const datasets = messages.map((message, i) => ({
    label: `@${getUsername(topUsers[i])}`,
    data: labels.map((l) => message.filter((m) => m.month <= l).reduce((acc, cur) => acc + cur.count, 0)),
  }));

  return <TimelineView labels={labels} datasets={datasets} />;
};

export const TopChannelMessagesTimeline: FC = () => {
  const { getChannelName } = useChannels();
  const { data: rankings } = useChannelMessagesRanking();
  const topChannels = useMemo(() => rankings?.slice(0, 10).map((c) => c.channel) ?? [], [rankings]);
  const queries = useMemo(
    () =>
      topChannels.map(
        (c) =>
          ({
            ...timelineCommonQuery,
            channelId: c,
          }) satisfies MessagesQuery,
      ),
    [topChannels],
  );
  const { messages } = useMessagesByMultipleQueries(queries);
  const labels = [...new Set(messages.flatMap((m) => m.map((m) => m.month)))].toSorted((a, b) => a.localeCompare(b));
  const datasets = messages.map((message, i) => ({
    label: `#${getChannelName(topChannels[i])}`,
    data: labels.map((l) => message.filter((m) => m.month <= l).reduce((acc, cur) => acc + cur.count, 0)),
  }));

  return <TimelineView labels={labels} datasets={datasets} />;
};
