import type { MessagesQuery } from '@traq-ing/database';
import { type FC, useMemo } from 'react';
import { getTimelineQuery } from '@/components/timelines/common';
import { TimelineView } from '@/components/timelines/top-timeline';
import { type DateRange, dateRangeToQuery } from '@/composables/useDateRangePicker';
import { useChannels } from '@/hooks/useChannels';
import { useMessages, useMessagesByMultipleQueries } from '@/hooks/useMessages';
import { useUsers } from '@/hooks/useUsers';

type TopMessagesTimelineProps = {
  range?: DateRange;
};

export const TopUserMessagesTimeline: FC<TopMessagesTimelineProps> = ({ range }) => {
  const { getUsername } = useUsers();
  const timelineQuery = useMemo(() => getTimelineQuery(range), [range]);
  const groupBy = timelineQuery.groupBy;
  const rankingQuery = useMemo(
    () =>
      ({
        target: 'count',
        groupBy: 'user',
        orderBy: 'target',
        order: 'desc',
        limit: 10,
        ...(range && dateRangeToQuery(range)),
      }) satisfies MessagesQuery,
    [range],
  );
  const { messages: rankings } = useMessages(rankingQuery);
  const topUsers = useMemo(() => rankings?.slice(0, 10).map((u) => u.user) ?? [], [rankings]);
  const queries = useMemo(
    () =>
      topUsers.map(
        (u) =>
          ({
            ...timelineQuery,
            userId: u,
            ...(range && dateRangeToQuery(range)),
          }) satisfies MessagesQuery,
      ),
    [topUsers, range, timelineQuery],
  );
  const { messages } = useMessagesByMultipleQueries(queries);
  const labels = [...new Set(messages.flatMap((m) => m.map((m) => m[groupBy])))].sort((a, b) => a.localeCompare(b));
  const datasets = messages.map((message, i) => ({
    label: `@${getUsername(topUsers[i])}`,
    data: labels.map((l) => message.filter((m) => m[groupBy] <= l).reduce((acc, cur) => acc + cur.count, 0)),
  }));

  return <TimelineView labels={labels} datasets={datasets} />;
};

export const TopChannelMessagesTimeline: FC<TopMessagesTimelineProps> = ({ range }) => {
  const { getChannelName } = useChannels();
  const timelineQuery = useMemo(() => getTimelineQuery(range), [range]);
  const groupBy = timelineQuery.groupBy;
  const rankingQuery = useMemo(
    () =>
      ({
        target: 'count',
        groupBy: 'channel',
        orderBy: 'target',
        order: 'desc',
        limit: 10,
        ...(range && dateRangeToQuery(range)),
      }) satisfies MessagesQuery,
    [range],
  );
  const { messages: rankings } = useMessages(rankingQuery);
  const topChannels = useMemo(() => rankings?.slice(0, 10).map((c) => c.channel) ?? [], [rankings]);
  const queries = useMemo(
    () =>
      topChannels.map(
        (c) =>
          ({
            ...timelineQuery,
            channelId: c,
            ...(range && dateRangeToQuery(range)),
          }) satisfies MessagesQuery,
      ),
    [topChannels, range, timelineQuery],
  );
  const { messages } = useMessagesByMultipleQueries(queries);
  const labels = [...new Set(messages.flatMap((m) => m.map((m) => m[groupBy])))].sort((a, b) => a.localeCompare(b));
  const datasets = messages.map((message, i) => ({
    label: `#${getChannelName(topChannels[i])}`,
    data: labels.map((l) => message.filter((m) => m[groupBy] <= l).reduce((acc, cur) => acc + cur.count, 0)),
  }));

  return <TimelineView labels={labels} datasets={datasets} />;
};
