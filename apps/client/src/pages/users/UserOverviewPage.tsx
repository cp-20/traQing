import { Badge, Group, Skeleton, Stack, Text, TextInput, Title } from '@mantine/core';
import { type FC, useState } from 'react';
import { Link } from 'react-router';
import { Card } from '@/components/Card';
import { Container, ContainerTitle } from '@/components/containers/Container';
import { UserIcon } from '@/components/icons/UserIcon';
import {
  MessagesUserRanking,
  StampsGaveUserRanking,
  StampsReceivedUserRanking,
} from '@/components/rankings/UserRanking';
import { TopUserMessagesTimeline } from '@/components/timelines/TopMessagesTimeline';
import { UserAvatar } from '@/components/UserAvatar';
import { StampPicker, useStampPicker } from '@/composables/useStampPicker';
import { useDateRangePicker } from '@/composables/useDateRangePicker';
import { useUsers } from '@/hooks/useUsers';
import { searchUsers } from '@/lib/search';

const SearchUserBlock: FC = () => {
  const [keyword, setKeyword] = useState<string>('');
  const { users } = useUsers();

  const filteredUsers = users && searchUsers(users, keyword);

  return (
    <div className="space-y-4">
      <TextInput placeholder="ユーザー名" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
      <div className="traqing-search-list h-96 overflow-y-scroll">
        {filteredUsers?.slice(0, 100).map((user) => (
          <Link
            key={user.id}
            to={`/users/${encodeURIComponent(user.name)}`}
            className="traqing-search-row flex items-center gap-2 px-4 py-2 transition-colors duration-150"
          >
            <UserAvatar user={user} />
            <span className="font-semibold">{user.displayName}</span>
            <span className="text-gray-400">@{user.name}</span>
          </Link>
        )) ??
          [...Array(10)].map((_, i) => (
            <div key={i} className="h-10 flex items-center gap-2 px-4">
              <Skeleton circle h={24} w={24} />
              <Skeleton h={24} />
            </div>
          ))}
        {filteredUsers?.length === 0 && (
          <div className="grid place-content-center h-full text-gray-600">お探しのユーザーは見つかりませんでした</div>
        )}
      </div>
    </div>
  );
};

export const UserOverviewPage: FC = () => {
  const picker = useStampPicker();
  const range = useDateRangePicker('last-30-days');
  return (
    <Container>
      <ContainerTitle actions={range.render()}>
        <UserIcon className="size-8" />
        <span>ユーザー</span>
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
          <div>
            <MessagesUserRanking limit={20} range={range.value} />
          </div>

          <div className="flex flex-col">
            <div className="flex-1">
              <TopUserMessagesTimeline range={range.value} />
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <Group justify="space-between" mb="sm">
          <Title order={2} size="h4">
            つけた/もらったスタンプのランキング
          </Title>
          <Badge color="gray" variant="outline">
            選択期間
          </Badge>
        </Group>
        <div className="mb-4">
          <StampPicker reducer={picker} />
        </div>
        <div className="grid grid-cols-2 max-lg:grid-cols-1 gap-4">
          <div>
            <h3 className="font-semibold mb-2">つけたスタンプ</h3>
            <StampsGaveUserRanking limit={20} range={range.value} stampId={picker.stampId ?? undefined} />
          </div>

          <div>
            <h3 className="font-semibold mb-2">もらったスタンプ</h3>
            <StampsReceivedUserRanking limit={20} range={range.value} stampId={picker.stampId ?? undefined} />
          </div>
        </div>
      </Card>

      <Card>
        <Stack gap="sm">
          <Group justify="space-between">
            <Title order={2} size="h4">
              ユーザー検索
            </Title>
            <Text size="sm" c="dimmed">
              全ユーザー
            </Text>
          </Group>
          <SearchUserBlock />
        </Stack>
      </Card>
    </Container>
  );
};
