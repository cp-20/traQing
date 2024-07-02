import { useMessagesByMultipleQueries } from '@/hooks/useMessages';
import { useMessagesRanking } from '@/hooks/useServerData';
import { useUsers } from '@/hooks/useUsers';
import { commonTimelineChartOptions } from '@/models/Timelines/common';
import { MessagesQuery } from '@traq-ing/database';
import { FC, useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, ChartOptions, Legend } from 'chart.js';
import { mergeOptions } from '@/models/commonChartOptions';

ChartJS.register(Legend);

const colors = [
  '#fa525299',
  '#be4bdb99',
  '#7950f299',
  '#4c6ef599',
  '#15aabf99',
  '#12b88699',
  '#40c05799',
  '#82c91e99',
  '#fab00599',
  '#fd7e1499',
];

const options = mergeOptions(commonTimelineChartOptions, {
  plugins: {
    legend: {
      display: true,
      position: 'bottom',
      align: 'start',
      labels: {
        usePointStyle: true,
        boxWidth: 10,
        boxHeight: 10,
      },
    },
  },
} satisfies ChartOptions);

export const TopUserMessagesTimeline: FC = () => {
  const { getUsername } = useUsers();
  const { data: rankings } = useMessagesRanking();
  const topUsers = useMemo(
    () => rankings?.slice(0, 10).map((u) => u.user) ?? [],
    [rankings]
  );
  const queries = useMemo(
    () =>
      topUsers.map(
        (u) =>
          ({
            userId: u,
            groupBy: 'month',
            orderBy: 'date',
            order: 'asc',
          } satisfies MessagesQuery)
      ),
    [topUsers]
  );
  const { messages } = useMessagesByMultipleQueries(queries);
  const labels = [
    ...new Set(messages.flatMap((m) => m.map((m) => m.month))),
  ].toSorted((a, b) => a.localeCompare(b));
  const data = {
    labels,
    datasets: messages.map((message, i) => ({
      label: `@${getUsername(topUsers[i])}`,
      data: labels.map((l) =>
        message
          .filter((m) => m.month <= l)
          .reduce((acc, cur) => acc + cur.count, 0)
      ),
      borderColor: colors[i],
      backgroundColor: colors[i],
    })),
  };

  return <Line data={data} options={options} height={300} />;
};
