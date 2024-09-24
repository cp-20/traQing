import { commonHoursChartOption, commonHoursQuery, hours } from '@/components/hours/common';
import { useMessages } from '@/hooks/useMessages';
import { useStamps } from '@/hooks/useStamps';
import type { MessagesQuery, StampsQuery } from '@traq-ing/database';
import type { ChartOptions } from 'chart.js';
import { type FC, useMemo } from 'react';
import { Line } from 'react-chartjs-2';

const option = {
  ...commonHoursChartOption,
} satisfies ChartOptions;

type Props = {
  userId: string;
};

export const UserActionHours: FC<Props> = ({ userId }) => {
  const messagesQuery = useMemo(() => ({ ...commonHoursQuery, userId }) satisfies MessagesQuery, [userId]);
  const gaveStampsQuery = useMemo(() => ({ ...commonHoursQuery, userId }) satisfies StampsQuery, [userId]);
  const receivedStampsQuery = useMemo(
    () => ({ ...commonHoursQuery, messageUserId: userId }) satisfies StampsQuery,
    [userId],
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
