import { type OpenGraph, useOpenGraphData } from '@/hooks/useServerData';

type FetchedOpenGraph =
  | {
      status: 'loading';
    }
  | {
      status: 'success';
      data: OpenGraph;
    }
  | {
      status: 'error';
      error: string;
    };

export const useOpenGraph = (url: string): FetchedOpenGraph => {
  const { data: og, isLoading } = useOpenGraphData(url);

  if (isLoading && og === undefined) {
    return { status: 'loading' };
  }
  if (og) {
    return { status: 'success', data: og };
  }
  return { status: 'error', error: 'Open Graph data could not be fetched.' };
};
