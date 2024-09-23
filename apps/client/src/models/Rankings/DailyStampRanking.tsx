import { useStamps } from '@/hooks/useStamps';
import { dailyTimeRangeToTime, nextDay } from '@/hooks/useTimeRange';
import { StampRanking } from '@/models/Rankings/StampRanking';
import type { DailyRankingProps } from '@/models/Rankings/common';
import { stampRankingQuery, useStampRankingData } from '@/models/Rankings/stamp';
import clsx from 'clsx';
import { type FC, useMemo } from 'react';

export const DailyStampRanking: FC<DailyRankingProps> = ({ range }) => {
  const query = useMemo(
    () => ({
      ...stampRankingQuery,
      after: dailyTimeRangeToTime(range),
      before: dailyTimeRangeToTime(nextDay(range)),
    }),
    [range],
  );
  const { stamps, loading } = useStamps(query);
  const stats = useStampRankingData(stamps);

  return (
    <div className={clsx(loading && 'opacity-70')}>
      <StampRanking stats={stats} />
    </div>
  );
};
