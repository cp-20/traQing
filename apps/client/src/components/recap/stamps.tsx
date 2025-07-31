import type { StampsMeanUsageQuery, StampsQuery } from '@traq-ing/database';
import { type FC, useMemo } from 'react';
import { StampRankingItem } from '@/components/rankings/stamp';
import { type CommonRecapComponentProps, RankingSkeleton, yearToQuery } from '@/components/recap/common';
import { useStamps } from '@/hooks/useStamps';
import { useStampsMeanUsage } from '@/hooks/useStampsMeanUsage';

export const TopGaveStamps: FC<CommonRecapComponentProps> = ({ userId, year }) => {
  const stampsQuery = useMemo(
    () =>
      ({
        ...yearToQuery(year),
        userId,
        groupBy: 'stamp',
        orderBy: 'count',
        order: 'desc',
      }) satisfies StampsQuery,
    [year, userId],
  );
  const { stamps, loading: stampsLoading } = useStamps(stampsQuery);
  const stampsMeanUsageQuery = useMemo(
    () =>
      ({
        ...yearToQuery(year),
        target: 'user',
      }) satisfies StampsMeanUsageQuery,
    [year],
  );
  const { usage, loading: usageLoading } = useStampsMeanUsage(stampsMeanUsageQuery);

  const meanMap = new Map<string, number>(usage.map((u) => [u.stamp, u.mean]));
  const topStamps = stamps
    .map((s) => ({
      ...s,
      mean: meanMap.get(s.stamp) ?? 1,
    }))
    .sort((a, b) => b.count / b.mean - a.count / a.mean)
    .slice(0, 10);

  if (stampsLoading || usageLoading) {
    return <RankingSkeleton length={10} />;
  }

  return (
    <div>
      {topStamps.map((s, i) => (
        <StampRankingItem
          key={s.stamp}
          stampId={s.stamp}
          rank={i + 1}
          value={`平均 x${(s.count / s.mean).toFixed(1)}`}
          rate={s.count / s.mean / (topStamps[0].count / topStamps[0].mean)}
        />
      ))}
    </div>
  );
};

export const TopReceivedStamps: FC<CommonRecapComponentProps> = ({ userId, year }) => {
  const stampsQuery = useMemo(
    () =>
      ({
        ...yearToQuery(year),
        messageUserId: userId,
        groupBy: 'stamp',
        orderBy: 'count',
        order: 'desc',
      }) satisfies StampsQuery,
    [year, userId],
  );
  const { stamps, loading: stampsLoading } = useStamps(stampsQuery);
  const stampsMeanUsageQuery = useMemo(
    () =>
      ({
        ...yearToQuery(year),
        target: 'user',
      }) satisfies StampsMeanUsageQuery,
    [year],
  );
  const { usage, loading: usageLoading } = useStampsMeanUsage(stampsMeanUsageQuery);

  const meanMap = new Map<string, number>(usage.map((u) => [u.stamp, u.mean]));
  const topStamps = stamps
    .map((s) => ({
      ...s,
      mean: meanMap.get(s.stamp) ?? 1,
    }))
    .sort((a, b) => b.count / b.mean - a.count / a.mean)
    .slice(0, 10);

  if (stampsLoading || usageLoading) {
    return <RankingSkeleton length={10} />;
  }

  return (
    <div>
      {topStamps.map((s, i) => (
        <StampRankingItem
          key={s.stamp}
          stampId={s.stamp}
          rank={i + 1}
          value={`平均 x${(s.count / s.mean).toFixed(1)}`}
          rate={s.count / s.mean / (topStamps[0].count / topStamps[0].mean)}
        />
      ))}
    </div>
  );
};
