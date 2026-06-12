import type { MessagesQuery, StampsQuery } from '@traq-ing/database';
import type { ChartOptions } from 'chart.js';
import { type FC, useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { commonTimelineChartOptions, getTimelineQuery } from '@/components/timelines/common';
import { type DateRange, dateRangeToQuery } from '@/composables/useDateRangePicker';
import { useMessages } from '@/hooks/useMessages';
import { useStamps } from '@/hooks/useStamps';

type UserMessageTimelineProps = {
  userId: string;
  range?: DateRange;
};

const option = {
  ...commonTimelineChartOptions,
} satisfies ChartOptions;

export const UserActionTimeline: FC<UserMessageTimelineProps> = ({ userId, range }) => {
  const timelineQuery = useMemo(() => getTimelineQuery(range), [range]);
  const groupBy = timelineQuery.groupBy;
  const messagesQuery = useMemo(
    () =>
      ({
        ...timelineQuery,
        userId: userId,
        ...(range && dateRangeToQuery(range)),
      }) satisfies MessagesQuery,
    [userId, range, timelineQuery],
  );
  const gaveStampsQuery = useMemo(
    () =>
      ({
        ...timelineQuery,
        userId: userId,
        ...(range && dateRangeToQuery(range)),
      }) satisfies StampsQuery,
    [userId, range, timelineQuery],
  );
  const receivedStampsQuery = useMemo(
    () =>
      ({
        ...timelineQuery,
        messageUserId: userId,
        ...(range && dateRangeToQuery(range)),
      }) satisfies StampsQuery,
    [userId, range, timelineQuery],
  );
  const { messages } = useMessages(messagesQuery);
  const { stamps: gaveStamps } = useStamps(gaveStampsQuery);
  const { stamps: receivedStamps } = useStamps(receivedStampsQuery);

  const labels = [
    ...new Set([
      ...messages.map((m) => m[groupBy]),
      ...gaveStamps.map((s) => s[groupBy]),
      ...receivedStamps.map((s) => s[groupBy]),
    ]).values(),
  ].sort((a, b) => a.localeCompare(b));

  const data = {
    labels,
    datasets: [
      {
        data: labels.map((label) => messages.find((m) => m[groupBy] === label)?.count ?? 0),
        label: '投稿数',
        backgroundColor: 'rgba(34, 139, 230, 0.8)',
        borderColor: 'rgba(34, 139, 230, 0.8)',
      },
      {
        data: labels.map((label) => gaveStamps.find((s) => s[groupBy] === label)?.count ?? 0),
        label: 'つけたスタンプ',
        backgroundColor: 'rgba(21, 170, 191, 0.8)',
        borderColor: 'rgba(21, 170, 191, 0.8)',
      },
      {
        data: labels.map((label) => receivedStamps.find((s) => s[groupBy] === label)?.count ?? 0),
        label: 'もらったスタンプ',
        backgroundColor: 'rgba(76, 110, 245, 0.8)',
        borderColor: 'rgba(76, 110, 245, 0.8)',
      },
    ],
  };

  return <Line options={option} data={data} height={300} />;
};
