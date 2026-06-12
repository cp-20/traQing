import { Badge, Button, Group, Paper, SimpleGrid, Skeleton, Stack, Text, Title } from '@mantine/core';
import { IconArrowDownRight, IconArrowRight, IconArrowUpRight, IconMinus } from '@tabler/icons-react';
import type { MessagesQuery, StampsQuery } from '@traq-ing/database';
import type { ComponentProps, FC, ReactNode } from 'react';
import { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { Link } from 'react-router';
import { Card } from '@/components/Card';
import { commonHoursChartOption, commonHoursQuery, getHourDataset, hours } from '@/components/hours/common';
import { TopReactedMessages } from '@/components/messages/TopReactedMessages';
import { PeriodBadge } from '@/components/PeriodBadge';
import { RankingItemSkeleton } from '@/components/rankings';
import { MessagesChannelRanking } from '@/components/rankings/ChannelRanking';
import { StampRanking } from '@/components/rankings/StampRanking';
import { MessagesUserRanking } from '@/components/rankings/UserRanking';
import { Stat } from '@/components/stats';
import { UserAvatar } from '@/components/UserAvatar';
import { dateRangeKinds, dateRangeToQuery, useDateRangePicker } from '@/composables/useDateRangePicker';
import { useAuth } from '@/hooks/useAuth';
import { useMessages } from '@/hooks/useMessages';
import {
  useGaveMessageStampsRanking,
  useGroupRanking,
  useMessagesRanking,
  useReceivedMessageStampsRanking,
  useSubscriptionRanking,
  useTagRanking,
} from '@/hooks/useServerData';
import { useStamps } from '@/hooks/useStamps';

type DashboardSectionProps = {
  title: string;
  children: ReactNode;
};

const DashboardSection: FC<DashboardSectionProps> = ({ title, children }) => (
  <Stack gap="sm">
    <div>
      <Title order={2} size="h4">
        {title}
      </Title>
    </div>
    {children}
  </Stack>
);

const ProfileSkeleton: FC = () => (
  <Paper p="md" radius="sm" withBorder className="h-32">
    <Stack gap="sm">
      <Group justify="space-between">
        <Skeleton h={22} w={112} />
        <Skeleton h={30} w={64} />
      </Group>
      <Group justify="space-between" align="flex-start" wrap="nowrap">
        <Group wrap="nowrap" miw={0}>
          <Skeleton circle h={56} w={56} />
          <div className="flex-1">
            <Skeleton h={20} w={160} mb={8} />
            <Skeleton h={14} w={96} />
          </div>
        </Group>
      </Group>
    </Stack>
  </Paper>
);

type PeriodStats = {
  gaveStamps: number;
  messages: number;
  previousGaveStamps?: number;
  previousMessages?: number;
  previousReceivedStamps?: number;
  receivedStamps: number;
};

const usePeriodStats = (range: [Date, Date] | undefined, userId: string) => {
  const previousRange = useMemo(() => getPreviousRange(range), [range]);
  const messagesQuery = useMemo(
    () =>
      ({
        userId,
        target: 'count',
        ...(range ? dateRangeToQuery(range) : {}),
      }) satisfies MessagesQuery,
    [range, userId],
  );
  const previousMessagesQuery = useMemo(
    () =>
      ({
        userId,
        target: 'count',
        ...(previousRange ? dateRangeToQuery(previousRange) : {}),
      }) satisfies MessagesQuery,
    [previousRange, userId],
  );
  const gaveStampsQuery = useMemo(
    () =>
      ({
        userId,
        ...(range ? dateRangeToQuery(range) : {}),
      }) satisfies StampsQuery,
    [range, userId],
  );
  const previousGaveStampsQuery = useMemo(
    () =>
      ({
        userId,
        ...(previousRange ? dateRangeToQuery(previousRange) : {}),
      }) satisfies StampsQuery,
    [previousRange, userId],
  );
  const receivedStampsQuery = useMemo(
    () =>
      ({
        messageUserId: userId,
        ...(range ? dateRangeToQuery(range) : {}),
      }) satisfies StampsQuery,
    [range, userId],
  );
  const previousReceivedStampsQuery = useMemo(
    () =>
      ({
        messageUserId: userId,
        ...(previousRange ? dateRangeToQuery(previousRange) : {}),
      }) satisfies StampsQuery,
    [previousRange, userId],
  );

  const { messages, loading: messagesLoading } = useMessages(messagesQuery);
  const { messages: previousMessages, loading: previousMessagesLoading } = useMessages(previousMessagesQuery);
  const { stamps: gaveStamps, loading: gaveStampsLoading } = useStamps(gaveStampsQuery);
  const { stamps: previousGaveStamps, loading: previousGaveStampsLoading } = useStamps(previousGaveStampsQuery);
  const { stamps: receivedStamps, loading: receivedStampsLoading } = useStamps(receivedStampsQuery);
  const { stamps: previousReceivedStamps, loading: previousReceivedStampsLoading } =
    useStamps(previousReceivedStampsQuery);

  return {
    loading:
      messagesLoading ||
      previousMessagesLoading ||
      gaveStampsLoading ||
      previousGaveStampsLoading ||
      receivedStampsLoading ||
      previousReceivedStampsLoading,
    stats: {
      gaveStamps: gaveStamps[0]?.count ?? 0,
      messages: messages[0]?.count ?? 0,
      previousGaveStamps: previousRange ? (previousGaveStamps[0]?.count ?? 0) : undefined,
      previousMessages: previousRange ? (previousMessages[0]?.count ?? 0) : undefined,
      previousReceivedStamps: previousRange ? (previousReceivedStamps[0]?.count ?? 0) : undefined,
      receivedStamps: receivedStamps[0]?.count ?? 0,
    } satisfies PeriodStats,
  };
};

const PeriodStatsPanel: FC<{ stats: PeriodStats }> = ({ stats }) => {
  return (
    <SimpleGrid cols={{ base: 1, sm: 1, md: 3 }} spacing="xs">
      <ProfileMetric label="投稿数" previousValue={stats.previousMessages} value={stats.messages} />
      <ProfileMetric label="つけたスタンプ数" previousValue={stats.previousGaveStamps} value={stats.gaveStamps} />
      <ProfileMetric
        label="もらったスタンプ数"
        previousValue={stats.previousReceivedStamps}
        value={stats.receivedStamps}
      />
    </SimpleGrid>
  );
};

const ProfileMetric: FC<{ label: string; previousValue?: number; value: number }> = ({
  label,
  previousValue,
  value,
}) => {
  const trend = getTrend(value, previousValue);

  return (
    <Card className="h-32">
      <div className="flex h-full flex-col justify-between">
        <div className="flex justify-between items-center">
          <div className="traqing-stat-label text-sm font-semibold">{label}</div>
          <PeriodBadge kind="selected" />
        </div>
        <div>
          <span className="traqing-stat-value text-4xl font-semibold tabular-nums">{value.toLocaleString()}</span>
        </div>
        <Text size="sm" c={trend.color} fw={700} className="mt-1 flex items-center tabular-nums">
          {trend.label}
          <trend.Icon size={14} stroke={2} />
        </Text>
      </div>
    </Card>
  );
};

const PeriodStatSkeleton: FC<{ label: string }> = ({ label }) => (
  <Card className="h-32">
    <div className="flex h-full flex-col justify-between">
      <div className="flex justify-between items-center">
        <div className="traqing-stat-label text-sm font-semibold">{label}</div>
        <PeriodBadge kind="selected" />
      </div>
      <div className="h-10 flex items-center">
        <Skeleton h={32} />
      </div>
      <div className="h-5 flex items-center">
        <Skeleton h={16} />
      </div>
    </div>
  </Card>
);

const ProfilePanel: FC<{ displayName: string; name: string; user: ComponentProps<typeof UserAvatar>['user'] }> = ({
  displayName,
  name,
  user,
}) => (
  <Card className="h-32">
    <Group justify="space-between" align="flex-start" mb="sm">
      <div className="flex-1 flex flex-col gap-3">
        <div className="traqing-stat-label text-sm font-semibold">プロフィール</div>
        <Group wrap="nowrap" miw={0}>
          <UserAvatar user={user} size={56} />
          <div className="min-w-0">
            <Title order={4} size="h4" className="truncate">
              {displayName}
            </Title>
            <Text c="dimmed" truncate>
              @{name}
            </Text>
          </div>
        </Group>
      </div>
      <Button
        component={Link}
        size="xs"
        variant="default"
        to={`/users/${encodeURIComponent(name)}`}
        style={{ flexShrink: 0 }}
      >
        詳細
      </Button>
    </Group>
  </Card>
);

type AllTimeStats = {
  gaveStamps: { rank?: number; value: number };
  groups: { rank?: number; value: number };
  messages: { rank?: number; value: number };
  receivedStamps: { rank?: number; value: number };
  subscriptions: { rank?: number; value: number };
  tags: { rank?: number; value: number };
};

const useAllTimeStats = (userId: string) => {
  const { data: messages } = useMessagesRanking();
  const { data: gaveStamps } = useGaveMessageStampsRanking();
  const { data: receivedStamps } = useReceivedMessageStampsRanking();
  const { data: groups } = useGroupRanking('user');
  const { data: tags } = useTagRanking('user');
  const { data: subscriptions } = useSubscriptionRanking('user');

  return {
    loading: [messages, gaveStamps, receivedStamps, groups, tags, subscriptions].some((data) => data === undefined),
    stats:
      messages && gaveStamps && receivedStamps && groups && tags && subscriptions
        ? ({
            gaveStamps: getRankedValue(
              gaveStamps.findIndex((s) => s.user === userId),
              gaveStamps,
              'count',
            ),
            groups: getRankedValue(
              groups.findIndex((r) => r.group === userId),
              groups,
              'count',
            ),
            messages: getRankedValue(
              messages.findIndex((m) => m.user === userId),
              messages,
              'count',
            ),
            receivedStamps: getRankedValue(
              receivedStamps.findIndex((s) => s.messageUser === userId),
              receivedStamps,
              'count',
            ),
            subscriptions: getRankedValue(
              subscriptions.findIndex((r) => r.group === userId),
              subscriptions,
              'count',
            ),
            tags: getRankedValue(
              tags.findIndex((r) => r.group === userId),
              tags,
              'count',
            ),
          } satisfies AllTimeStats)
        : undefined,
  };
};

const DashboardUserInfo: FC<{
  me: ComponentProps<typeof UserAvatar>['user'] & { displayName: string; id: string; name: string };
  range?: [Date, Date];
}> = ({ me, range }) => {
  const { loading: periodStatsLoading, stats: periodStats } = usePeriodStats(range, me.id);
  const { loading: allTimeStatsLoading, stats: allTimeStats } = useAllTimeStats(me.id);

  if (periodStatsLoading || allTimeStatsLoading || allTimeStats === undefined) {
    return <DashboardUserInfoSkeleton />;
  }

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      <div className="xl:col-start-1 xl:row-start-1">
        <ProfilePanel displayName={me.displayName} name={me.name} user={me} />
      </div>
      <div className="xl:col-start-1 xl:row-start-2">
        <PeriodStatsPanel stats={periodStats} />
      </div>
      <div className="xl:col-start-2 xl:row-span-2 xl:row-start-1">
        <AllTimeStatsGrid stats={allTimeStats} />
      </div>
    </div>
  );
};

