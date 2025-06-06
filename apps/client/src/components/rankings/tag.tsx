import { TagIcon } from '@/components/icons/TagIcon';
import { RankingItemBar, RankingItemRank, RankingItemValue, RankingItem } from '@/components/rankings';
import type { FC } from 'react';

type TagRankingItemProps = {
  tag: string;
  rank: number;
  value: number;
  rate?: number;
};
export const TagRankingItem: FC<TagRankingItemProps> = ({ tag, rank, value, rate }) => {
  return (
    <RankingItem>
      {rate && <RankingItemBar rate={rate} />}
      <RankingItemRank rank={rank} />
      <TagIcon />
      <span className="font-medium">{tag}</span>
      <RankingItemValue value={value} />
    </RankingItem>
  );
};
