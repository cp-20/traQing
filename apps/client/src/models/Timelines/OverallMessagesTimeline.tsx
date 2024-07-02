import { useMessagesTimelineData } from '@/hooks/useServerData';
import {
  getCommonLineChartOptions,
  mergeOptions,
} from '@/models/commonChartOptions';
import { Chart as ChartJS, ChartOptions, Filler } from 'chart.js';
import type { FC } from 'react';
import { Line } from 'react-chartjs-2';

ChartJS.register(Filler);

const option = mergeOptions(getCommonLineChartOptions(true), {
  plugins: {
    tooltip: {
      enabled: true,
      axis: 'y',
      displayColors: false,
    },
  },
} satisfies ChartOptions);

export const OverallMessagesTimeline: FC = () => {
  const { data: messages } = useMessagesTimelineData();
  const data = {
    labels: messages?.map((m) => m.month) ?? [],
    datasets: [
      {
        label: '投稿数',
        data:
          messages
            ?.map((m) => m.count)
            .map((_, i, arr) =>
              arr.slice(0, i + 1).reduce((acc, cur) => acc + cur, 0)
            ) ?? [],
      },
    ],
  };

  return <Line options={option} data={data} height={300} />;
};
