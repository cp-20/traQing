import { Skeleton, TextInput } from '@mantine/core';
import { type FC, useState } from 'react';
import { Link } from 'react-router';
import { Card } from '@/components/Card';
import { Container, ContainerTitle } from '@/components/containers/Container';
import { ChannelIcon } from '@/components/icons/ChannelIcon';
import {
  MessagesChannelRanking,
  StampsChannelRanking,
  SubscribersChannelRanking,
} from '@/components/rankings/ChannelRanking';
import { TopChannelMessagesTimeline } from '@/components/timelines/TopMessagesTimeline';
import { StampPicker, useStampPicker } from '@/composables/useStampPicker';
import { useChannels } from '@/hooks/useChannels';
import { searchChannels } from '@/lib/search';

const SearchChannelBlock: FC = () => {
  const [keyword, setKeyword] = useState<string>('');
  const { channels, getChannelName } = useChannels();

  const filteredChannels = channels && searchChannels(channels, keyword);

  return (
    <div className="space-y-4">
      <TextInput placeholder="チャンネル名" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
      <div className="h-96 overflow-y-scroll border border-gray-200 rounded text-text-primary">
        {filteredChannels?.slice(0, 200).map((channel) => (
          <Link
            key={channel.id}
            to={`/channels/${getChannelName(channel.id)}`}
            className="flex items-center gap-2 px-4 py-2 hover:bg-blue-100 transition-colors duration-200"
          >
            <ChannelIcon />
            <span>{getChannelName(channel.id)}</span>
          </Link>
        )) ??
          [...Array(10)].map((_, i) => (
            <div key={i} className="h-10 flex items-center gap-2 px-4">
              <Skeleton circle h={24} w={24} />
              <Skeleton h={24} />
            </div>
          ))}
        {filteredChannels?.length === 0 && (
          <div className="grid place-content-center h-full text-gray-600">お探しのチャンネルは見つかりませんでした</div>
        )}
      </div>
    </div>
  );
};

export const ChannelOverviewPage: FC = () => {
  const picker = useStampPicker();
  return (
    <Container>
      <ContainerTitle>
        <ChannelIcon className="size-8" />
        <span className="text-2xl font-bold">チャンネル</span>
      </ContainerTitle>

      <Card>
        <h2 className="text-lg font-semibold mb-2">投稿数ランキング</h2>
        <div className="grid grid-cols-2 max-lg:grid-cols-1 gap-4">
          <MessagesChannelRanking limit={20} />
          <div>
            <TopChannelMessagesTimeline />
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 max-lg:grid-cols-1 gap-4">
        <Card>
          <h2 className="text-lg font-semibold mb-2">つけられたスタンプのランキング</h2>
          <div className="mb-4">
            <StampPicker reducer={picker} />
          </div>
          <StampsChannelRanking limit={20} stampId={picker.stampId ?? undefined} />
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-2">メンバー数ランキング</h2>
          <SubscribersChannelRanking limit={20} />
        </Card>
      </div>

      <Card>
        <h2 className="text-lg font-semibold mb-2">チャンネル検索</h2>
        <SearchChannelBlock />
      </Card>
    </Container>
  );
};