const DashboardUserInfoSkeleton: FC = () => (
  <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
    <div className="xl:col-start-1 xl:row-start-1">
      <ProfileSkeleton />
    </div>
    <div className="xl:col-start-1 xl:row-start-2">
      <SimpleGrid cols={{ base: 1, sm: 1, md: 3 }} spacing="xs">
        <PeriodStatSkeleton label="投稿数" />
        <PeriodStatSkeleton label="つけたスタンプ数" />
        <PeriodStatSkeleton label="もらったスタンプ数" />
      </SimpleGrid>
    </div>
    <div className="xl:col-start-2 xl:row-span-2 xl:row-start-1">
      <SimpleGrid cols={{ base: 1, xs: 2, md: 3 }} spacing="md">
        {['投稿数', 'つけたスタンプ', 'もらったスタンプ', 'グループ所属数', 'タグ数', 'チャンネル購読数'].map(
          (label) => (
            <AllTimeStatSkeleton key={label} label={label} />
          ),
        )}
      </SimpleGrid>
    </div>
  </div>
);

const AllTimeStatsGrid: FC<{ stats: AllTimeStats }> = ({ stats }) => (
  <SimpleGrid cols={{ base: 1, xs: 2, md: 3 }} spacing="md">
    <AllTimeStat label="投稿数" stat={stats.messages} />
    <AllTimeStat label="つけたスタンプ" stat={stats.gaveStamps} />
    <AllTimeStat label="もらったスタンプ" stat={stats.receivedStamps} />
    <AllTimeStat label="グループ所属数" stat={stats.groups} />
    <AllTimeStat label="タグ数" stat={stats.tags} />
    <AllTimeStat label="チャンネル購読数" stat={stats.subscriptions} />
  </SimpleGrid>
);

