import { MessagesQuery } from '@/features/database/repository';
import { useChannels } from '@/hooks/useChannels';

export const channelRankingQuery = {
  groupBy: 'channel',
  orderBy: 'count',
  order: 'desc',
  limit: 10,
} satisfies MessagesQuery;

export const useChannelRankingData = (
  messages: { channel: string; count: number }[]
) => {
  const { getSummedChannelName, channels } = useChannels();

  if (messages.length === 0 || channels.length === 0) {
    const emptyArray = new Array(channelRankingQuery.limit);
    return {
      labels: emptyArray,
      datasets: [{ data: emptyArray.fill(0) }],
    };
  }

  const sorted = messages.toSorted((a, b) => b.count - a.count);
  const stats = sorted.map((stat) => ({
    channelName: getSummedChannelName(stat.channel),
    count: stat.count,
  }));

  const data = {
    labels: stats.map((stat) => `#${stat.channelName}`),
    datasets: [{ data: stats.map((stat) => stat.count) }],
  };

  return data;
};
