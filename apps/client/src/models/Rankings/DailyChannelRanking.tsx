import { useMessages } from '@/hooks/useMessages';
import { dailyTimeRangeToTime, nextDay } from '@/hooks/useTimeRange';
import { type DailyRankingProps, getCommonRankingChartOptions } from '@/models/Rankings/common';
import clsx from 'clsx';
import { type FC, useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import { channelRankingQuery, useChannelRankingData } from './channel';

export const DailyChannelRanking: FC<DailyRankingProps> = ({ range }) => {
  const query = useMemo(
    () => ({
      ...channelRankingQuery,
      after: dailyTimeRangeToTime(range),
      before: dailyTimeRangeToTime(nextDay(range)),
    }),
    [range],
  );
  const { messages, loading } = useMessages(query);

  const { data, fullChannelNames } = useChannelRankingData(messages);

  return (
    <div className={clsx(loading && 'opacity-70')}>
      <Bar
        options={getCommonRankingChartOptions(fullChannelNames)}
        data={data}
        height={300}
        className={clsx(loading && 'opacity-70')}
      />
    </div>
  );
};
