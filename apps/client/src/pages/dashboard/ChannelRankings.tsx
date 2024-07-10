import { Card } from '@/components/Card';
import { NotificationIcon } from '@/components/NotificationIcon';
import { RankDisplay } from '@/components/Ranking';
import { useChannels } from '@/hooks/useChannels';
import { useMessages } from '@/hooks/useMessages';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { useUsers } from '@/hooks/useUsers';
import { Skeleton } from '@mantine/core';
import { useIntersection } from '@mantine/hooks';
import { MessagesQuery } from '@traq-ing/database';
import {
  type FC,
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

type ChannelRankingItemSkeletonProps = {
  rank: number;
};

const ChannelRankingItemSkeleton: FC<ChannelRankingItemSkeletonProps> = ({
  rank,
}) => (
  <div className="flex items-center gap-2 px-2 py-1">
    <RankDisplay rank={rank} />
    <Skeleton circle w={24} height={24} />
    <div className="flex-1 flex @2xl:items-center justify-between gap-1 flex-col @2xl:flex-row">
      <div className="h-6 py-1">
        <Skeleton h={16} />
      </div>
      <div className="flex items-center -space-x-1">
        {new Array(10).fill(0).map((_, i) => (
          <div key={i} style={{ zIndex: 10 - i }}>
            <Skeleton circle w={16} height={16} />
          </div>
        ))}
      </div>
    </div>
  </div>
);

type ChannelRankingItemProps = {
  rank: number;
  channel: { channel: string; count: number };
  total: number;
};

const ChannelRankingItem: FC<ChannelRankingItemProps> = ({
  rank,
  channel: { channel, count },
  total,
}) => {
  const { setSubscriptionLevel, getSubscriptionLevel } = useSubscriptions();
  const query = useMemo(
    () =>
      ({
        channelId: channel,
        groupBy: 'user',
        orderBy: 'count',
        order: 'desc',
      } satisfies MessagesQuery),
    []
  );
  const { messages, loading } = useMessages(query);
  const { getUserFromId, users } = useUsers();
  const firstUser =
    messages.length > 0 ? getUserFromId(messages[0]?.user) : undefined;
  const { getChannelName } = useChannels();
  const subscriptionLevel = getSubscriptionLevel(channel);

  return (
    <div className="flex items-center gap-2 px-2 py-1 @container">
      <RankDisplay rank={rank} />
      {loading || users === undefined ? (
        <Skeleton circle w={24} height={24} />
      ) : firstUser ? (
        <img
          src={`/api/files/${firstUser.iconFileId}`}
          alt=""
          width={24}
          height={24}
          className="rounded-full"
          loading="lazy"
          title={`${firstUser.displayName} (@${firstUser.name})`}
        />
      ) : (
        <div className="rounded-full w-6 h-6" />
      )}
      <div className="flex-1 flex @2xl:items-center justify-between gap-1 flex-col @2xl:flex-row">
        <div className="flex items-center gap-2">
          <div className="font-semibold">
            {`#${getChannelName(channel)}` ?? <Skeleton h={16} />}
          </div>
          <button
            onClick={() => {
              setSubscriptionLevel(channel, (subscriptionLevel + 1) % 3);
            }}
          >
            <NotificationIcon level={subscriptionLevel} />
          </button>
        </div>

        <div className="flex items-center -space-x-1">
          {messages.length === 0 &&
            new Array(10).fill(0).map((_, i) => (
              <div key={i} style={{ zIndex: 10 - i }}>
                <Skeleton circle w={16} height={16} />
              </div>
            ))}
          {messages.slice(0, 10).map((m, i, arr) => (
            <div key={m.user} style={{ zIndex: arr.length - i }}>
              <img
                src={`/api/files/${getUserFromId(m.user)!.iconFileId}`}
                alt=""
                width={16}
                height={16}
                className="rounded-full border-2 border-white bg-white"
                title={`${getUserFromId(m.user)!.displayName} (@${
                  getUserFromId(m.user)!.name
                })`}
              />
            </div>
          ))}
          {messages.length > 10 && (
            <div>
              <div className="ml-2 text-xs font-medium grid place-content-center text-gray-400">
                +{messages.length - 10}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="text-right w-28">
        <span className="font-medium">{count}</span>
        <span className="ml-1 text-gray-500 text-sm">
          ({((count * 100) / total).toFixed(1)}%)
        </span>
      </div>
    </div>
  );
};

type ChannelRankingProps = {
  channels: { channel: string; count: number }[];
  limit?: number;
  label: ReactNode;
};

const ChannelRanking: FC<ChannelRankingProps> = ({
  channels,
  limit,
  label,
}) => {
  const { getSubscriptionLevel } = useSubscriptions();
  const [currentLimit, setCurrentLimit] = useState(Math.min(limit ?? 20, 20));
  const containerRef = useRef<HTMLDivElement>(null);
  const { ref: loaderRef, entry } = useIntersection({
    root: containerRef.current,
    threshold: 0.1,
  });

  useEffect(() => {
    if (entry?.isIntersecting) {
      setCurrentLimit((prev) => prev + 20);
    }
  }, [entry]);

  const stats = channels.length > 0 && {
    total: channels.reduce((acc, { count }) => acc + count, 0),
    totalUnreads: channels
      .filter(({ channel }) => getSubscriptionLevel(channel) > 0)
      .reduce((acc, { count }) => acc + count, 0),
  };

  return (
    <Card className="border max-h-[740px] overflow-auto" ref={containerRef}>
      <div className="font-medium mb-2 flex justify-between">
        <div>{label}</div>
        {stats && (
          <div>
            <span>{stats.totalUnreads}</span>
            <span> / </span>
            <span>{stats.total}</span>
            <span>
              {' '}
              ({((stats.totalUnreads * 100) / stats.total).toFixed(1)}%)
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-col">
        {channels.length === 0 &&
          new Array(limit ?? 20)
            .fill(null)
            .map((_, i) => <ChannelRankingItemSkeleton rank={i + 1} key={i} />)}
        {channels.slice(0, currentLimit).map((c, i) => (
          <ChannelRankingItem
            key={`${c.channel}-${i}-${stats}`}
            rank={i + 1}
            channel={c}
            total={stats ? stats.total : 0}
          />
        ))}
        <div ref={loaderRef} />
        {channels.length > currentLimit &&
          new Array(10)
            .fill(0)
            .map((_, i) => (
              <ChannelRankingItemSkeleton rank={currentLimit + i + 1} />
            ))}
      </div>
    </Card>
  );
};

const ChannelOverallRanking: FC = () => {
  const query = useMemo(
    () =>
      ({
        groupBy: 'channel',
        orderBy: 'count',
        order: 'desc',
      } satisfies MessagesQuery),
    []
  );
  const { messages } = useMessages(query);

  return <ChannelRanking channels={messages} label="全体" />;
};

const ChannelYearlyRanking: FC = () => {
  const query = useMemo(
    () =>
      ({
        groupBy: 'channel',
        orderBy: 'count',
        order: 'desc',
        after: new Date(Date.now() - 1000 * 60 * 60 * 24 * 365).toISOString(),
      } satisfies MessagesQuery),
    []
  );
  const { messages } = useMessages(query);

  return <ChannelRanking channels={messages} label="過去1年間" />;
};

const ChannelMonthlyRanking: FC = () => {
  const query = useMemo(
    () =>
      ({
        groupBy: 'channel',
        orderBy: 'count',
        order: 'desc',
        after: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
      } satisfies MessagesQuery),
    []
  );
  const { messages } = useMessages(query);

  return <ChannelRanking channels={messages} label="過去1か月" />;
};

const ChannelDailyRanking: FC = () => {
  const query = useMemo(
    () =>
      ({
        groupBy: 'channel',
        orderBy: 'count',
        order: 'desc',
        after: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      } satisfies MessagesQuery),
    []
  );
  const { messages } = useMessages(query);

  return <ChannelRanking channels={messages} label="過去24時間" />;
};

export const ChannelRankings: FC = () => {
  return (
    <Card>
      <div className="font-semibold text-xl mb-4">投稿数ランキング</div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <ChannelOverallRanking />
        <ChannelYearlyRanking />
        <ChannelMonthlyRanking />
        <ChannelDailyRanking />
      </div>
    </Card>
  );
};
