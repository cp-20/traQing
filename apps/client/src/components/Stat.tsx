import { Card } from '@/components/Card';
import { FC, ReactNode } from 'react';

export type StatProps = {
  label: ReactNode;
  value: ReactNode;
  unit?: ReactNode;
  annotation?: ReactNode;
};

export const Stat: FC<StatProps> = ({ label, value, unit, annotation }) => {
  return (
    <Card>
      <div>
        <div className="text-sm font-bold">{label}</div>
        <div>
          <span className="text-4xl text-blue-600 font-medium">{value}</span>
          {unit && <span>{unit}</span>}
        </div>
        {annotation && <div className="text-sm mt-1">{annotation}</div>}
      </div>
    </Card>
  );
};
