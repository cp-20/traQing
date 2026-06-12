import { Group, RingProgress, SegmentedControl, Stack, Text, Title } from '@mantine/core';
import type { MessagesQuery } from '@traq-ing/database';
import type { FC } from 'react';
import { useMemo } from 'react';
import { useState } from 'react';
import { Card } from '@/components/Card';
import { Container, ContainerTitle } from '@/components/containers/Container';
import { NotificationIcon } from '@/components/NotificationIcon';
import { MessagesChannelRankingWithSubscription } from '@/components/rankings/ChannelRanking';
import { type DateRange, dateRangeToQuery, useDateRangePicker } from '@/composables/useDateRangePicker';
import { useMessages } from '@/hooks/useMessages';
import { useSubscriptions } from '@/hooks/useSubscriptions';

const SubscriptionRate: FC<{ range?: DateRange }> = ({ range }) => {
  const { getSubscriptionLevel } = useSubscriptions();
  const query = useMemo(
    () =>
      ({
        target: 'count',
        groupBy: 'channel',
        orderBy: 'target',
        order: 'desc',
        ...(range && dateRangeToQuery(range)),
      }) satisfies MessagesQuery,
    [range],
  );
  const { messages } = useMessages(query);
  const allMessagesCount = messages.map((m) => m.count).reduce((a, b) => a + b, 0);
  const subscribedCount = messages
    .filter((m) => getSubscriptionLevel(m.channel) > 0)
    .map((m) => m.count)
    .reduce((a, b) => a + b, 0);
  const rate = allMessagesCount === 0 ? 0 : (subscribedCount / allMessagesCount) * 100;
  const rateLabel = `${rate.toFixed(1)}%`;

  return (
    <Group gap="xs" wrap="nowrap">
      <RingProgress size={52} thickness={5} sections={[{ value: rate, color: 'blue' }]} />
      <div>
        <Text size="xs" c="dimmed">
          購読率
        </Text>
        <Text size="sm" fw={700} className="tabular-nums" span>
          {rateLabel}
        </Text>{' '}
        <Text size="xs" c="dimmed" className="tabular-nums" span>
          {subscribedCount}/{allMessagesCount}
        </Text>
      </div>
    </Group>
  );
};

export const SubscriptionSettingsPage: FC = () => {
  const picker = useDateRangePicker('last-30-days');
  const [filter, setFilter] = useState<'all' | 'unread' | 'notify'>('all');
  const subscriptionFilter = filter === 'unread' ? 1 : filter === 'notify' ? 2 : undefined;
  return (
    <Container>
      <ContainerTitle actions={picker.render()}>
        <NotificationIcon level={2} className="size-8" />
        <span>通知管理</span>
      </ContainerTitle>

      <Card>
        <Stack gap="md">
          <Group justify="space-between">
            <Title order={2} size="h4">
              チャンネル
            </Title>
            <Group>
              <SegmentedControl
                value={filter}
                onChange={(v) => setFilter(v as typeof filter)}
                data={[
                  { value: 'all', label: 'すべて' },
                  { value: 'unread', label: '未読管理' },
                  { value: 'notify', label: '通知のみ' },
                ]}
              />
              <SubscriptionRate range={picker.value} />
            </Group>
          </Group>
          <MessagesChannelRankingWithSubscription
            limit={100}
            range={picker.value}
            subscriptionFilter={subscriptionFilter}
          />
        </Stack>
      </Card>
    </Container>
  );
};
