import { useMessages } from '@/hooks/useMessages';
import { dailyTimeRangeToTime, nextDay } from '@/hooks/useTimeRange';
import { FC, useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';
import { useUserRankingData, userRankingQuery } from './user';
import {
  DailyRankingProps,
  commonChartOptions,
} from '@/models/Rankings/common';
import { Bar } from 'react-chartjs-2';
import clsx from 'clsx';

ChartJS.register(CategoryScale, LinearScale, BarElement);

export const DailyUserRanking: FC<DailyRankingProps> = ({ range }) => {
  const query = useMemo(
    () => ({
      ...userRankingQuery,
      after: dailyTimeRangeToTime(range),
      before: dailyTimeRangeToTime(nextDay(range)),
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
