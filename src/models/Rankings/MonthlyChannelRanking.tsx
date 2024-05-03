import { useMessages } from '@/hooks/useMessages';
import { nextMonth, monthlyTimeRangeToTime } from '@/hooks/useTimeRange';
import { FC, useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';
import { useChannelRankingData, channelRankingQuery } from './channel';
import {
  MonthlyRankingProps,
  commonChartOptions,
} from '@/models/Rankings/common';
import { Bar } from 'react-chartjs-2';
import clsx from 'clsx';

ChartJS.register(CategoryScale, LinearScale, BarElement);

export const MonthlyChannelRanking: FC<MonthlyRankingProps> = ({ range }) => {
  const query = useMemo(
    () => ({
      ...channelRankingQuery,
      after: monthlyTimeRangeToTime(range),
      before: monthlyTimeRangeToTime(nextMonth(range)),
    }),
    [range]
  );
  const { messages, loading } = useMessages(query);

  const data = useChannelRankingData(messages);

  return (
    <div className={clsx(loading && 'opacity-70')}>
      <Bar options={commonChartOptions} data={data} height={300} />
    </div>
  );
};
