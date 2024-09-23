import { useMessages } from '@/hooks/useMessages';
import { dailyTimeRangeToTime, nextDay } from '@/hooks/useTimeRange';
import { type DailyRankingProps, getCommonRankingChartOptions } from '@/models/Rankings/common';
import clsx from 'clsx';
import { type FC, useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import { useUserRankingData, userRankingQuery } from './user';

export const DailyUserRanking: FC<DailyRankingProps> = ({ range }) => {
  const query = useMemo(
    () => ({
      ...userRankingQuery,
      after: dailyTimeRangeToTime(range),
      before: dailyTimeRangeToTime(nextDay(range)),
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
