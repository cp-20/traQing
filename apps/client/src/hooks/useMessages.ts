import type { GetMessagesResult, MessagesQuery } from '@traq-ing/database';
import { useEffect, useState } from 'react';
import { client } from '@/features/api';

type Result<Q extends MessagesQuery> = Awaited<GetMessagesResult<Q>>;

export const normalizeMessagesQuery = <Q extends MessagesQuery>(query: Q) => ({
  ...query,
  after: query.after?.toISOString(),
  before: query.before?.toISOString(),
  isBot: query.isBot?.toString(),
  limit: query.limit?.toString(),
  offset: query.offset?.toString(),
});

export const fetchMessages = async <Q extends MessagesQuery>(query: Q) => {
  const res = await client.messages.$get({
    query: normalizeMessagesQuery(query),
  });
  return (await res.json()) as Result<Q>;
};

export const useMessages = <Q extends MessagesQuery>(query: Q) => {
  const [messages, setMessages] = useState<Result<Q>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const request = async () => {
      const data = await fetchMessages(query);
      setMessages(data);
      setLoading(false);
    };

    request();
  }, [query]);

  return { messages, loading };
};

export const useMessagesByMultipleQueries = <Q extends MessagesQuery>(queries: Q[]) => {
  const [messages, setMessages] = useState<Result<Q>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const fetchMessages = async () => {
      const res = await Promise.all(
        queries.map((query) =>
          client.messages.$get({
            query: normalizeMessagesQuery(query),
          }),
        ),
      );
      const json = (await Promise.all(res.filter((r) => r.ok).map((r) => r.json()))) as Result<Q>[];
      setMessages(json);
      setLoading(false);
    };

    fetchMessages();
  }, [queries]);

  return { messages, loading };
};
