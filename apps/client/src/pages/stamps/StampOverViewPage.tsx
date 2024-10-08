import { StampIcon } from '@/components/icons/StampIcon';
import { StampImage } from '@/composables/useStampPicker';
import { useMessageStamps } from '@/hooks/useMessageStamps';
import { searchStamps } from '@/lib/search';
import { Card, Skeleton, TextInput } from '@mantine/core';
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
    <div className="min-h-screen bg-gray-100 lg:px-8 lg:py-16 px-4 py-8">
      <h1 className="text-2xl font-bold flex items-center justify-center py-8">
        <StampIcon className="size-8" />
        <span>スタンプ</span>
      </h1>

      <Card>
        <h2 className="font-semibold mb-2">スタンプ検索</h2>
        <SearchStampBlock />
      </Card>
    </div>
  );
};
