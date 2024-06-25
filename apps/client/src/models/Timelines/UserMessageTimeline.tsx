import { useMessages } from '@/hooks/useMessages';
import { commonTimelineChartOptions } from '@/models/Timelines/common';
import { MessagesQuery } from '@traq-ing/database';
import type { ChartOptions } from 'chart.js';
import { FC, useMemo } from 'react';
import { Line } from 'react-chartjs-2';

type UserMessageTimelineProps = {
  userId: string;
};

const option = {
  ...commonTimelineChartOptions,
} satisfies ChartOptions;

export const UserMessageTimeline: FC<UserMessageTimelineProps> = ({
  userId,
}) => {
  const query = useMemo(
    () =>
      ({
        userId: userId,
        groupBy: 'month',
        orderBy: 'date',
        order: 'asc',
      } satisfies MessagesQuery),
    [userId]
  );
  const { messages } = useMessages(query);
  const data = {
    labels: messages.map((m) => m.month),
    datasets: [{ data: messages.map((m) => m.count) }],
  };

  return <Line options={option} data={data} height={300} />;
};
