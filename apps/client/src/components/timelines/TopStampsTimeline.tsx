import type { StampsQuery } from '@traq-ing/database';
import type { FC } from 'react';
import { useMemo } from 'react';
import { TimelineView } from '@/components/timelines/top-timeline';
import { type DateRange, dateRangeToQuery } from '@/composables/useDateRangePicker';
import { useMessageStamps } from '@/hooks/useMessageStamps';
import { useStamps, useStampsByMultipleQueries } from '@/hooks/useStamps';

type TopStampsTimelineProps = {
  range?: DateRange;
  channelId?: string;
  gaveUserId?: string;
  receivedUserId?: string;
  limit?: number;
};

export const TopStampsTimeline: FC<TopStampsTimelineProps> = ({
  range,
  channelId,
  gaveUserId,
  receivedUserId,
  limit,
}) => {
  const { getStamp } = useMessageStamps();
  const query = useMemo(
    () =>
      ({
        channelId,
        userId: gaveUserId,
        messageUserId: receivedUserId,
        groupBy: 'stamp',
        orderBy: 'count',
        order: 'desc',
        limit: limit ?? 10,
        ...(range && dateRangeToQuery(range)),
      }) satisfies StampsQuery,
    [range, channelId, gaveUserId, receivedUserId, limit],
  );
  const { stamps: ranking } = useStamps(query);
  const topStamps = useMemo(() => ranking?.slice(0, 10).map((s) => s.stamp) ?? [], [ranking]);
  const queries = useMemo(
    () =>
      topStamps.map(
        (s) =>
          ({
            groupBy: 'month',
            orderBy: 'date',
            order: 'asc',
            stampId: s,
          }) satisfies StampsQuery,
      ),
    [topStamps],
  );
  const { stamps } = useStampsByMultipleQueries(queries);
  const labels = [...new Set(stamps.flatMap((s) => s.map((m) => m.month)))];
  const datasets = stamps.map((stamp, i) => ({
    label: getStamp(topStamps[i]) ? `:${getStamp(topStamps[i])?.name}:` : 'unknown',
    data: stamp.map((s) => stamp.filter((m) => m.month <= s.month).reduce((acc, cur) => acc + cur.count, 0)),
  }));

  return <TimelineView labels={labels} datasets={datasets} />;
};
