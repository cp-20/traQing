import { Card } from '@/components/Card';
import { ChannelIcon } from '@/components/icons/ChannelIcon';
import { UserIcon } from '@/components/icons/UserIcon';
import { useChannels } from '@/hooks/useChannels';
import { searchChannels } from '@/lib/search';
import { Skeleton, TextInput } from '@mantine/core';
import { useState, type FC } from 'react';
import { Link } from 'react-router-dom';

const SearchChannelBlock: FC = () => {
  const [keyword, setKeyword] = useState<string>('');
  const { channels, getChannelName } = useChannels();

  const filteredChannels = channels && searchChannels(channels, keyword);

  return (
    <div className="space-y-4">
      <TextInput placeholder="チャンネル名" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
      <div className="h-96 overflow-y-scroll border rounded text-text-primary">
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
  return (
    <div className="min-h-screen bg-gray-100 lg:px-8 lg:py-16 px-4 py-8">
      <h1 className="text-2xl font-bold flex items-center justify-center py-8">
        <UserIcon className="size-8" />
        <span>チャンネル</span>
      </h1>

      <Card>
        <h2 className="font-semibold mb-2">チャンネル検索</h2>
        <SearchChannelBlock />
      </Card>
    </div>
  );
};
