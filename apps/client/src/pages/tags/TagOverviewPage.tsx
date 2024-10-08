import { Card } from '@/components/Card';
import { Container, ContainerTitle } from '@/components/containers/Container';
import { TagIcon } from '@/components/icons/TagIcon';
import { TagRanking } from '@/components/rankings/TagRanking';
import { useTagRanking } from '@/hooks/useServerData';
import { searchTags } from '@/lib/search';
import { TextInput, Skeleton } from '@mantine/core';
import { useState, type FC } from 'react';
import { Link } from 'react-router-dom';

const SearchTagBlock: FC = () => {
  const [keyword, setKeyword] = useState<string>('');
  const { data } = useTagRanking('tag');
  const tags = data?.map((d) => d.group);

  const filteredTags = tags && searchTags(tags, keyword);

  return (
    <div className="space-y-4">
      <TextInput placeholder="タグ名" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
      <div className="h-96 overflow-y-scroll border rounded text-text-primary">
        {filteredTags?.slice(0, 100).map((tag) => (
          <Link
            key={tag}
            to={`/tags/${encodeURIComponent(tag)}`}
            className="flex items-center gap-2 px-4 py-2 hover:bg-blue-100 transition-colors duration-200"
          >
            <TagIcon />
            <span>{tag}</span>
          </Link>
        )) ??
          [...Array(10)].map((_, i) => (
            <div key={i} className="h-10 flex items-center gap-2 px-4">
              <Skeleton h={24} />
            </div>
          ))}
        {filteredTags?.length === 0 && (
          <div className="grid place-content-center h-full text-gray-600">お探しのタグは見つかりませんでした</div>
        )}
      </div>
    </div>
  );
};

export const TagOverviewPage: FC = () => {
  return (
    <Container>
      <ContainerTitle>
        <TagIcon className="size-8" />
        <span className="ml-2 text-2xl font-bold">タグ</span>
      </ContainerTitle>

      <Card>
        <h2 className="text-lg font-semibold mb-2">タグランキング</h2>
        <TagRanking limit={20} />
      </Card>

      <Card>
        <h2 className="text-lg font-semibold mb-2">タグ検索</h2>
        <SearchTagBlock />
      </Card>
    </Container>
  );
};
