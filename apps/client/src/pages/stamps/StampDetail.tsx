import { Badge, Group, Title } from '@mantine/core';
import type { FC } from 'react';
import { Card } from '@/components/Card';
import { Container, ContainerTitle } from '@/components/containers/Container';
import { StampHours } from '@/components/hours/StampHours';
import { TopReactedMessages } from '@/components/messages/TopReactedMessages';
import { StampsChannelRanking } from '@/components/rankings/ChannelRanking';
import { StampsGaveUserRanking, StampsReceivedUserRanking } from '@/components/rankings/UserRanking';
import { StampImage } from '@/components/StampImage';
import { RangeStampCountStat, StampCountStat } from '@/components/stats/StampStats';
import { StampTimeline } from '@/components/timelines/StampTimeline';
import { dateRangeKinds, useDateRangePicker } from '@/composables/useDateRangePicker';
import { useMessageStamps } from '@/hooks/useMessageStamps';
import { assert } from '@/lib/invariant';

type Props = {
  stampId: string;
};

export const StampDetail: FC<Props> = ({ stampId }) => {
  const { getStamp } = useMessageStamps();
  const range = useDateRangePicker('last-30-days');
  const stamp = getStamp(stampId);
  assert(stamp);

  return (
    <Container>
      <ContainerTitle actions={range.render()}>
        <div>
          <StampImage stampId={stampId} size={64} loading="eager" />
        </div>
        <div className="ml-4">
          <div className="text-2xl font-semibold">:{stamp.name}:</div>
        </div>
      </ContainerTitle>
      <div className="grid grid-cols-2 sm:gap-8 gap-4 max-lg:grid-cols-1">
        <div className="flex flex-col sm:gap-8 gap-4 @container">
          <div className="grid grid-cols-3 gap-4 auto-rows-min max-xs:grid-cols-1">
            <StampCountStat stampId={stampId} />
            <RangeStampCountStat
              stampId={stampId}
              range={dateRangeKinds['last-30-days'].getRange()}
              label={`押された回数 (${dateRangeKinds['last-30-days'].label})`}
            />
            <RangeStampCountStat
              stampId={stampId}
              range={dateRangeKinds['last-7-days'].getRange()}
              label={`押された回数 (${dateRangeKinds['last-7-days'].label})`}
            />
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
            <TopReactedMessages range={range.value} stampId={stampId} />
          </Card>
        </div>
        <div className="flex flex-col sm:gap-8 gap-4">
          <Card>
            <Group justify="space-between" mb="md">
              <Title order={2} size="h5">
                リアクション数の時系列遷移
              </Title>
              <Badge color="gray" variant="outline">
                選択期間
              </Badge>
            </Group>
            <div>
              <StampTimeline stampId={stampId} range={range.value} />
            </div>
          </Card>
          <Card>
            <Group justify="space-between" mb="md">
              <Title order={2} size="h5">
                リアクションの時間帯
              </Title>
              <Badge color="gray" variant="outline">
                選択期間
              </Badge>
            </Group>
            <div>
              <StampHours stampId={stampId} range={range.value} />
            </div>
          </Card>
          <Card>
            <Group justify="space-between" mb="sm">
              <Title order={2} size="h5">
                つけた人
              </Title>
              <Badge color="gray" variant="outline">
                選択期間
              </Badge>
            </Group>
            <StampsGaveUserRanking range={range.value} stampId={stampId} />
          </Card>
          <Card>
            <Group justify="space-between" mb="sm">
              <Title order={2} size="h5">
                つけられた人
              </Title>
              <Badge color="gray" variant="outline">
                選択期間
              </Badge>
            </Group>
            <StampsReceivedUserRanking range={range.value} stampId={stampId} />
          </Card>
          <Card>
            <Group justify="space-between" mb="sm">
              <Title order={2} size="h5">
                よく使われるチャンネル
              </Title>
              <Badge color="gray" variant="outline">
                選択期間
              </Badge>
            </Group>
            <StampsChannelRanking range={range.value} stampId={stampId} />
          </Card>
        </div>
      </div>
    </Container>
  );
};
