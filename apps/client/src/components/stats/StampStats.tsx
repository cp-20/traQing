import type { StampsQuery } from '@traq-ing/database';
import { type FC, useMemo } from 'react';
import { Stat, StatSkeleton } from '@/components/stats';
import { type DateRange, dateRangeToQuery } from '@/composables/useDateRangePicker';
import { useStampRanking } from '@/hooks/useServerData';
import { useStamps } from '@/hooks/useStamps';

type StampStatsProps = {
  stampId: string;
};

export const StampCountStat: FC<StampStatsProps> = ({ stampId }) => {
  const { data: stamps } = useStampRanking();
  if (stamps === undefined) return <StatSkeleton label="押された回数 (合計)" />;
  const index = stamps.findIndex((s) => s.stamp === stampId);

  if (index === -1) {
    return <Stat label="押された回数 (合計)" value={0} />;
  }

  return <Stat label="押された回数 (合計)" value={stamps[index].count} annotation={`全体${index + 1}位`} />;
};

type RangeStampCountStatProps = {
  label: string;
  range: DateRange;
} & StampStatsProps;

export const RangeStampCountStat: FC<RangeStampCountStatProps> = ({ stampId, label, range }) => {
  const query = useMemo(
    () =>
      ({
        groupBy: 'stamp',
        orderBy: 'count',
        order: 'desc',
        ...dateRangeToQuery(range),
      }) satisfies StampsQuery,
    [range],
  );
  const { stamps, loading } = useStamps(query);
  if (loading && stamps.length === 0) return <StatSkeleton label={label} />;
  const index = stamps.findIndex((s) => s.stamp === stampId);

  if (index === -1) {
    return <Stat label={label} value={0} />;
  }

  return <Stat label={label} value={stamps[index].count} annotation={`全体${index + 1}位`} />;
};
