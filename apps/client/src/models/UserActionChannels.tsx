import { useChannels } from '@/hooks/useChannels';
import { useMessages } from '@/hooks/useMessages';
import { useStamps } from '@/hooks/useStamps';
import { commonBarChartOptions, mergeOptions } from '@/models/commonChartOptions';
import type { MessagesQuery, StampsQuery } from '@traq-ing/database';
import type { ChartOptions } from 'chart.js';
import { type FC, useMemo } from 'react';
import { Chart as ChartJS, BarElement } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(BarElement);

const useChartOptions = <T extends { channel: string }>(data: T[]) => {
  const { getChannelName } = useChannels();

  const option = mergeOptions(commonBarChartOptions, {
    indexAxis: 'y' as const,
    plugins: {
      tooltip: {
        enabled: true,
        axis: 'y',
        displayColors: false,
        callbacks: {
          title: (items) => `#${getChannelName(data[items[0].dataIndex].channel)}`,
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

  return { option };
};

type UserActionChannelsProps = {
  userId: string;
};

export const UserMessageChannels: FC<UserActionChannelsProps> = ({ userId }) => {
  const { getSummedChannelName } = useChannels();
  const query = useMemo(
    () =>
      ({
        userId: userId,
        groupBy: 'channel',
        limit: 20,
      }) satisfies MessagesQuery,
    [userId],
  );
  const { messages } = useMessages(query);
  const { option } = useChartOptions(messages);

  const data = {
    labels: messages.map((m) => `#${getSummedChannelName(m.channel)}`),
    datasets: [{ data: messages.map((m) => m.count) }],
  };

  return <Bar options={option} data={data} height={600} />;
};

export const UserGaveStampsChannels: FC<UserActionChannelsProps> = ({ userId }) => {
  const { getSummedChannelName } = useChannels();
  const query = useMemo(
    () =>
      ({
        userId: userId,
        groupBy: 'channel',
        limit: 20,
      }) satisfies StampsQuery,
    [userId],
  );
  const { stamps } = useStamps(query);
  const { option } = useChartOptions(stamps);

  const data = {
    labels: stamps.map((m) => `#${getSummedChannelName(m.channel)}`),
    datasets: [{ data: stamps.map((m) => m.count) }],
  };

  return <Bar options={option} data={data} height={600} />;
};