const AllTimeStat: FC<{ label: string; stat: { rank?: number; value: number } }> = ({ label, stat }) => (
  <Stat label={label} value={stat.value} annotation={stat.rank ? `全体${stat.rank}位` : undefined} />
);

const AllTimeStatSkeleton: FC<{ label: string }> = ({ label }) => (
  <Stat
    label={label}
    value={
      <div className="h-10 flex items-center">
        <Skeleton h={32} />
      </div>
    }
    annotation={
      <div className="h-5 flex items-center">
        <Skeleton h={16} />
      </div>
    }
  />
);

const RankingPanelSkeleton: FC<{ title: string }> = ({ title }) => (
  <Card>
    <Group justify="space-between" mb="sm">
      <Title order={3} size="h4">
        {title}
      </Title>
      <PeriodBadge kind="selected" />
    </Group>
    {[...Array(10)].map((_, i) => (
      <RankingItemSkeleton key={i} rank={i + 1} />
    ))}
  </Card>
);

const OverallHourlyMessagesTimeline: FC<{ range: [Date, Date] }> = ({ range }) => {
  const query = useMemo(
    () =>
      ({
        ...commonHoursQuery,
        orderBy: 'date',
        order: 'asc',
        ...dateRangeToQuery(range),
      }) satisfies MessagesQuery,
    [range],
  );
  const { messages } = useMessages(query);
  const data = {
    labels: hours.map((h) => `${h}:00`),
    datasets: [
      {
        label: '投稿数',
        data: getHourDataset(messages),
      },
    ],
  };

  return <Line options={commonHoursChartOption} data={data} height={300} />;
};

