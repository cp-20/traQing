import { client } from '@/features/api';
import type { StampsQuery } from '@traq-ing/database';
import { useEffect, useState } from 'react';

type Result<Q extends StampsQuery> = {
  [K in Q extends { groupBy: infer U } ? (U extends undefined ? 'day' : U) : 'day']: string;
} & { count: number };

export const useStamps = <Q extends StampsQuery>(query: Q) => {
  const [stamps, setStamps] = useState<Result<Q>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const fetchStamps = async () => {
      const res = await client.stamps.$get({
        query: {
          ...query,
          limit: query.limit?.toString(),
          offset: query.offset?.toString(),
        },
      });
      const data = (await res.json()) as Result<Q>[];
      setStamps(data);
      setLoading(false);
    };

    fetchStamps();
  }, [query, setStamps, setLoading]);

  return { stamps, loading };
};
