import { RankingItemRank, RankingItemSkeleton } from '@/components/rankings';
import {
  useGaveMessageStampsRanking,
  useMessagesRanking,
  useReceivedMessageStampsRanking,
} from '@/hooks/useServerData';
import { useStamps } from '@/hooks/useStamps';
import { useUsers } from '@/hooks/useUsers';
import type { StampsQuery } from '@traq-ing/database';
import { type FC, useMemo } from 'react';
import { Link } from 'react-router-dom';

type UserRankingItemProps = {
  userId: string;
  rank: number;
  count: number;
};

const UserRankingItem: FC<UserRankingItemProps> = ({ userId, rank, count }) => {
  const { getUserFromId } = useUsers();

  const user = getUserFromId(userId);
  if (user === undefined) {
    return <RankingItemSkeleton rank={rank} />;
  }

  return (
    <Link
      to={`/users/${encodeURIComponent(user.name)}`}
      className="flex items-center gap-2 hover:bg-gray-100 rounded-md px-2 py-1 transition-all duration-200"
    >
      <RankingItemRank rank={rank} />
      <img src={`/api/files/${user.iconFileId}`} width={24} height={24} alt="" className="rounded-full" />
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
        {users === undefined && new Array(limit).fill(null).map((_, i) => <RankingItemSkeleton key={i} rank={i + 1} />)}
        {users?.slice(0, limit).map((message, i) => (
          <UserRankingItem key={message.user} userId={message.user} rank={i + 1} count={message.count} />
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

export const UserGaveSpecificStampRanking: FC<SpecificStampRankingProps> = ({ stampId, limit }) => {
  const query = useMemo(
    () =>
      ({
        stampId: stampId ?? undefined,
        groupBy: 'user',
        orderBy: 'count',
        order: 'desc',
        limit: limit ?? 10,
      }) satisfies StampsQuery,
    [stampId, limit],
  );
  const { stamps } = useStamps(query);
  const data = stamps?.map((s) => ({
    user: s.user,
    count: s.count,
  }));
  return <UserRanking users={data} limit={limit ?? 10} />;
};

export const UserReceivedSpecificStampRanking: FC<SpecificStampRankingProps> = ({ stampId, limit }) => {
  const query = useMemo(
    () =>
      ({
        stampId: stampId ?? undefined,
        groupBy: 'messageUser',
        orderBy: 'count',
        order: 'desc',
        limit: limit ?? 10,
      }) satisfies StampsQuery,
    [stampId, limit],
  );
  const { stamps } = useStamps(query);
  const data = stamps?.map((s) => ({
    user: s.messageUser,
    count: s.count,
  }));
  return <UserRanking users={data} limit={limit ?? 10} />;
};
