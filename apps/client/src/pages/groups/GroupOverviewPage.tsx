import { Group, Skeleton, Stack, Text, TextInput, Title } from '@mantine/core';
import { type FC, useState } from 'react';
import { Link } from 'react-router';
import { Card } from '@/components/Card';
import { Container, ContainerTitle } from '@/components/containers/Container';
import { GroupIcon } from '@/components/icons/GroupIcon';
import { GroupMembersRanking } from '@/components/rankings/GroupRanking';
import { useGroups } from '@/hooks/useGroups';
import { searchGroups } from '@/lib/search';

const SearchGroupBlock: FC = () => {
  const [keyword, setKeyword] = useState<string>('');
  const { groups } = useGroups();

  const filteredGroups = groups && searchGroups(groups, keyword);

  return (
    <div className="space-y-4">
      <TextInput placeholder="グループ名" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
      <div className="traqing-search-list h-96 overflow-y-scroll">
        {filteredGroups?.slice(0, 100).map((group) => (
          <Link
            key={group.id}
            to={`/groups/${group.name}`}
            className="traqing-search-row flex items-center gap-2 px-4 py-2 transition-colors duration-150"
          >
            <span>@{group.name}</span>
          </Link>
        )) ??
          [...Array(10)].map((_, i) => (
            <div key={i} className="h-10 flex items-center gap-2 px-4">
              <Skeleton h={24} />
            </div>
          ))}
        {filteredGroups?.length === 0 && (
          <div className="grid place-content-center h-full text-gray-600">お探しのグループは見つかりませんでした</div>
        )}
      </div>
    </div>
  );
};

export const GroupOverviewPage: FC = () => {
  return (
    <Container>
      <ContainerTitle>
        <GroupIcon className="size-8" />
        <span>グループ</span>
      </ContainerTitle>

      <Card>
        <Group justify="space-between" mb="sm">
          <Title order={2} size="h4">
            メンバー数ランキング
          </Title>
          <Text size="sm" c="dimmed">
            現在値
          </Text>
        </Group>
        <GroupMembersRanking limit={20} />
      </Card>

      <Card>
        <Stack gap="sm">
          <Group justify="space-between">
            <Title order={2} size="h4">
              グループ検索
            </Title>
            <Text size="sm" c="dimmed">
              全グループ
            </Text>
          </Group>
          <SearchGroupBlock />
        </Stack>
      </Card>
    </Container>
  );
};
