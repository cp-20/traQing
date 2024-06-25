import { useMessages } from '@/hooks/useMessages';
import {
  commonBarChartOptions,
  mergeOptions,
} from '@/models/commonChartOptions';
import { MessagesQuery } from '@traq-ing/database';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  type ChartOptions,
} from 'chart.js';
import { FC, useMemo } from 'react';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

type UserMessageHoursProps = {
  userId: string;
};

const hours = Array.from({ length: 24 }).map((_, i) =>
  i.toString().padStart(2, '0')
);

const option = mergeOptions(commonBarChartOptions, {
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
  const query = useMemo(
    () => ({ userId, groupBy: 'hour' } satisfies MessagesQuery),
    [userId]
  );
  const { messages } = useMessages(query);

  const data = {
    labels: hours.map((h) => `${h}:00`),
    datasets: [
      {
        data: hours.map((h) => messages.find((m) => m.hour === h)?.count ?? 0),
      },
    ],
  };

  return <Bar options={option} data={data} height={300} />;
};
