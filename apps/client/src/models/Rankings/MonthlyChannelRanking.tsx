import { useMessages } from '@/hooks/useMessages';
import { nextMonth, monthlyTimeRangeToTime } from '@/hooks/useTimeRange';
import { type FC, useMemo } from 'react';
import { useChannelRankingData, channelRankingQuery } from './channel';
import { type MonthlyRankingProps, getCommonRankingChartOptions } from '@/models/Rankings/common';
import { Bar } from 'react-chartjs-2';
import clsx from 'clsx';

export const MonthlyChannelRanking: FC<MonthlyRankingProps> = ({ range }) => {
  const query = useMemo(
    () => ({
      ...channelRankingQuery,
      after: monthlyTimeRangeToTime(range),
      before: monthlyTimeRangeToTime(nextMonth(range)),
    }),
    [range],
  );
  const { messages, loading } = useMessages(query);

  const { data, fullChannelNames } = useChannelRankingData(messages);

  return (
    <div className={clsx(loading && 'opacity-70')}>
      <Bar options={getCommonRankingChartOptions(fullChannelNames)} data={data} height={300} />
    </div>
  );
};
