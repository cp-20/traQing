import { useStamps } from '@/hooks/useStamps';
import { monthlyTimeRangeToTime, nextMonth } from '@/hooks/useTimeRange';
import { StampRanking } from '@/models/Rankings/StampRanking';
import type { MonthlyRankingProps } from '@/models/Rankings/common';
import { stampRankingQuery, useStampRankingData } from '@/models/Rankings/stamp';
import clsx from 'clsx';
import { type FC, useMemo } from 'react';

export const MonthlyStampRanking: FC<MonthlyRankingProps> = ({ range }) => {
  const query = useMemo(
    () => ({
      ...stampRankingQuery,
      after: monthlyTimeRangeToTime(range),
      before: monthlyTimeRangeToTime(nextMonth(range)),
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
