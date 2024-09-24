import { Card } from '@/components/Card';
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
