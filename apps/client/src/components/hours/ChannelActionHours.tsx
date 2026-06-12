import type { MessagesQuery, StampsQuery } from '@traq-ing/database';
import type { ChartOptions } from 'chart.js';
import { type FC, useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { commonHoursChartOption, commonHoursQuery, getHourDataset, hours } from '@/components/hours/common';
import { type DateRange, dateRangeToQuery } from '@/composables/useDateRangePicker';
import { useMessages } from '@/hooks/useMessages';
import { useStamps } from '@/hooks/useStamps';

const option = {
  ...commonHoursChartOption,
} satisfies ChartOptions;

type Props = {
  channelId: string;
  range?: DateRange;
};

export const ChannelActionHours: FC<Props> = ({ channelId, range }) => {
  const messagesQuery = useMemo(
    () => ({ ...commonHoursQuery, channelId, ...(range && dateRangeToQuery(range)) }) satisfies MessagesQuery,
    [channelId, range],
  );
  const stampsQuery = useMemo(
    () => ({ ...commonHoursQuery, channelId, ...(range && dateRangeToQuery(range)) }) satisfies StampsQuery,
    [channelId, range],
  );
  const { messages } = useMessages(messagesQuery);
  const { stamps } = useStamps(stampsQuery);

  const data = {
    labels: hours.map((h) => `${h}:00`),
    datasets: [
      {
        data: getHourDataset(messages),
        label: '投稿数',
        backgroundColor: 'rgba(34, 139, 230, 0.8)',
        borderColor: 'rgba(34, 139, 230, 0.8)',
      },
      {
        data: getHourDataset(stamps),
        label: 'スタンプ数',
        backgroundColor: 'rgba(21, 170, 191, 0.8)',
        borderColor: 'rgba(21, 170, 191, 0.8)',
      },
    ],
  };

  return <Line options={option} data={data} height={300} />;
};
