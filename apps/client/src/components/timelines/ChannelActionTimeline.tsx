import type { MessagesQuery, StampsQuery } from '@traq-ing/database';
import type { ChartOptions } from 'chart.js';
import { type FC, useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { commonTimelineChartOptions, getTimelineQuery } from '@/components/timelines/common';
import { type DateRange, dateRangeToQuery } from '@/composables/useDateRangePicker';
import { useMessages } from '@/hooks/useMessages';
import { useStamps } from '@/hooks/useStamps';

type Props = {
  channelId: string;
  range?: DateRange;
};

const option = {
  ...commonTimelineChartOptions,
} satisfies ChartOptions;

export const ChannelActionTimeline: FC<Props> = ({ channelId, range }) => {
  const timelineQuery = useMemo(() => getTimelineQuery(range), [range]);
  const groupBy = timelineQuery.groupBy;
  const messagesQuery = useMemo(
    () =>
      ({
        ...timelineQuery,
        channelId,
        ...(range && dateRangeToQuery(range)),
      }) satisfies MessagesQuery,
    [channelId, range, timelineQuery],
  );
  const stampsQuery = useMemo(
    () =>
      ({
        ...timelineQuery,
        channelId,
        ...(range && dateRangeToQuery(range)),
      }) satisfies StampsQuery,
    [channelId, range, timelineQuery],
  );
  const { messages } = useMessages(messagesQuery);
  const { stamps } = useStamps(stampsQuery);

  const combined = [...messages.map((m) => m[groupBy]), ...stamps.map((s) => s[groupBy])];
  const labels = [...new Set(combined)].sort((a, b) => a.localeCompare(b));

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
        data: labels.map((label) => stamps.find((s) => s[groupBy] === label)?.count ?? 0),
        label: 'スタンプ数',
        backgroundColor: 'rgba(21, 170, 191, 0.8)',
        borderColor: 'rgba(21, 170, 191, 0.8)',
      },
    ],
  };

  return <Line options={option} data={data} height={300} />;
};
