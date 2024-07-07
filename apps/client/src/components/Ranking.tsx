import { Skeleton } from '@mantine/core';
import { IconCrown } from '@tabler/icons-react';
import type { FC } from 'react';

export type RankDisplayProps = {
  rank: number;
};

export const RankDisplay: FC<RankDisplayProps> = ({ rank }) => {
  if (rank <= 3) {
    const colors = ['orange', 'silver', 'indianred'];
    return (
      <span className="w-9">
        <IconCrown fill={colors[rank - 1]} color={colors[rank - 1]} />
      </span>
    );
  }

  return <span className="text-lg font-medium w-9 text-right">#{rank}</span>;
};

export type RankingItemSkeletonProps = {
  rank: number;
  showIcon?: boolean;
};

export const RankingItemSkeleton: FC<RankingItemSkeletonProps> = ({
  rank,
  showIcon = true,
}) => (
  <div className="flex items-center gap-2 px-2 py-1">
    <RankDisplay rank={rank} />
    {showIcon && <Skeleton circle w={24} height={24} />}
    <Skeleton h={16} />
  </div>
);
