import { Badge, Group, Title } from '@mantine/core';
import type { FC } from 'react';
import { Card } from '@/components/Card';
import { Container, ContainerTitle } from '@/components/containers/Container';
import { ChannelActionHours } from '@/components/hours/ChannelActionHours';
import { ChannelIcon } from '@/components/icons/ChannelIcon';
import { TopReactedMessages } from '@/components/messages/TopReactedMessages';
import { StampRanking } from '@/components/rankings/StampRanking';
import { MessagesUserRanking, StampsGaveUserRanking } from '@/components/rankings/UserRanking';
import {
  ChannelMessageCountStat,
  ChannelStampCountStat,
  ChannelSubscribersCountStat,
} from '@/components/stats/ChannelStats';
import { ChannelActionTimeline } from '@/components/timelines/ChannelActionTimeline';
import { StampPicker, useStampPicker } from '@/composables/useStampPicker';
import { useDateRangePicker } from '@/composables/useDateRangePicker';
import { useChannels } from '@/hooks/useChannels';

type Props = {
  channelId: string;
};

export const ChannelDetail: FC<Props> = ({ channelId }) => {
  const stampPicker = useStampPicker();
  const range = useDateRangePicker('last-30-days');
  const { getChannelName } = useChannels();
  const channelName = getChannelName(channelId);

  if (channelName === undefined) return null;

  return (
    <Container>
      <ContainerTitle actions={range.render()}>
        <ChannelIcon className="size-10 -mr-1" />
        <div className="text-2xl font-semibold pb-1">{channelName}</div>
      </ContainerTitle>
      <div className="grid grid-cols-2 sm:gap-8 gap-4 max-lg:grid-cols-1">
        <div className="flex flex-col sm:gap-8 gap-4 @container">
          <div className="grid grid-cols-3 gap-4 auto-rows-min max-xs:grid-cols-1">
            <ChannelMessageCountStat channelId={channelId} />
            <ChannelStampCountStat channelId={channelId} />
            <ChannelSubscribersCountStat channelId={channelId} />
          </div>
          <Card>
            <Group justify="space-between" mb="sm">
              <Title order={2} size="h5">
                スタンプ
              </Title>
              <Badge color="gray" variant="outline">
                選択期間
              </Badge>
            </Group>
            <StampRanking range={range.value} channelId={channelId} />
          </Card>
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
              <TopReactedMessages range={range.value} stampId={stampPicker.stampId} channelId={channelId} />
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
              <ChannelActionTimeline channelId={channelId} range={range.value} />
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
              <ChannelActionHours channelId={channelId} range={range.value} />
            </div>
          </Card>
          <Card>
            <Group justify="space-between" mb="md">
              <Title order={2} size="h5">
                よく投稿するユーザー
              </Title>
              <Badge color="gray" variant="outline">
                選択期間
              </Badge>
            </Group>
            <div>
              <MessagesUserRanking range={range.value} channelId={channelId} />
            </div>
          </Card>
          <Card>
            <Group justify="space-between" mb="md">
              <Title order={2} size="h5">
                よくスタンプを付けるユーザー
              </Title>
              <Badge color="gray" variant="outline">
                選択期間
              </Badge>
            </Group>
            <div>
              <StampsGaveUserRanking range={range.value} channelId={channelId} />
            </div>
          </Card>
          <Card>
            <Group justify="space-between" mb="md">
              <Title order={2} size="h5">
                よく使われるスタンプ
              </Title>
              <Badge color="gray" variant="outline">
                選択期間
              </Badge>
            </Group>
            <div>
              <StampRanking range={range.value} channelId={channelId} />
            </div>
          </Card>
        </div>
      </div>
    </Container>
  );
};
