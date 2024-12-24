import { client } from '@/features/api';
import type { MessageContentsQuery } from '@traq-ing/database';
import { useState, useEffect } from 'react';

export const normalizeMessagesQuery = <Q extends MessageContentsQuery>(query: Q) => ({
  ...query,
  after: query.after?.toISOString(),
  before: query.before?.toISOString(),
  isBot: query.isBot?.toString(),
  limit: query.limit?.toString(),
});

export const fetchMessageContents = async <Q extends MessageContentsQuery>(query: Q) => {
  const res = await client['message-contents'].$get({
    query: normalizeMessagesQuery(query),
  });
  return await res.json();
};

type Result = {
  text: string;
  value: number;
};

export const useMessageContents = (query: Omit<MessageContentsQuery, 'offset'>) => {
  const [contents, setMessageContents] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const request = async () => {
      const data = await fetchMessageContents(query);
      setMessageContents(data.map(([word, count]) => ({ text: word, value: count })));
      setLoading(false);
    };

    request();
  }, [query]);

  return { contents, loading };
};
