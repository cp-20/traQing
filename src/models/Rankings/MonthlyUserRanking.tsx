import { useMessages } from '@/hooks/useMessages';
import { nextMonth, monthlyTimeRangeToTime } from '@/hooks/useTimeRange';
import { FC, useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';
import { useUserRankingData, userRankingQuery } from './user';
import clsx from 'clsx';
import {
  MonthlyRankingProps,
  commonChartOptions,
} from '@/models/Rankings/common';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement);

export const MonthlyUserRanking: FC<MonthlyRankingProps> = ({ range }) => {
  const query = useMemo(
    () => ({
      ...userRankingQuery,
      after: monthlyTimeRangeToTime(range),
      before: monthlyTimeRangeToTime(nextMonth(range)),
    }),
    [range]
  );
  const { messages, loading } = useMessages(query);

  const data = useUserRankingData(messages);

  return (
    <div className={clsx(loading && 'opacity-70')}>
      <Bar options={commonChartOptions} data={data} height={300} />
    </div>
  );
};
