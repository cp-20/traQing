import type { FC, ReactNode } from 'react';

import {
  RankingItemBar,
  RankingItemRank,
  RankingItemSkeleton,
  RankingItemValue,
  RankingItemWithLink,
} from '@/components/rankings';
import { useMessageStamps } from '@/hooks/useMessageStamps';

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
      <img src={`/api/files/${stamp.fileId}?width=48&height=48`} alt="" className="size-6" width="24" height="24" />
      <span className="font-medium">{stamp.name}</span>
      <RankingItemValue value={value} />
    </RankingItemWithLink>
  );
};
