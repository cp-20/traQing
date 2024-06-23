import { StampsQuery } from '@/features/database/repository';
import { useEffect, useState } from 'react';

type Result<Q extends StampsQuery> = {
  [K in Q extends { groupBy: infer U }
    ? U extends undefined
      ? 'day'
      : U
    : 'day']: string;
} & { count: number };

export const useStamps = <Q extends StampsQuery>(query: Q) => {
  const [stamps, setStamps] = useState<Result<Q>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const fetchStamps = async () => {
      const queryStr = encodeURIComponent(JSON.stringify(query));
      const res = await fetch(`/api/stamps?query=${queryStr}`);
      const data = await res.json();
      setStamps(data);
      setLoading(false);
    };

    fetchStamps();
  }, [query, setStamps, setLoading]);

  return { stamps, loading };
};
