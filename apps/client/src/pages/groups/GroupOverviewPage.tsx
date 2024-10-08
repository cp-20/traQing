import { Card } from '@/components/Card';
import { Container, ContainerTitle } from '@/components/containers/Container';
import { GroupIcon } from '@/components/icons/GroupIcon';
import { useGroups } from '@/hooks/useGroups';
import { searchGroups } from '@/lib/search';
import { TextInput, Skeleton } from '@mantine/core';
import { useState, type FC } from 'react';
import { Link } from 'react-router-dom';

const SearchGroupBlock: FC = () => {
  const [keyword, setKeyword] = useState<string>('');
  const { groups } = useGroups();

  const filteredGroups = groups && searchGroups(groups, keyword);

  return (
    <div className="space-y-4">
      <TextInput placeholder="グループ名" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
      <div className="h-96 overflow-y-scroll border rounded text-text-primary">
        {filteredGroups?.slice(0, 100).map((group) => (
          <Link
            key={group.id}
            to={`/groups/${group.name}`}
            className="flex items-center gap-2 px-4 py-2 hover:bg-blue-100 transition-colors duration-200"
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
        <span className="text-2xl font-bold">グループ</span>
      </ContainerTitle>

      <Card>
        <h2 className="text-lg font-semibold mb-2">グループ検索</h2>
        <SearchGroupBlock />
      </Card>
    </Container>
  );
};
