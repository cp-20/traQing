import { Card } from '@/components/Card';
import { Container, ContainerTitle } from '@/components/containers/Container';
import { MessageIcon } from '@/components/icons/MessageIcon';
import { TopReactedMessages } from '@/components/messages/TopReactedMessages';
import { useStampPicker } from '@/composables/useStampPicker';
import type { FC } from 'react';

export const MessageOverviewPage: FC = () => {
  const picker = useStampPicker();
  return (
    <Container>
      <ContainerTitle>
        <MessageIcon className="size-8" />
        <span className="ml-2 text-2xl font-bold">メッセージ</span>
      </ContainerTitle>

      <Card className="space-y-2">
        <h2 className="text-lg font-semibold mb-2">多くのスタンプをつけられたメッセージ</h2>
        <div>{picker.render()}</div>
        <TopReactedMessages stampId={picker.stampId} />
      </Card>
    </Container>
  );
};
