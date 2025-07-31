import { Chart as ChartJS, type ChartOptions, Legend } from 'chart.js';
import type { FC } from 'react';
import { Line } from 'react-chartjs-2';
import { commonTimelineChartOptions } from '@/components/timelines/common';
import { mergeOptions } from '@/lib/commonChartOptions';

ChartJS.register(Legend);

const colors = [
  '#fa525299',
  '#be4bdb99',
  '#7950f299',
  '#4c6ef599',
  '#15aabf99',
  '#12b88699',
  '#40c05799',
  '#82c91e99',
  '#fab00599',
  '#fd7e1499',
];

const options = mergeOptions(commonTimelineChartOptions, {
  plugins: {
    legend: {
      display: true,
      position: 'bottom',
      align: 'start',
      labels: {
        usePointStyle: true,
        boxWidth: 10,
        boxHeight: 10,
      },
    },
  },
} satisfies ChartOptions);

type TimelineViewProps = {
  labels: string[];
  datasets: { label: string; data: number[] }[];
};

export const TimelineView: FC<TimelineViewProps> = ({ labels, datasets }) => {
  const data = {
    labels,
    datasets: datasets.map(({ label, data }, i) => ({
      label,
      data,
      borderColor: colors[i],
      backgroundColor: colors[i],
    })),
  };

  return <Line data={data} options={options} height={300} />;
};
