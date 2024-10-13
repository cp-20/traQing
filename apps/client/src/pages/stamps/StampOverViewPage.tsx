import { Card } from '@/components/Card';
import { Container, ContainerTitle } from '@/components/containers/Container';
import { StampIcon } from '@/components/icons/StampIcon';
import { StampRanking } from '@/components/rankings/StampRanking';
import { TopStampsTimeline } from '@/components/timelines/TopStampsTimeline';
import { StampImage } from '@/composables/useStampPicker';
import { useMessageStamps } from '@/hooks/useMessageStamps';
import { searchStamps } from '@/lib/search';
import { Skeleton, TextInput } from '@mantine/core';
import { useState, type FC } from 'react';
import { Link } from 'react-router-dom';

const SearchStampBlock: FC = () => {
  const [keyword, setKeyword] = useState<string>('');
  const { stamps } = useMessageStamps();

  const filteredStamps = stamps && searchStamps(stamps, keyword);

  return (
    <div className="space-y-4">
      <TextInput placeholder="スタンプ名" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
      <div className="h-96 overflow-y-scroll border rounded text-text-primary">
        {filteredStamps?.slice(0, 100).map((stamp) => (
          <Link
            key={stamp.id}
            to={`/stamps/${stamp.name}`}
            className="flex items-center gap-2 px-4 py-2 hover:bg-blue-100 transition-colors duration-200"
          >
            <StampImage stampId={stamp.id} />
            <span>:{stamp.name}:</span>
          </Link>
        )) ??
          [...Array(10)].map((_, i) => (
            <div key={i} className="h-10 flex items-center gap-2 px-4">
              <Skeleton circle h={24} w={24} />
              <Skeleton h={24} />
            </div>
          ))}
        {filteredStamps?.length === 0 && (
          <div className="grid place-content-center h-full text-gray-600">お探しのスタンプは見つかりませんでした</div>
        )}
      </div>
    </div>
  );
};

export const StampOverviewPage: FC = () => {
  return (
    <Container>
      <ContainerTitle>
        <StampIcon className="size-8" />
        <span className="text-2xl font-bold">スタンプ</span>
      </ContainerTitle>

      <Card>
        <h2 className="text-lg font-semibold mb-2">つけられた数</h2>
        <div className="grid grid-cols-2 max-lg:grid-cols-1 gap-4">
          <StampRanking limit={20} />
          <div>
            <TopStampsTimeline />
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold mb-2">スタンプ検索</h2>
        <SearchStampBlock />
      </Card>
    </Container>
  );
};
