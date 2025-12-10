import type { FC } from 'react';
import {
  RankingItemBar,
  RankingItemRank,
  RankingItemSkeleton,
  RankingItemValue,
  RankingItemWithLink,
} from '@/components/rankings';
import { UserAvatar } from '@/components/UserAvatar';
import { useUsers } from '@/hooks/useUsers';

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
      <UserAvatar user={user} />
      <div className="flex @md:gap-2 @lg:flex-row flex-col">
        <span className="font-medium break-all">{user.displayName}</span>
        <span className="text-gray-500 @md:text-md text-sm">@{user.name.split('#')[0]}</span>
      </div>
      <RankingItemValue value={value} />
    </RankingItemWithLink>
  );
};
