import {
  RankingItemSkeleton,
  RankingItemWithLink,
  RankingItemBar,
  RankingItemRank,
  RankingItemValue,
} from '@/components/rankings';
import { useGroups } from '@/hooks/useGroups';
import type { FC } from 'react';

type GroupRankingItemProps = {
  groupId: string;
  rank: number;
  value: number;
  rate?: number;
};
export const GroupRankingItem: FC<GroupRankingItemProps> = ({ groupId, rank, value, rate }) => {
  const { getGroup } = useGroups();
  const group = getGroup(groupId);
  if (group === undefined) return <RankingItemSkeleton rank={rank} />;
  return (
    <RankingItemWithLink to={`/groups/${encodeURIComponent(group.name)}`}>
      {rate && <RankingItemBar rate={rate} />}
      <RankingItemRank rank={rank} />
      <span className="font-medium">@{group.name}</span>
      <RankingItemValue value={value} />
    </RankingItemWithLink>
  );
};
