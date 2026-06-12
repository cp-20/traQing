import { Badge } from '@mantine/core';
import type { FC } from 'react';

type PeriodBadgeProps = {
  kind: 'all' | 'selected';
};

export const PeriodBadge: FC<PeriodBadgeProps> = ({ kind }) => (
  <Badge color={kind === 'selected' ? 'blue' : 'cyan'} variant="light">
    {kind === 'selected' ? '選択期間' : '全期間'}
  </Badge>
);
