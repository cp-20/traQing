import clsx from 'clsx';
import { type FC, Fragment } from 'react';
import { RankingItemSkeleton } from '@/components/rankings';
import { TagRankingItem } from '@/components/rankings/tag';
import { useTagRanking } from '@/hooks/useServerData';

type RankingViewProps = {
  loading: boolean;
  data: { tag: string; count: number }[];
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
      {data.map((t, i) => (
        <Fragment key={t.tag}>
          <TagRankingItem tag={t.tag} rank={i + 1} value={t.count} rate={t.count / data[0].count} />
        </Fragment>
      ))}
    </div>
  );
};

type TagRankingProps = {
  limit?: number;
};
export const TagRanking: FC<TagRankingProps> = ({ limit }) => {
  const { data } = useTagRanking('tag');
  const ranking = data?.slice(0, limit).map((t) => ({ tag: t.group, count: t.count }));
  return <RankingView loading={false} data={ranking ?? []} limit={limit ?? 10} />;
};
