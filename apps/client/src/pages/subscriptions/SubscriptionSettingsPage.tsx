import { Card } from '@/components/Card';
import { Container, ContainerTitle } from '@/components/containers/Container';
import { NotificationIcon } from '@/components/NotificationIcon';
import { MessagesChannelRankingWithSubscription } from '@/components/rankings/ChannelRanking';
import { useDateRangePicker } from '@/composables/useDateRangePicker';
import type { FC } from 'react';

export const SubscriptionSettingsPage: FC = () => {
  const picker = useDateRangePicker('last-30-days');
  return (
    <Container>
      <ContainerTitle>
        <NotificationIcon level={2} className="size-8" />
        <span className="ml-2 text-2xl font-bold">通知管理</span>
      </ContainerTitle>

      <div className="flex justify-end">{picker.render()}</div>
      <Card>
        <MessagesChannelRankingWithSubscription limit={100} range={picker.value} />
      </Card>
    </Container>
  );
};
