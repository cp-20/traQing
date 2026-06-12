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
      <span className="flex-none">
        <UserAvatar user={user} />
      </span>
      <div className="flex min-w-0 flex-1 @lg:gap-1 @lg:flex-row @lg:items-center flex-col">
        <span className="truncate font-medium">{user.displayName}</span>
        <span className="truncate text-gray-500 @md:text-md text-sm">@{user.name.split('#')[0]}</span>
      </div>
      <RankingItemValue value={value} />
    </RankingItemWithLink>
  );
};
