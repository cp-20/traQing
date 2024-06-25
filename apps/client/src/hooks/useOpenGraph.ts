import { client } from '@/features/api';
import { useState, useEffect } from 'react';

type OpenGraph = {
  title?: string;
  description?: string;
  origin?: string;
  image?: string;
  type: 'summary' | 'article';
};

export const useOpenGraph = (url: string) => {
  const [og, setOg] = useState<OpenGraph | null>(null);

  useEffect(() => {
    const fetchOg = async () => {
      const res = await client.og.$get({ query: { url } });
      if (!res.ok) {
        setOg(null);
        return;
      }
      const data = await res.json();
      setOg(data);
    };
    fetchOg();
  }, [url]);

  return og;
};
