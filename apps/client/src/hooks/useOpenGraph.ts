import { useOpenGraphData } from '@/hooks/useServerData';

export const useOpenGraph = (url: string) => {
  const { data: og } = useOpenGraphData(url);

  return og;
};
