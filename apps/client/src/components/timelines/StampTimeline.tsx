import type { StampsQuery } from '@traq-ing/database';
import type { ChartOptions } from 'chart.js';
import { Chart as ChartJS, Filler } from 'chart.js';
import clsx from 'clsx';
import { type FC, useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { getTimelineQuery } from '@/components/timelines/common';
import { type DateRange, dateRangeToQuery } from '@/composables/useDateRangePicker';
import { useStamps } from '@/hooks/useStamps';
import { getCommonLineChartOptions, mergeOptions } from '@/lib/commonChartOptions';

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
  range?: DateRange;
};

export const StampTimeline: FC<StampTimelineProps> = ({ stampId, range }) => {
  const timelineQuery = useMemo(() => getTimelineQuery(range), [range]);
  const groupBy = timelineQuery.groupBy;
  const query = useMemo(
    () =>
      ({
        ...timelineQuery,
        stampId: stampId ?? undefined,
        ...(range && dateRangeToQuery(range)),
      }) satisfies StampsQuery,
    [stampId, range, timelineQuery],
  );
  const { stamps, loading } = useStamps(query);
  const data = {
    labels: stamps?.map((s) => s[groupBy]) ?? [],
    datasets: [
      {
        label: 'スタンプ数',
        data: stamps?.map((s) => s.count) ?? [],
      },
    ],
  };

  return <Line options={option} data={data} height={300} className={clsx(loading && 'opacity-60')} />;
};
