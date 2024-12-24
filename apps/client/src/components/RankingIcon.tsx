import { IconCrown } from '@tabler/icons-react';
import type { FC } from 'react';

export const rankColors = ['orange', 'silver', 'indianred'];

export const RankingIcon: FC<{ rank: number; size?: number }> = ({ rank, size }) => (
  <IconCrown fill={rankColors[rank - 1]} color={rankColors[rank - 1]} size={size} />
);
