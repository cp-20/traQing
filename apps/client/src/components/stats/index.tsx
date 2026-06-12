import { Skeleton } from '@mantine/core';
import clsx from 'clsx';
import type { ComponentProps, FC, ReactNode } from 'react';
import { Card } from '@/components/Card';
import { PeriodBadge } from '@/components/PeriodBadge';

export type StatProps = {
  label: ReactNode;
  value: ReactNode;
  valueProps?: ComponentProps<'span'>;
  unit?: ReactNode;
  annotation?: ReactNode;
};

export const Stat: FC<StatProps> = ({ label, value, unit, annotation, valueProps }) => {
  return (
    <Card className="h-32">
      <div className="flex h-full flex-col justify-between">
        <div className="flex justify-between items-center">
          <div className="traqing-stat-label text-sm font-semibold">{label}</div>
          <PeriodBadge kind="all" />
        </div>
        <div>
          <span {...valueProps} className={clsx(valueProps?.className, 'traqing-stat-value text-4xl font-semibold')}>
            {value}
          </span>
          {unit && <span>{unit}</span>}
        </div>
        {annotation && <div className="text-sm mt-1">{annotation}</div>}
      </div>
    </Card>
  );
};

export type StatSkeletonProps = {
  label: ReactNode;
};

export const StatSkeleton: FC<StatSkeletonProps> = ({ label }) => (
  <Stat
    label={label}
    value={
      <div className="h-10 flex items-center">
        <Skeleton h={32} />
      </div>
    }
    annotation={
      <div className="h-5 flex items-center">
        <Skeleton h={16} />
      </div>
    }
  />
);
