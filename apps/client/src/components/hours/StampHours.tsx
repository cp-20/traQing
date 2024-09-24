import { commonHoursChartOption, commonHoursQuery, hours } from '@/components/hours/common';
import { useStamps } from '@/hooks/useStamps';
import type { StampsQuery } from '@traq-ing/database';
import type { ChartOptions } from 'chart.js';
import { type FC, useMemo } from 'react';
import { Line } from 'react-chartjs-2';

const option = {
  ...commonHoursChartOption,
} satisfies ChartOptions;

type Props = {
  stampId: string;
};

export const StampHours: FC<Props> = ({ stampId }) => {
  const stampsQuery = useMemo(() => ({ ...commonHoursQuery, stampId }) satisfies StampsQuery, [stampId]);
  const { stamps } = useStamps(stampsQuery);

  const data = {
    labels: hours.map((h) => `${h}:00`),
    datasets: [
      {
        data: hours.map((h) => stamps.find((s) => s.hour === h)?.count ?? 0),
        label: 'スタンプ数',
        backgroundColor: 'rgba(34, 139, 230, 0.8)',
        borderColor: 'rgba(34, 139, 230, 0.8)',
      },
    ],
  };

  return <Line options={option} data={data} height={300} />;
};
