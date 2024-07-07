import clsx from 'clsx';
import { FC, forwardRef } from 'react';

type CardProps = {
  children: React.ReactNode;
  forwardRef?: React.Ref<HTMLDivElement>;
} & React.HTMLAttributes<HTMLDivElement>;

const CardWithoutRef: FC<CardProps> = ({
  children,
  className,
  forwardRef,
  ...props
}) => {
  return (
    <div
      className={clsx('bg-white rounded-md p-4', className)}
      {...props}
      ref={forwardRef}
    >
      {children}
    </div>
  );
};

export const Card = forwardRef<HTMLDivElement, CardProps>((props, ref) => (
  <CardWithoutRef {...props} forwardRef={ref} />
));
