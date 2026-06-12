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
      <span className="flex-none">
        <TagIcon />
      </span>
      <span className="min-w-0 flex-1 truncate font-medium">{tag}</span>
      <RankingItemValue value={value} />
    </RankingItem>
  );
};
