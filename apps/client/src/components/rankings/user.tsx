import { UserAvatar } from '@/components/UserAvatar';
import {
  RankingItemBar,
  RankingItemRank,
  RankingItemSkeleton,
  RankingItemValue,
  RankingItemWithLink,
} from '@/components/rankings';
import { useUsers } from '@/hooks/useUsers';
import type { FC } from 'react';

export type UserRankingItemProps = {
  userId: string;
  rank: number;
  value: number;
  rate?: number;
};

export const UserRankingItem: FC<UserRankingItemProps> = ({ userId, rank, value, rate }) => {
  const { getUserFromId } = useUsers();

  const user = getUserFromId(userId);
  if (user === undefined) return <RankingItemSkeleton rank={rank} />;

  return (
    <RankingItemWithLink to={`/users/${encodeURIComponent(user.name)}`}>
      {rate && <RankingItemBar rate={rate} />}
      <RankingItemRank rank={rank} />
      <UserAvatar userId={userId} />
      <span className="font-medium">{user.displayName}</span>
      <span className="text-gray-500">@{user.name.split('#')[0]}</span>
      <RankingItemValue value={value} />
    </RankingItemWithLink>
  );
};
