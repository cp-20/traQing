import type { FC, ReactNode } from 'react';

import {
  RankingItemBar,
  RankingItemRank,
  RankingItemSkeleton,
  RankingItemValue,
  RankingItemWithLink,
} from '@/components/rankings';
import { useMessageStamps } from '@/hooks/useMessageStamps';
import { StampImage } from '../StampImage';

export type StampRankingItemProps = {
  stampId: string;
  rank: number;
  value: ReactNode;
  rate?: number;
};

export const StampRankingItem: FC<StampRankingItemProps> = ({ stampId, rank, value, rate }) => {
  const { getStamp } = useMessageStamps();

  const stamp = getStamp(stampId);
  if (stamp === undefined) return <RankingItemSkeleton rank={rank} showIcon={false} />;

  return (
    <RankingItemWithLink to={`/stamps/${encodeURIComponent(stamp.name)}`}>
      {rate && <RankingItemBar rate={rate} />}
      <RankingItemRank rank={rank} />
      <StampImage stampId={stampId} size={24} />
      <span className="font-medium">{stamp.name}</span>
      <RankingItemValue value={value} />
    </RankingItemWithLink>
  );
};
