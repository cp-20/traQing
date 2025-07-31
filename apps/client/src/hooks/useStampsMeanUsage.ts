import type { StampsMeanUsageQuery } from '@traq-ing/database';
import { useEffect, useState } from 'react';
import { client } from '@/features/api';

export const normalizeStampsMeanUsageQuery = <Q extends StampsMeanUsageQuery>(query: Q) => ({
  ...query,
  after: query.after?.toISOString(),
  before: query.before?.toISOString(),
  isBot: query.isBot?.toString(),
});

export const fetchStampsMeanUsage = async <Q extends StampsMeanUsageQuery>(query: Q) => {
  const res = await client['stamps-mean-usage'].$get({
    query: normalizeStampsMeanUsageQuery(query),
  });
  return await res.json();
};

type Result = {
  stamp: string;
  mean: number;
};

export const useStampsMeanUsage = (query: StampsMeanUsageQuery) => {
  const [usage, setUsage] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const request = async () => {
      const data = await fetchStampsMeanUsage(query);
      setUsage(data);
      setLoading(false);
    };

    request();
  }, [query]);

  return { usage, loading };
};
