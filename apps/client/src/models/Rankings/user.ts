import { MessagesQuery } from '@traq-ing/database';
import { useUsers } from '@/hooks/useUsers';

export const userRankingQuery = {
  groupBy: 'user',
  orderBy: 'count',
  order: 'desc',
  limit: 10,
} satisfies MessagesQuery;

export const useUserRankingData = (
  messages: { user: string; count: number }[]
) => {
  const { getUsername, users } = useUsers();
  if (messages.length === 0 || users === undefined) {
    const emptyArray = new Array(userRankingQuery.limit);
    return {
      labels: emptyArray,
      datasets: [{ data: emptyArray.fill(0) }],
    };
  }

  const sorted = messages.toSorted((a, b) => b.count - a.count);
  const stats = sorted.map((stat) => ({
    name: getUsername(stat.user),
    count: stat.count,
  }));

  const data = {
    labels: stats.map((stat) => `@${stat.name}`),
    datasets: [{ data: stats.map((stat) => stat.count) }],
  };

  return data;
};
