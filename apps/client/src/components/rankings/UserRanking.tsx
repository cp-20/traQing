import type { MessagesQuery, StampsQuery } from '@traq-ing/database';
import clsx from 'clsx';
import type { FC } from 'react';
import { Fragment, useMemo } from 'react';
import { RankingItemSkeleton } from '@/components/rankings';
import { UserRankingItem } from '@/components/rankings/user';
import { type DateRange, dateRangeToQuery } from '@/composables/useDateRangePicker';
import { useGroups } from '@/hooks/useGroups';
import { useMessages } from '@/hooks/useMessages';
import { useStamps } from '@/hooks/useStamps';

type RankingViewProps = {
  loading: boolean;
  data: { user: string; count: number }[];
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
        <Fragment key={m.user}>
          <UserRankingItem userId={m.user} rank={i + 1} value={m.count} rate={m.count / data[0].count} />
        </Fragment>
      ))}
    </div>
  );
};

export type MessagesUserRankingProps = {
  range?: DateRange;
  channelId?: string;
  limit?: number;
};
export const MessagesUserRanking: FC<MessagesUserRankingProps> = ({ range, channelId, limit }) => {
  const query = useMemo(
    () =>
      ({
        channelId,
        target: 'count',
        groupBy: 'user',
        orderBy: 'target',
        order: 'desc',
        limit: limit ?? 10,
        ...(range && dateRangeToQuery(range)),
      }) satisfies MessagesQuery,
    [range, channelId, limit],
  );
  const { messages, loading } = useMessages(query);

  return <RankingView loading={loading} data={messages} limit={limit ?? 10} />;
};

export type StampsUserRankingProps = {
  range?: DateRange;
  stampId?: string;
  channelId?: string;
  limit?: number;
};

export const StampsGaveUserRanking: FC<StampsUserRankingProps> = ({ range, stampId, channelId, limit }) => {
  const query = useMemo(
    () =>
      ({
        stampId,
        channelId,
        groupBy: 'user',
        orderBy: 'count',
        order: 'desc',
        limit: limit ?? 10,
        ...(range && dateRangeToQuery(range)),
      }) satisfies StampsQuery,
    [range, stampId, channelId, limit],
  );
  const { stamps, loading } = useStamps(query);

  return <RankingView loading={loading} data={stamps} limit={limit ?? 10} />;
};

export const StampsReceivedUserRanking: FC<StampsUserRankingProps> = ({ range, stampId, channelId, limit }) => {
  const query = useMemo(
    () =>
      ({
        stampId,
        channelId,
        groupBy: 'messageUser',
        orderBy: 'count',
        order: 'desc',
        limit: limit ?? 10,
        ...(range && dateRangeToQuery(range)),
      }) satisfies StampsQuery,
    [range, stampId, channelId, limit],
  );
  const { stamps, loading } = useStamps(query);

  return (
    <RankingView
      loading={loading}
      data={stamps.map((s) => ({ user: s.messageUser, count: s.count }))}
      limit={limit ?? 10}
    />
  );
};

type GroupMessagesRankingProps = {
  groupId: string;
  range?: DateRange;
  limit?: number;
};
export const GroupMessagesRanking: FC<GroupMessagesRankingProps> = ({ groupId, range, limit }) => {
  const { getGroup } = useGroups();
  const group = getGroup(groupId);
  const groupMap = new Map(group?.members.map((m) => [m.id, m]));
  const query = useMemo(
    () =>
      ({
        target: 'count',
        groupBy: 'user',
        orderBy: 'target',
        order: 'desc',
        ...(range && dateRangeToQuery(range)),
      }) satisfies MessagesQuery,
    [range],
  );
  const { messages: ranking, loading } = useMessages(query);
  const inGroup = ranking?.filter((m) => groupMap.has(m.user)).slice(0, limit ?? 10);

  return <RankingView loading={loading} data={inGroup ?? []} limit={limit ?? 10} />;
};

type GroupGaveStampsRankingProps = {
  groupId: string;
  range?: DateRange;
  limit?: number;
};
export const GroupGaveStampsRanking: FC<GroupGaveStampsRankingProps> = ({ groupId, range, limit }) => {
  const { getGroup } = useGroups();
  const group = getGroup(groupId);
  const groupMap = new Map(group?.members.map((m) => [m.id, m]));
  const query = useMemo(
    () =>
      ({
        groupBy: 'user',
        orderBy: 'count',
        order: 'desc',
        ...(range && dateRangeToQuery(range)),
      }) satisfies StampsQuery,
    [range],
  );
  const { stamps: ranking, loading } = useStamps(query);
  const inGroup = ranking?.filter((s) => groupMap.has(s.user)).slice(0, limit ?? 10);

  return <RankingView loading={loading} data={inGroup ?? []} limit={limit ?? 10} />;
};

type GroupReceivedStampsRankingProps = {
  groupId: string;
  range?: DateRange;
  limit?: number;
};
export const GroupReceivedStampsRanking: FC<GroupReceivedStampsRankingProps> = ({ groupId, range, limit }) => {
  const { getGroup } = useGroups();
  const group = getGroup(groupId);
  const groupMap = new Map(group?.members.map((m) => [m.id, m]));
  const query = useMemo(
    () =>
      ({
        groupBy: 'messageUser',
        orderBy: 'count',
        order: 'desc',
        ...(range && dateRangeToQuery(range)),
      }) satisfies StampsQuery,
    [range],
  );
  const { stamps: ranking, loading } = useStamps(query);
  const inGroup = ranking
    ?.filter((s) => groupMap.has(s.messageUser))
    .slice(0, limit ?? 10)
    .map((s) => ({
      user: s.messageUser,
      count: s.count,
    }));

  return <RankingView loading={loading} data={inGroup ?? []} limit={limit ?? 10} />;
};
