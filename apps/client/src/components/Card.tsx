import clsx from 'clsx';
import { FC } from 'react';

type CardProps = {
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

export const Card: FC<CardProps> = ({ children, className, ...props }) => {
  return (
    <div className={clsx('bg-white rounded-md p-4', className)} {...props}>
      {children}
    </div>
  );
};
