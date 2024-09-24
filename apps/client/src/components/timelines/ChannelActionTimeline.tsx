import { commonTimelineChartOptions, timelineCommonQuery } from '@/components/timelines/common';
import { useMessages } from '@/hooks/useMessages';
import { useStamps } from '@/hooks/useStamps';
import type { MessagesQuery, StampsQuery } from '@traq-ing/database';
import type { ChartOptions } from 'chart.js';
import { type FC, useMemo } from 'react';
import { Line } from 'react-chartjs-2';

type Props = {
  channelId: string;
};

const option = {
  ...commonTimelineChartOptions,
} satisfies ChartOptions;

export const ChannelActionTimeline: FC<Props> = ({ channelId }) => {
  const messagesQuery = useMemo(
    () =>
      ({
        ...timelineCommonQuery,
        channelId,
      }) satisfies MessagesQuery,
    [channelId],
  );
  const stampsQuery = useMemo(
    () =>
      ({
        ...timelineCommonQuery,
        channelId,
      }) satisfies StampsQuery,
    [channelId],
  );
  const { messages } = useMessages(messagesQuery);
  const { stamps } = useStamps(stampsQuery);

  const labels = [...new Set([...messages.map((m) => m.month), ...stamps.map((s) => s.month)]).values()].toSorted(
    (a, b) => a.localeCompare(b),
  );

  const data = {
    labels,
    datasets: [
      {
        data: labels.map((label) => messages.find((m) => m.month === label)?.count ?? 0),
        label: '投稿数',
        backgroundColor: 'rgba(34, 139, 230, 0.8)',
        borderColor: 'rgba(34, 139, 230, 0.8)',
      },
      {
        data: labels.map((label) => stamps.find((s) => s.month === label)?.count ?? 0),
        label: 'スタンプ数',
        backgroundColor: 'rgba(21, 170, 191, 0.8)',
        borderColor: 'rgba(21, 170, 191, 0.8)',
      },
    ],
  };

  return <Line options={option} data={data} height={300} />;
};
