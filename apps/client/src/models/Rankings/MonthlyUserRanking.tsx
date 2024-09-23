import { useMessages } from '@/hooks/useMessages';
import { monthlyTimeRangeToTime, nextMonth } from '@/hooks/useTimeRange';
import { type MonthlyRankingProps, getCommonRankingChartOptions } from '@/models/Rankings/common';
import clsx from 'clsx';
import { type FC, useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import { useUserRankingData, userRankingQuery } from './user';

export const MonthlyUserRanking: FC<MonthlyRankingProps> = ({ range }) => {
  const query = useMemo(
    () => ({
      ...userRankingQuery,
      after: monthlyTimeRangeToTime(range),
      before: monthlyTimeRangeToTime(nextMonth(range)),
    }),
    [range],
  );
  const { messages, loading } = useMessages(query);

  const data = useUserRankingData(messages);

  return (
    <div className={clsx(loading && 'opacity-70')}>
      <Bar options={getCommonRankingChartOptions()} data={data} height={300} />
    </div>
  );
};
