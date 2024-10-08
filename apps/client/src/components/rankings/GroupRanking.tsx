import { RankingItemSkeleton } from '@/components/rankings';
import { GroupRankingItem } from '@/components/rankings/group';
import { useGroupRanking } from '@/hooks/useServerData';
import clsx from 'clsx';
import { Fragment } from 'react';
import type { FC } from 'react';

type RankingViewProps = {
  loading: boolean;
  data: { group: string; count: number }[];
  limit: number;
};
const RankingView: FC<RankingViewProps> = ({ loading, data, limit }) => {
  if (loading && data.length === 0) {
    return (
      <div className="flex flex-col">
        {[...Array(limit)].map((_, i) => (
          <RankingItemSkeleton key={i} rank={i + 1} />
        ))}
      </div>
    );
  }

  return (
    <div className={clsx('flex flex-col', loading && 'opacity-80')}>
      {data.map((m, i) => (
        <Fragment key={m.group}>
          <GroupRankingItem groupId={m.group} rank={i + 1} value={m.count} rate={m.count / data[0].count} />
        </Fragment>
      ))}
    </div>
  );
};

type GroupMembersRankingProps = {
  limit?: number;
};
export const GroupMembersRanking: FC<GroupMembersRankingProps> = ({ limit }) => {
  const { data: ranking, isLoading } = useGroupRanking('group');
  return <RankingView loading={isLoading} data={ranking?.slice(0, limit) ?? []} limit={limit ?? 10} />;
};
