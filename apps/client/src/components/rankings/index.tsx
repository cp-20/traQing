import { Skeleton } from '@mantine/core';
import { IconCrown } from '@tabler/icons-react';
import { useEffect, useState, type FC, type ReactNode } from 'react';
import { Link } from 'react-router';
import clsx from 'clsx';

export type RankingItemSkeletonProps = {
  rank: number;
  showIcon?: boolean;
};

export const RankingItemSkeleton: FC<RankingItemSkeletonProps> = ({ rank, showIcon = true }) => (
  <div className="flex items-center gap-2 px-2 py-1">
    <RankingItemRank rank={rank} />
    {showIcon && <Skeleton circle w={24} height={24} />}
    <Skeleton h={16} className="flex-1" />
  </div>
);

export type RankingItemProps = {
  children: ReactNode;
};
export const RankingItem: FC<RankingItemProps> = ({ children }) => (
  <div className="flex items-center gap-2 px-2 py-1">{children}</div>
);

export type RankingItemWithLinkProps = {
  to: string;
  children: ReactNode;
};

export const RankingItemWithLink: FC<RankingItemWithLinkProps> = ({ to, children }) => {
  return (
    <Link
      to={to}
      className="flex items-center gap-2 rounded-r-md px-2 py-1 relative z-0 hover:opacity-70 transition-opacity duration-150 @container"
    >
      {children}
    </Link>
  );
};

export type RankingItemBarProps = {
  rate: number;
};

export const RankingItemBar: FC<RankingItemBarProps> = ({ rate }) => {
  const [displayRate, setDisplayRate] = useState(0);
  useEffect(() => {
    setDisplayRate(rate);
  }, [rate]);

  return (
    <span
      className={clsx(
        'absolute inset-0 bg-blue-50 -z-10 origin-left rounded-r-md transition-transform duration-1000 ease-out',
      )}
      style={{ transform: `scale(${displayRate}, 0.9)` }}
    />
  );
};

export type RankingItemRankProps = {
  rank: number;
};

export const RankingItemRank: FC<RankingItemRankProps> = ({ rank }) => {
  if (rank <= 3) {
    const colors = ['orange', 'silver', 'indianred'];
    return (
      <span className="w-9">
        <IconCrown fill={colors[rank - 1]} color={colors[rank - 1]} />
      </span>
    );
  }

  return <span className="text-lg font-medium w-9">#{rank}</span>;
};

export type RankingItemValueProps = {
  value: number;
};

export const RankingItemValue: FC<RankingItemValueProps> = ({ value }) => (
  <span className="text-right font-bold ml-auto">{value}</span>
);
