import { useMessages } from '@/hooks/useMessages';
import { dailyTimeRangeToTime, nextDay } from '@/hooks/useTimeRange';
import { FC, useMemo } from 'react';
import { channelRankingQuery, useChannelRankingData } from './channel';
import {
  DailyRankingProps,
  getCommonChartOptions,
} from '@/models/Rankings/common';
import { Bar } from 'react-chartjs-2';
import clsx from 'clsx';

export const DailyChannelRanking: FC<DailyRankingProps> = ({ range }) => {
  const query = useMemo(
    () => ({
      ...channelRankingQuery,
      after: dailyTimeRangeToTime(range),
      before: dailyTimeRangeToTime(nextDay(range)),
    }),
    [range]
  );
  const { messages, loading } = useMessages(query);

  const { data, fullChannelNames } = useChannelRankingData(messages);

  return (
    <div className={clsx(loading && 'opacity-70')}>
      <Bar
        options={getCommonChartOptions(fullChannelNames)}
        data={data}
        height={200}
        className={clsx(loading && 'opacity-70')}
      />
    </div>
  );
};