export const Dashboard: FC = () => {
  const range = useDateRangePicker('last-7-days');
  const { me } = useAuth();
  const realtimeRange = useMemo(() => dateRangeKinds['last-24-hours'].getRange() ?? getFallbackRealtimeRange(), []);

  return (
    <Stack gap="xl" w="100%">
      <Group justify="space-between" align="center" gap="md">
        <div>
          <Title order={1} size="h2">
            ダッシュボード
          </Title>
        </div>
        {range.render()}
      </Group>

      <DashboardSection title="自分の情報">
        {me ? <DashboardUserInfo me={me} range={range.value} /> : <DashboardUserInfoSkeleton />}
      </DashboardSection>

      <DashboardSection title="自分の活動">
        {me ? (
          <SimpleGrid cols={{ base: 1, lg: 3 }} spacing="md">
            <Card>
              <Group justify="space-between" mb="sm">
                <Title order={3} size="h4">
                  投稿先
                </Title>
                <PeriodBadge kind="selected" />
              </Group>
              <MessagesChannelRanking range={range.value} userId={me.id} />
            </Card>
            <Card>
              <Group justify="space-between" mb="sm">
                <Title order={3} size="h4">
                  使ったスタンプ
                </Title>
                <PeriodBadge kind="selected" />
              </Group>
              <StampRanking range={range.value} gaveUserId={me.id} />
            </Card>
            <Card>
              <Group justify="space-between" mb="sm">
                <Title order={3} size="h4">
                  もらったスタンプ
                </Title>
                <PeriodBadge kind="selected" />
              </Group>
              <StampRanking range={range.value} receivedUserId={me.id} />
            </Card>
          </SimpleGrid>
        ) : (
          <SimpleGrid cols={{ base: 1, lg: 3 }} spacing="md">
            <RankingPanelSkeleton title="投稿先" />
            <RankingPanelSkeleton title="使ったスタンプ" />
            <RankingPanelSkeleton title="もらったスタンプ" />
          </SimpleGrid>
        )}
      </DashboardSection>

      <DashboardSection title="全体の活動">
        <SimpleGrid cols={{ base: 1, xl: 3 }} spacing="md">
          <Card>
            <Group justify="space-between" mb="sm">
              <Title order={3} size="h4">
                投稿ユーザー
              </Title>
              <PeriodBadge kind="selected" />
            </Group>
            <MessagesUserRanking range={range.value} />
          </Card>
          <Card>
            <Group justify="space-between" mb="sm">
              <Title order={3} size="h4">
                投稿チャンネル
              </Title>
              <PeriodBadge kind="selected" />
            </Group>
            <MessagesChannelRanking range={range.value} />
          </Card>
          <Card>
            <Group justify="space-between" mb="sm">
              <Title order={3} size="h4">
                スタンプ
              </Title>
              <PeriodBadge kind="selected" />
            </Group>
            <StampRanking range={range.value} />
          </Card>
        </SimpleGrid>
      </DashboardSection>

      <DashboardSection title="リアルタイム">
        <SimpleGrid cols={{ base: 1, xl: 2 }} spacing="md">
          <Card style={{ alignSelf: 'start' }}>
            <Group justify="space-between" mb="sm">
              <Title order={3} size="h4">
                盛り上がっている投稿
              </Title>
              <Badge color="gray" variant="outline">
                過去24時間
              </Badge>
            </Group>
            <TopReactedMessages range={realtimeRange} stampId={null} limit={5} />
          </Card>
          <Stack gap="md">
            <Card>
              <Group justify="space-between" mb="sm">
                <Title order={3} size="h4">
                  投稿の流速
                </Title>
                <Badge color="gray" variant="outline">
                  過去24時間
                </Badge>
              </Group>
              <div className="h-80">
                <OverallHourlyMessagesTimeline range={realtimeRange} />
              </div>
            </Card>
            <Stack gap="md">
              <Card>
                <Group justify="space-between" mb="sm">
                  <Title order={3} size="h4">
                    投稿チャンネル
                  </Title>
                  <Badge color="gray" variant="outline">
                    過去24時間
                  </Badge>
                </Group>
                <MessagesChannelRanking range={realtimeRange} limit={10} onlyTopUsers={false} />
              </Card>
            </Stack>
          </Stack>
        </SimpleGrid>
      </DashboardSection>
    </Stack>
  );
};

