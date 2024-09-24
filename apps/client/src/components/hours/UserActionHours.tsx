import { commonHoursChartOption, commonHoursQuery, hours } from '@/components/hours/common';
import { useMessages } from '@/hooks/useMessages';
import { useStamps } from '@/hooks/useStamps';
import { dateRangeToQuery, type DateRange } from '@/composables/useDateRangePicker';
import type { MessagesQuery, StampsQuery } from '@traq-ing/database';
import type { ChartOptions } from 'chart.js';
import { type FC, useMemo } from 'react';
import { Line } from 'react-chartjs-2';

const option = {
  ...commonHoursChartOption,
} satisfies ChartOptions;

type Props = {
  userId: string;
  range?: DateRange;
};

export const UserActionHours: FC<Props> = ({ userId, range }) => {
  const messagesQuery = useMemo(
    () =>
      ({
        userId,
        ...commonHoursQuery,
        ...(range && dateRangeToQuery(range)),
      }) satisfies MessagesQuery,
    [userId, range],
  );
  const gaveStampsQuery = useMemo(
    () =>
      ({
        userId,
        ...commonHoursQuery,
        ...(range && dateRangeToQuery(range)),
      }) satisfies StampsQuery,
    [userId, range],
  );
  const receivedStampsQuery = useMemo(
    () =>
      ({
        messageUserId: userId,
        ...commonHoursQuery,
        ...(range && dateRangeToQuery(range)),
      }) satisfies StampsQuery,
    [userId, range],
  );
  const { messages } = useMessages(messagesQuery);
  const { stamps: gaveStamps } = useStamps(gaveStampsQuery);
  const { stamps: receivedStamps } = useStamps(receivedStampsQuery);

  const data = {
    labels: hours.map((h) => `${h}:00`),
    datasets: [
      {
        data: hours.map((h) => messages.find((m) => m.hour === h)?.count ?? 0),
        label: '投稿数',
        backgroundColor: 'rgba(34, 139, 230, 0.8)',
        borderColor: 'rgba(34, 139, 230, 0.8)',
      },
      {
        data: hours.map((h) => gaveStamps.find((s) => s.hour === h)?.count ?? 0),
        label: 'つけたスタンプ',
        backgroundColor: 'rgba(21, 170, 191, 0.8)',
        borderColor: 'rgba(21, 170, 191, 0.8)',
      },
      {
        data: hours.map((h) => receivedStamps.find((s) => s.hour === h)?.count ?? 0),
        label: 'もらったスタンプ',
        backgroundColor: 'rgba(76, 110, 245, 0.8)',
        borderColor: 'rgba(76, 110, 245, 0.8)',
      },
    ],
  };

  return <Line options={option} data={data} height={300} />;
};
