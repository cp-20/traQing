import { useStamps } from '@/hooks/useStamps';
import { getCommonLineChartOptions, mergeOptions } from '@/models/commonChartOptions';
import type { StampsQuery } from '@traq-ing/database';
import type { ChartOptions } from 'chart.js';
import clsx from 'clsx';
import { useMemo, type FC } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, Filler } from 'chart.js';

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

type StampTimelineProps = {
  stampId: string | null;
};

export const StampTimeline: FC<StampTimelineProps> = ({ stampId }) => {
  const query = useMemo(
    () =>
      ({
        stampId: stampId ?? undefined,
        groupBy: 'month',
        orderBy: 'date',
        order: 'asc',
      }) satisfies StampsQuery,
    [stampId],
  );
  const { stamps, loading } = useStamps(query);
  const data = {
    labels: stamps?.map((s) => s.month) ?? [],
    datasets: [
      {
        label: 'スタンプ数',
        data: stamps?.map((s) => s.count) ?? [],
      },
    ],
  };

  return <Line options={option} data={data} height={300} className={clsx(loading && 'opacity-60')} />;
};
