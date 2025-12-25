import type { FC } from 'react';
import { RankingItemSkeleton } from '@/components/rankings';
import { type DateRange, dateRangeToQuery } from '@/composables/useDateRangePicker';

export type CommonRecapComponentProps = {
  userId: string;
  year: number;
};

export const yearToDateRange = (year: number) => {
  const start = new Date(`${year}-01-01T00:00:00.000+00:00`);
  const end = new Date(`${year}-12-31T23:59:59.999+00:00`);
  return [start, end] satisfies DateRange;
};

export const yearToQuery = (year: number) => dateRangeToQuery(yearToDateRange(year));

export const RankingSkeleton: FC<{ length: number }> = ({ length }) => (
  <div className="flex flex-col">
    {[...Array(length)].map((_, i) => (
      <RankingItemSkeleton key={i} rank={i + 1} />
    ))}
  </div>
);
