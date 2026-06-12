import { Badge } from '@mantine/core';
import type { FC, ReactNode } from 'react';

type PeriodBadgeProps = {
  kind: 'all' | 'selected';
  label?: ReactNode;
};

export const PeriodBadge: FC<PeriodBadgeProps> = ({ kind, label }) => (
  <Badge color={kind === 'selected' ? 'blue' : 'cyan'} variant="light">
    {label ?? (kind === 'selected' ? '選択期間' : '全期間')}
  </Badge>
);
