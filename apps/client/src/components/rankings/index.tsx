import { Box, Skeleton } from '@mantine/core';
import type { FC, ReactNode } from 'react';
import { Link } from 'react-router';

export type RankingItemSkeletonProps = {
  rank: number;
  showIcon?: boolean;
};

export const RankingItemSkeleton: FC<RankingItemSkeletonProps> = ({ rank, showIcon = true }) => (
  <div className="traqing-ranking-row flex min-w-0 items-center gap-3 px-2 py-2">
    <RankingItemRank rank={rank} />
    {showIcon && <Skeleton circle w={24} height={24} />}
    <Skeleton h={16} className="min-w-0 flex-1" />
    <Skeleton h={8} w={48} radius="xl" />
  </div>
);

export type RankingItemProps = {
  children: ReactNode;
};
export const RankingItem: FC<RankingItemProps> = ({ children }) => (
  <div className="traqing-ranking-row flex min-w-0 items-center gap-3 px-2 py-2">{children}</div>
);

export type RankingItemWithLinkProps = {
  to: string;
  children: ReactNode;
};

export const RankingItemWithLink: FC<RankingItemWithLinkProps> = ({ to, children }) => {
  return (
    <Box
      component={Link}
      to={to}
      className="traqing-ranking-row flex min-w-0 items-center gap-3 px-2 py-2 relative z-0 overflow-hidden transition-colors duration-150 @container"
      style={{
        color: 'inherit',
        textDecoration: 'none',
      }}
    >
      {children}
    </Box>
  );
};

export type RankingItemBarProps = {
  rate: number;
};

export const RankingItemBar: FC<RankingItemBarProps> = ({ rate }) => (
  <span className="traqing-ranking-meter order-last" aria-hidden>
    <span className="traqing-ranking-meter-fill" style={{ width: `${Math.max(0, Math.min(rate, 1)) * 100}%` }} />
  </span>
);

export type RankingItemRankProps = {
  rank: number;
};

export const RankingItemRank: FC<RankingItemRankProps> = ({ rank }) => {
  return <span className="traqing-ranking-rank w-8 flex-none text-xs font-semibold tabular-nums">#{rank}</span>;
};

export type RankingItemValueProps = {
  value: ReactNode;
};

export const RankingItemValue: FC<RankingItemValueProps> = ({ value }) => (
  <span className="ml-auto flex-none text-right font-semibold tabular-nums">{value}</span>
);
