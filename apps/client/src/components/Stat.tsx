import { FC, ReactNode } from 'react';

export type StatProps = {
  label: ReactNode;
  value: ReactNode;
  unit?: ReactNode;
  annotation?: ReactNode;
};

export const Stat: FC<StatProps> = ({ label, value, unit, annotation }) => {
  return (
    <div className="border rounded-md p-4">
      <div>
        <div className="text-sm">{label}</div>
        <div>
          <span className="text-3xl text-blue-600 font-medium">{value}</span>
          {unit && <span>{unit}</span>}
        </div>
        {annotation && <div className="text-xs mt-1">{annotation}</div>}
      </div>
    </div>
  );
};
