import { Badge, Group, Skeleton, Stack, Text, TextInput, Title } from '@mantine/core';
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
import { useDateRangePicker } from '@/composables/useDateRangePicker';
import { useChannels } from '@/hooks/useChannels';
import { searchChannels } from '@/lib/search';

const SearchChannelBlock: FC = () => {
  const [keyword, setKeyword] = useState<string>('');
  const { channels, getChannelName } = useChannels();

  const filteredChannels = channels && searchChannels(channels, keyword);

  return (
    <div className="space-y-4">
      <TextInput placeholder="チャンネル名" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
      <div className="traqing-search-list h-96 overflow-y-scroll">
        {filteredChannels?.slice(0, 200).map((channel) => (
          <Link
            key={channel.id}
            to={`/channels/${getChannelName(channel.id)}`}
            className="traqing-search-row flex items-center gap-2 px-4 py-2 transition-colors duration-150"
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
  const range = useDateRangePicker('last-30-days');
  return (
    <Container>
      <ContainerTitle actions={range.render()}>
        <ChannelIcon className="size-8" />
        <span>チャンネル</span>
      </ContainerTitle>

      <Card>
        <Group justify="space-between" mb="sm">
          <Title order={2} size="h4">
            投稿数ランキング
          </Title>
          <Badge color="gray" variant="outline">
            選択期間
          </Badge>
        </Group>
        <div className="grid grid-cols-2 max-lg:grid-cols-1 gap-4">
          <MessagesChannelRanking limit={20} range={range.value} />
          <div>
            <TopChannelMessagesTimeline range={range.value} />
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 max-lg:grid-cols-1 gap-4">
        <Card>
          <Group justify="space-between" mb="sm">
            <Title order={2} size="h4">
              つけられたスタンプのランキング
            </Title>
            <Badge color="gray" variant="outline">
              選択期間
            </Badge>
          </Group>
          <div className="mb-4">
            <StampPicker reducer={picker} />
          </div>
          <StampsChannelRanking limit={20} range={range.value} stampId={picker.stampId ?? undefined} />
        </Card>

        <Card>
          <Group justify="space-between" mb="sm">
            <Title order={2} size="h4">
              メンバー数ランキング
            </Title>
            <Text size="sm" c="dimmed">
              現在値
            </Text>
          </Group>
          <SubscribersChannelRanking limit={20} />
        </Card>
      </div>

      <Card>
        <Stack gap="sm">
          <Group justify="space-between">
            <Title order={2} size="h4">
              チャンネル検索
            </Title>
            <Text size="sm" c="dimmed">
              全チャンネル
            </Text>
          </Group>
          <SearchChannelBlock />
        </Stack>
      </Card>
    </Container>
  );
};
