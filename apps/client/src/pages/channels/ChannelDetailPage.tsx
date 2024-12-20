import { useChannels } from '@/hooks/useChannels';
import { assert } from '@/lib/invariant';
import { ChannelDetail } from '@/pages/channels/ChannelDetail';
import { Loader } from '@mantine/core';
import clsx from 'clsx';
import type { FC } from 'react';
import { Link, useParams } from 'react-router';

export const ChannelDetailPage: FC = () => {
  const { '*': channelName } = useParams<{ '*': string }>();
  const { channels, getChannelId } = useChannels();
  assert(channelName);
  const channelId = getChannelId(channelName);

  return (
    <div className="bg-gray-100 min-h-screen relative">
      <div
        className={clsx(
          'grid place-content-center absolute inset-0 bg-gray-100 duration-200 transition-all ease-in',
          channels !== undefined && 'invisible opacity-0',
        )}
      >
        <Loader type="bars" size="xl" />
      </div>
      {channels !== undefined && !channelId && (
        <div className="min-h-screen flex flex-col justify-center items-center gap-4">
          <div className="text-2xl font-semibold">
            <span>#{channelName}</span>
            <span> というチャンネルが見つかりません</span>
          </div>
          <div>
            <Link to="/" className="underline text-blue-500">
              トップページに戻る
            </Link>
          </div>
        </div>
      )}
      {channelId && <ChannelDetail channelId={channelId} />}
    </div>
  );
};
