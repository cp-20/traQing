import { client } from '@/features/api';
import type { StampsQuery } from '@traq-ing/database';
import { useEffect, useState } from 'react';

type Result<Q extends StampsQuery> = {
  [K in Q extends { groupBy: infer U } ? (U extends undefined ? 'day' : U) : 'day']: string;
} & { count: number };

const normalizeQuery = <Q extends StampsQuery>(query: Q) => ({
  ...query,
  after: query.after?.toISOString(),
  before: query.before?.toISOString(),
  isBot: query.isBot?.toString(),
  limit: query.limit?.toString(),
  offset: query.offset?.toString(),
});

export const fetchStamps = async <Q extends StampsQuery>(query: Q) => {
  const res = await client.stamps.$get({
    query: normalizeQuery(query),
  });
  return (await res.json()) as Result<Q>[];
};

export const useStamps = <Q extends StampsQuery>(query: Q) => {
  const [stamps, setStamps] = useState<Result<Q>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const request = async () => {
      const data = await fetchStamps(query);
      setStamps(data);
      setLoading(false);
    };

    request();
  }, [query]);

  return { stamps, loading };
};

export const useStampsByMultipleQueries = <Q extends StampsQuery>(queries: Q[]) => {
  const [stamps, setStamps] = useState<Result<Q>[][]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const fetchStamps = async () => {
      const res = await Promise.all(
        queries.map((query) =>
          client.stamps.$get({
            query: normalizeQuery(query),
          }),
        ),
      );
      const json = (await Promise.all(res.filter((r) => r.ok).map((r) => r.json()))) as Result<Q>[][];
      setStamps(json);
      setLoading(false);
    };

    fetchStamps();
  }, [queries]);

  return { stamps, loading };
};
