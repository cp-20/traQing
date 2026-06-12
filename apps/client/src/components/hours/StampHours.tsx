import type { StampsQuery } from '@traq-ing/database';
import type { ChartOptions } from 'chart.js';
import { type FC, useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { commonHoursChartOption, commonHoursQuery, getHourDataset, hours } from '@/components/hours/common';
import { type DateRange, dateRangeToQuery } from '@/composables/useDateRangePicker';
import { useStamps } from '@/hooks/useStamps';

const option = {
  ...commonHoursChartOption,
} satisfies ChartOptions;

type Props = {
  stampId: string;
  range?: DateRange;
};

export const StampHours: FC<Props> = ({ stampId, range }) => {
  const stampsQuery = useMemo(
    () => ({ ...commonHoursQuery, stampId, ...(range && dateRangeToQuery(range)) }) satisfies StampsQuery,
    [stampId, range],
  );
  const { stamps } = useStamps(stampsQuery);

  const data = {
    labels: hours.map((h) => `${h}:00`),
    datasets: [
      {
        data: getHourDataset(stamps),
        label: 'スタンプ数',
        backgroundColor: 'rgba(34, 139, 230, 0.8)',
        borderColor: 'rgba(34, 139, 230, 0.8)',
      },
    ],
  };

  return <Line options={option} data={data} height={300} />;
};
