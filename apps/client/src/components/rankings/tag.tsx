import type { FC } from 'react';
import { TagIcon } from '@/components/icons/TagIcon';
import { RankingItem, RankingItemBar, RankingItemRank, RankingItemValue } from '@/components/rankings';

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
