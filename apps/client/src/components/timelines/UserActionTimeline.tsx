import type { MessagesQuery, StampsQuery } from '@traq-ing/database';
import type { ChartOptions } from 'chart.js';
import { type FC, useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { commonTimelineChartOptions, timelineCommonQuery } from '@/components/timelines/common';
import { useMessages } from '@/hooks/useMessages';
import { useStamps } from '@/hooks/useStamps';

type UserMessageTimelineProps = {
  userId: string;
};

const option = {
  ...commonTimelineChartOptions,
} satisfies ChartOptions;

export const UserActionTimeline: FC<UserMessageTimelineProps> = ({ userId }) => {
  const messagesQuery = useMemo(
    () =>
      ({
        ...timelineCommonQuery,
        userId: userId,
      }) satisfies MessagesQuery,
    [userId],
  );
  const gaveStampsQuery = useMemo(
    () =>
      ({
        ...timelineCommonQuery,
        userId: userId,
      }) satisfies StampsQuery,
    [userId],
  );
  const receivedStampsQuery = useMemo(
    () =>
      ({
        ...timelineCommonQuery,
        messageUserId: userId,
      }) satisfies StampsQuery,
    [userId],
  );
  const { messages } = useMessages(messagesQuery);
  const { stamps: gaveStamps } = useStamps(gaveStampsQuery);
  const { stamps: receivedStamps } = useStamps(receivedStampsQuery);

  const labels = [
    ...new Set([
      ...messages.map((m) => m.month),
      ...gaveStamps.map((s) => s.month),
      ...receivedStamps.map((s) => s.month),
    ]).values(),
  ].sort((a, b) => a.localeCompare(b));

  const data = {
    labels,
    datasets: [
      {
        data: labels.map((label) => messages.find((m) => m.month === label)?.count ?? 0),
        label: '投稿数',
        backgroundColor: 'rgba(34, 139, 230, 0.8)',
        borderColor: 'rgba(34, 139, 230, 0.8)',
      },
      {
        data: labels.map((label) => gaveStamps.find((s) => s.month === label)?.count ?? 0),
        label: 'つけたスタンプ',
        backgroundColor: 'rgba(21, 170, 191, 0.8)',
        borderColor: 'rgba(21, 170, 191, 0.8)',
      },
      {
        data: labels.map((label) => receivedStamps.find((s) => s.month === label)?.count ?? 0),
        label: 'もらったスタンプ',
        backgroundColor: 'rgba(76, 110, 245, 0.8)',
        borderColor: 'rgba(76, 110, 245, 0.8)',
      },
    ],
  };

  return <Line options={option} data={data} height={300} />;
};
