import { Paper } from '@mantine/core';
import { type FC, forwardRef } from 'react';

type CardProps = {
  children: React.ReactNode;
  forwardRef?: React.Ref<HTMLDivElement>;
} & React.HTMLAttributes<HTMLDivElement>;

const CardWithoutRef: FC<CardProps> = ({ children, className, forwardRef, ...props }) => {
  return (
    <Paper className={className} component="section" p="md" radius="sm" withBorder {...props} ref={forwardRef}>
      {children}
    </Paper>
  );
};

export const Card = forwardRef<HTMLDivElement, CardProps>((props, ref) => (
  <CardWithoutRef {...props} forwardRef={ref} />
));
