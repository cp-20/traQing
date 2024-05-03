import { TimeSeries } from '@/components/Chart/TimeSeries';
import { MessagesQuery } from '@/features/database/repository';
import { useMessages } from '@/hooks/useMessages';
import { FC } from 'react';

const allMessagesQuery = {
  groupBy: 'month',
  orderBy: 'date',
  order: 'asc',
} satisfies MessagesQuery;

export const AllMessages: FC = () => {
  const { messages } = useMessages(allMessagesQuery);

  if (messages.length === 0) {
    return <div>loading...</div>;
  }

  return (
    <TimeSeries
      labels={messages.map(({ month }) => month)}
      datasets={[
        { label: 'messages', data: messages.map(({ count }) => count) },
      ]}
    />
  );
};
