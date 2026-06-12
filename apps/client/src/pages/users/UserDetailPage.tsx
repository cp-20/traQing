import { Badge, Group, Title } from '@mantine/core';
import type { FC } from 'react';
import { useOutletContext } from 'react-router';
import { Card } from '@/components/Card';
import { Container, ContainerTitle } from '@/components/containers/Container';
import { UserActionHours } from '@/components/hours/UserActionHours';
import { TopReactedMessages } from '@/components/messages/TopReactedMessages';
import { MessagesChannelRanking, StampsChannelRanking } from '@/components/rankings/ChannelRanking';
import { StampRanking } from '@/components/rankings/StampRanking';
import {
  UserGaveStampStat,
  UserGroupStat,
  UserMessageCountStat,
  UserReceivedStampStat,
  UserSubscriptionStat,
  UserTagStat,
} from '@/components/stats/UserStats';
import { UserActionTimeline } from '@/components/timelines/UserActionTimeline';
import { UserAvatar } from '@/components/UserAvatar';
import { StampPicker, useStampPicker } from '@/composables/useStampPicker';
import { useDateRangePicker } from '@/composables/useDateRangePicker';
import { useUsers } from '@/hooks/useUsers';
import type { UserContext } from '@/pages/users/UserGuard';

export const UserDetailPage: FC = () => {
  const { userId } = useOutletContext() as UserContext;
  const stampPicker = useStampPicker();
  const range = useDateRangePicker('last-30-days');
  const { getUserFromId } = useUsers();
  const user = getUserFromId(userId);

  if (user === undefined) return null;

  return (
    <Container>
      <ContainerTitle actions={range.render()}>
        <div>
          <UserAvatar user={user} size={128} loading="eager" />
        </div>
        <div className="ml-4">
          <div className="text-2xl font-semibold">{user.displayName}</div>
          <div className="text-gray-500">@{user.name}</div>
        </div>
      </ContainerTitle>
      <div className="grid grid-cols-2 sm:gap-8 gap-4 max-lg:grid-cols-1">
        <div className="flex flex-col sm:gap-8 gap-4 @container">
          <div className="grid grid-cols-3 gap-4 auto-rows-min max-xs:grid-cols-1">
            <UserMessageCountStat userId={userId} />
            <UserGaveStampStat userId={userId} />
            <UserReceivedStampStat userId={userId} />
            <UserGroupStat userId={userId} />
            <UserTagStat userId={userId} />
            <UserSubscriptionStat userId={userId} />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:gap-8 @lg:grid-cols-2 sm:@lg:gap-4">
            <Card>
              <Group justify="space-between" mb="sm">
                <Title order={2} size="h5">
                  つけたスタンプ
                </Title>
                <Badge color="gray" variant="outline">
                  選択期間
                </Badge>
              </Group>
              <StampRanking range={range.value} gaveUserId={userId} />
            </Card>
            <Card>
              <Group justify="space-between" mb="sm">
                <Title order={2} size="h5">
                  もらったスタンプ
                </Title>
                <Badge color="gray" variant="outline">
                  選択期間
                </Badge>
              </Group>
              <StampRanking range={range.value} receivedUserId={userId} />
            </Card>
          </div>
          <Card>
            <Group justify="space-between" mb="md">
              <Title order={2} size="h5">
                リアクションの多い投稿
              </Title>
              <Badge color="gray" variant="outline">
                選択期間
              </Badge>
            </Group>
            <div className="space-y-2">
              <StampPicker reducer={stampPicker} />
              <TopReactedMessages range={range.value} stampId={stampPicker.stampId} receivedUserId={userId} />
            </div>
          </Card>
        </div>
        <div className="flex flex-col sm:gap-8 gap-4">
          <Card>
            <Group justify="space-between" mb="md">
              <Title order={2} size="h5">
                各アクションの時系列遷移
              </Title>
              <Badge color="gray" variant="outline">
                選択期間
              </Badge>
            </Group>
            <div>
              <UserActionTimeline userId={userId} range={range.value} />
            </div>
          </Card>
          <Card>
            <Group justify="space-between" mb="md">
              <Title order={2} size="h5">
                各アクションの時間帯
              </Title>
              <Badge color="gray" variant="outline">
                選択期間
              </Badge>
            </Group>
            <div>
              <UserActionHours userId={userId} range={range.value} />
            </div>
          </Card>
          <Card>
            <Group justify="space-between" mb="md">
              <Title order={2} size="h5">
                よく投稿するチャンネル
              </Title>
              <Badge color="gray" variant="outline">
                選択期間
              </Badge>
            </Group>
            <div>
              <MessagesChannelRanking range={range.value} userId={userId} limit={20} />
            </div>
          </Card>
          <Card>
            <Group justify="space-between" mb="md">
              <Title order={2} size="h5">
                スタンプをよく付けるチャンネル
              </Title>
              <Badge color="gray" variant="outline">
                選択期間
              </Badge>
            </Group>
            <div>
              <StampsChannelRanking range={range.value} gaveUserId={userId} />
            </div>
          </Card>
          <Card>
            <Group justify="space-between" mb="md">
              <Title order={2} size="h5">
                スタンプをよく付けられるチャンネル
              </Title>
              <Badge color="gray" variant="outline">
                選択期間
              </Badge>
            </Group>
            <div>
              <StampsChannelRanking range={range.value} receivedUserId={userId} />
            </div>
          </Card>
        </div>
      </div>
    </Container>
  );
};
