import { useChannels } from '@/hooks/useChannels';
import { useMessages } from '@/hooks/useMessages';
import {
  commonBarChartOptions,
  mergeOptions,
} from '@/models/commonChartOptions';
import { MessagesQuery } from '@traq-ing/database';
import type { ChartOptions } from 'chart.js';
import { FC, useMemo } from 'react';
import { Bar } from 'react-chartjs-2';

type UserMessageChannelsProps = {
  userId: string;
};

export const UserMessageChannels: FC<UserMessageChannelsProps> = ({
  userId,
}) => {
  const { getSummedChannelName, getChannelName, channels } = useChannels();
  const query = useMemo(
    () =>
      ({
        userId: userId,
        groupBy: 'channel',
        limit: 20,
      } satisfies MessagesQuery),
    [userId]
  );
  const { messages } = useMessages(query);

  if (channels.length === 0) return null;

  const option = mergeOptions(commonBarChartOptions, {
    indexAxis: 'y' as const,
    plugins: {
      tooltip: {
        enabled: true,
        axis: 'y',
        displayColors: false,
        callbacks: {
          title: (items) =>
            `#${getChannelName(messages[items[0].dataIndex].channel)}`,
        },
      },
    },
    scales: {
      y: {
        afterFit: (scaleInstance) => {
          scaleInstance.width = 150;
        },
      },
    },
  }) satisfies ChartOptions;

  const data = {
    labels: messages.map((m) => `#${getSummedChannelName(m.channel)}`),
    datasets: [{ data: messages.map((m) => m.count) }],
  };

  return <Bar options={option} data={data} height={600} />;
};
