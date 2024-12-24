import { RankingItemSkeleton } from '@/components/rankings';
import { dateRangeToQuery } from '@/composables/useDateRangePicker';
import type { FC } from 'react';

export type CommonRecapComponentProps = {
  userId: string;
  year: number;
};

export const yearToQuery = (year: number) => {
  const start = new Date(`${year}-01-01T00:00:00+00:00`);
  const end = new Date(`${year}-12-31T23:59:59+00:00`);
  return dateRangeToQuery([start, end]);
};

export const RankingSkeleton: FC<{ length: number }> = ({ length }) => (
  <div className="flex flex-col">
    {[...Array(length)].map((_, i) => (
      <RankingItemSkeleton key={i} rank={i + 1} />
    ))}
  </div>
);
