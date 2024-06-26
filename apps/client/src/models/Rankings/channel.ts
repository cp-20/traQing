import { MessagesQuery } from '@traq-ing/database';
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
  const { getChannelName, getSummedChannelName, channels } = useChannels();

  if (messages.length === 0 || channels === undefined) {
    const emptyArray = new Array(channelRankingQuery.limit).fill('');
    const data = {
      labels: emptyArray,
      datasets: [{ data: emptyArray.fill(0) }],
    };
    return { data, fullChannelNames: emptyArray };
  }

  const sorted = messages.toSorted((a, b) => b.count - a.count);
  const stats = sorted.map((stat) => ({
    channelName: getSummedChannelName(stat.channel),
    fullChannelName: getChannelName(stat.channel),
    count: stat.count,
  }));

  const data = {
    labels: stats.map((stat) => `#${stat.channelName}`),
    datasets: [{ data: stats.map((stat) => stat.count) }],
  };

  const fullChannelNames = stats.map((stat) => `#${stat.fullChannelName}`);

  return { data, fullChannelNames };
};
