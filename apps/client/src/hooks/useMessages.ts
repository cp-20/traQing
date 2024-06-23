import { MessagesQuery } from '@/features/database/repository';
import { useEffect, useState } from 'react';

type Result<Q extends MessagesQuery> = {
  [K in Q extends { groupBy: infer U }
    ? U extends undefined
      ? 'day'
      : U
    : 'day']: string;
} & { count: number };

export const useMessages = <Q extends MessagesQuery>(query: Q) => {
  const [messages, setMessages] = useState<Result<Q>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const fetchMessages = async () => {
      const queryStr = encodeURIComponent(JSON.stringify(query));
      const res = await fetch(`/api/messages?query=${queryStr}`);
      const data = await res.json();
      setMessages(data);
      setLoading(false);
    };

    fetchMessages();
  }, [query, setMessages, setLoading]);

  return { messages, loading };
};