const getFallbackRealtimeRange = (): [Date, Date] => [new Date(Date.now() - 24 * 60 * 60 * 1000), new Date()];

const getRankedValue = <T extends Record<K, number>, K extends keyof T>(
  index: number,
  data: T[],
  key: K,
): { rank?: number; value: number } => {
  if (index === -1) {
    return { value: 0 };
  }

  return {
    rank: index + 1,
    value: data[index][key],
  };
};

const getPreviousRange = (range?: [Date, Date]): [Date, Date] | undefined => {
  if (!range) return undefined;
  const duration = range[1].getTime() - range[0].getTime();
  if (duration <= 0) return undefined;
  return [new Date(range[0].getTime() - duration), new Date(range[0].getTime())];
};

const getTrend = (value: number, previousValue?: number) => {
  if (previousValue === undefined) {
    return {
      color: 'gray',
      Icon: IconMinus,
      label: '比較なし',
    };
  }

  const diff = value - previousValue;
  const color = diff > 0 ? 'green' : diff < 0 ? 'red' : 'gray';
  const Icon = diff > 0 ? IconArrowUpRight : diff < 0 ? IconArrowDownRight : IconArrowRight;
  if (previousValue === 0) {
    return {
      color,
      Icon,
      label: diff === 0 ? '0.0%' : `${diff > 0 ? '+' : ''}${diff.toLocaleString()}`,
    };
  }

  const rate = (diff / previousValue) * 100;
  return {
    color,
    Icon,
    label: `${rate > 0 ? '+' : ''}${rate.toFixed(1)}%`,
  };
};
