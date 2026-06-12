import { Badge, Group, Title } from '@mantine/core';
import type { FC } from 'react';
import { Card } from '@/components/Card';
import { Container, ContainerTitle } from '@/components/containers/Container';
import { MessageIcon } from '@/components/icons/MessageIcon';
import { TopReactedMessages } from '@/components/messages/TopReactedMessages';
import { StampPicker, useStampPicker } from '@/composables/useStampPicker';
import { useDateRangePicker } from '@/composables/useDateRangePicker';

export const MessageOverviewPage: FC = () => {
  const picker = useStampPicker();
  const range = useDateRangePicker('last-30-days');
  return (
    <Container>
      <ContainerTitle actions={range.render()}>
        <MessageIcon className="size-8" />
        <span>メッセージ</span>
      </ContainerTitle>

      <Card className="space-y-2">
        <Group justify="space-between" mb="sm">
          <Title order={2} size="h4">
            多くのスタンプをつけられたメッセージ
          </Title>
          <Badge color="gray" variant="outline">
            選択期間
          </Badge>
        </Group>
        <div>
          <StampPicker reducer={picker} />
        </div>
        <TopReactedMessages range={range.value} stampId={picker.stampId} />
      </Card>
    </Container>
  );
};
