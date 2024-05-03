import { TimeSeries } from '@/components/Chart/TimeSeries';
import { MessagesQuery } from '@/features/database/repository';
import { useMessages } from '@/hooks/useMessages';
import { useDebouncedState } from '@mantine/hooks';
import { useMemo } from 'react';

const userChartQuery = {
  groupBy: 'day',
  orderBy: 'date',
  order: 'asc',
  limit: 1000,
} satisfies MessagesQuery;

export const UserChart = () => {
  const [userId, setUserId] = useDebouncedState('', 500);
  const query = useMemo(() => ({ ...userChartQuery, userId }), [userId]);
  const { messages } = useMessages(query);

  return (
    <div>
      <input type="text" onChange={(e) => setUserId(e.target.value)} />
      <TimeSeries
        labels={messages.map(({ day }) => day)}
        datasets={[{ label: userId, data: messages.map(({ count }) => count) }]}
      />
    </div>
  );
};
