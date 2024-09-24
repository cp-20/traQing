import { useMessages } from '@/hooks/useMessages';
import { useStamps } from '@/hooks/useStamps';
import { mergeOptions, getCommonLineChartOptions } from '@/lib/commonChartOptions';
import type { MessagesQuery, StampsQuery } from '@traq-ing/database';
import {
  CategoryScale,
  Chart as ChartJS,
  type ChartOptions,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from 'chart.js';
import { type FC, useMemo } from 'react';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, LineElement, Tooltip, PointElement);

type UserMessageHoursProps = {
  userId: string;
};

const hours = Array.from({ length: 24 }).map((_, i) => i.toString().padStart(2, '0'));

const option = mergeOptions(getCommonLineChartOptions(false), {
  indexAxis: 'x' as const,
  plugins: {
    tooltip: {
      enabled: true,
      axis: 'y',
      displayColors: false,
    },
  },
}) satisfies ChartOptions;

export const UserMessageHours: FC<UserMessageHoursProps> = ({ userId }) => {
  const messagesQuery = useMemo(() => ({ userId, groupBy: 'hour' }) satisfies MessagesQuery, [userId]);
  const gaveStampsQuery = useMemo(() => ({ userId, groupBy: 'hour' }) satisfies StampsQuery, [userId]);
  const receivedStampsQuery = useMemo(
    () => ({ messageUserId: userId, groupBy: 'hour' }) satisfies StampsQuery,
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
