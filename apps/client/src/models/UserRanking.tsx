import {
  useGaveMessageStampsRanking,
  useMessagesRanking,
  useReceivedMessageStampsRanking,
} from '@/hooks/useServerData';
import { useStamps } from '@/hooks/useStamps';
import { useUsers } from '@/hooks/useUsers';
import { Skeleton } from '@mantine/core';
import { IconCrown } from '@tabler/icons-react';
import { StampsQuery } from '@traq-ing/database';
import { FC, useMemo } from 'react';
import { Link } from 'react-router-dom';

type RankDisplayProps = {
  rank: number;
};

const RankDisplay: FC<RankDisplayProps> = ({ rank }) => {
  if (rank <= 3) {
    const colors = ['orange', 'silver', 'indianred'];
    return (
      <span className="w-8">
        <IconCrown fill={colors[rank - 1]} color={colors[rank - 1]} />
      </span>
    );
  }

  return <span className="text-lg font-medium w-8">#{rank}</span>;
};

type UserRankingItemSkeletonProps = {
  rank: number;
};

const UserRankingItemSkeleton: FC<UserRankingItemSkeletonProps> = ({
  rank,
}) => (
  <div className="flex items-center gap-2">
    <RankDisplay rank={rank} />
    <Skeleton circle w={24} height={24} />
    <Skeleton h={16} />
  </div>
);

type UserRankingItemProps = {
  userId: string;
  rank: number;
  count: number;
};

const UserRankingItem: FC<UserRankingItemProps> = ({ userId, rank, count }) => {
  const { getUserFromId } = useUsers();

  const user = getUserFromId(userId);
  if (user === undefined) {
    return <UserRankingItemSkeleton rank={rank} />;
  }

  return (
    <Link
      to={`/users/${encodeURIComponent(user.name)}`}
      className="flex items-center gap-2 hover:bg-gray-100 rounded-md px-2 py-1 transition-all duration-200"
    >
      <RankDisplay rank={rank} />
      <img
        src={`/api/files/${user.iconFileId}`}
        width={24}
        height={24}
        className="rounded-full"
      />
      <span className="font-medium">{user.displayName}</span>
      <span className="text-gray-500">@{user.name}</span>
      <span className="text-right font-medium ml-auto">{count}</span>
    </Link>
  );
};

type UserRankingProps = {
  users: { user: string; count: number }[] | undefined;
  limit: number;
};

const UserRanking: FC<UserRankingProps> = ({ users, limit }) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col">
        {users === undefined &&
          new Array(limit)
            .fill(null)
            .map((_, i) => <UserRankingItemSkeleton key={i} rank={i + 1} />)}
        {users &&
          users
            .slice(0, limit)
            .map((message, i) => (
              <UserRankingItem
                key={message.user}
                userId={message.user}
                rank={i + 1}
                count={message.count}
              />
            ))}
      </div>
    </div>
  );
};

export const UserMessagesRanking: FC = () => {
  const { data } = useMessagesRanking();
  return <UserRanking users={data} limit={20} />;
};

export const UserGaveStampsRanking: FC = () => {
  const { data } = useGaveMessageStampsRanking();
  return <UserRanking users={data} limit={20} />;
};

export const UserReceivedStampsRanking: FC = () => {
  const { data } = useReceivedMessageStampsRanking();
  const formatted = data?.map((d) => ({
    user: d.messageUser,
    count: d.count,
  }));
  return <UserRanking users={formatted} limit={20} />;
};

type SpecificStampRankingProps = {
  stampId: string | null;
  limit?: number;
};

export const UserGaveSpecificStampRanking: FC<SpecificStampRankingProps> = ({
  stampId,
  limit,
}) => {
  const query = useMemo(
    () =>
      ({
        stampId: stampId ?? undefined,
        groupBy: 'user',
        orderBy: 'count',
        order: 'desc',
        limit: limit ?? 10,
      } satisfies StampsQuery),
    [stampId]
  );
  const { stamps } = useStamps(query);
  const data = stamps?.map((s) => ({
    user: s.user,
    count: s.count,
  }));
  return <UserRanking users={data} limit={limit ?? 10} />;
};

export const UserReceivedSpecificStampRanking: FC<
  SpecificStampRankingProps
> = ({ stampId, limit }) => {
  const query = useMemo(
    () =>
      ({
        stampId: stampId ?? undefined,
        groupBy: 'messageUser',
        orderBy: 'count',
        order: 'desc',
        limit: limit ?? 10,
      } satisfies StampsQuery),
    [stampId]
  );
  const { stamps } = useStamps(query);
  const data = stamps?.map((s) => ({
    user: s.messageUser,
    count: s.count,
  }));
  return <UserRanking users={data} limit={limit ?? 10} />;
};
