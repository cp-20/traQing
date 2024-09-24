import { Card } from '@/components/Card';
import { Skeleton } from '@mantine/core';
import clsx from 'clsx';
import type { ComponentProps, FC, ReactNode } from 'react';

export type StatProps = {
  label: ReactNode;
  value: ReactNode;
  valueProps?: ComponentProps<'span'>;
  unit?: ReactNode;
  annotation?: ReactNode;
};

export const Stat: FC<StatProps> = ({ label, value, unit, annotation, valueProps }) => {
  return (
    <Card>
      <div>
        <div className="text-sm font-bold">{label}</div>
        <div>
          <span {...valueProps} className={clsx('text-4xl text-blue-600 font-medium', valueProps?.className)}>
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
