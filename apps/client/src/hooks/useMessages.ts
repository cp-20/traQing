import { client } from '@/features/api';
import type { MessagesQuery } from '@traq-ing/database';
import { useEffect, useState } from 'react';

type Result<Q extends MessagesQuery> = {
  [K in Q extends { groupBy: infer U } ? (U extends undefined ? 'day' : U) : 'day']: string;
} & { count: number };

const normalizeQuery = <Q extends MessagesQuery>(query: Q) => ({
  ...query,
  after: query.after?.toISOString(),
  before: query.before?.toISOString(),
  isBot: query.isBot?.toString(),
  limit: query.limit?.toString(),
  offset: query.offset?.toString(),
});

export const useMessages = <Q extends MessagesQuery>(query: Q) => {
  const [messages, setMessages] = useState<Result<Q>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const fetchMessages = async () => {
      const res = await client.messages.$get({
        query: normalizeQuery(query),
      });
      const data = (await res.json()) as Result<Q>[];
      setMessages(data);
      setLoading(false);
    };

    fetchMessages();
  }, [query]);

  return { messages, loading };
};

export const useMessagesByMultipleQueries = <Q extends MessagesQuery>(queries: Q[]) => {
  const [messages, setMessages] = useState<Result<Q>[][]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const fetchMessages = async () => {
      const res = await Promise.all(
        queries.map((query) =>
          client.messages.$get({
            query: normalizeQuery(query),
          }),
        ),
      );
      const json = (await Promise.all(res.filter((r) => r.ok).map((r) => r.json()))) as Result<Q>[][];
      setMessages(json);
      setLoading(false);
    };

    fetchMessages();
  }, [queries]);

  return { messages, loading };
};
