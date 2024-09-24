import { ChannelIcon } from '@/components/icons/ChannelIcon';
import { useChannels } from '@/hooks/useChannels';
import { Card } from '@mantine/core';
import { IconChevronLeft } from '@tabler/icons-react';
import type { FC } from 'react';
import { Link } from 'react-router-dom';
import {
  ChannelMessageCountStat,
  ChannelStampCountStat,
  ChannelSubscribersCountStat,
} from '@/components/stats/ChannelStats';
import { StampRanking } from '@/components/rankings/StampRanking';
import { useStampPicker } from '@/models/StampPicker';
import { TopReactedMessages } from '@/components/messages/TopReactedMessages';
import { ChannelActionTimeline } from '@/components/timelines/ChannelActionTimeline';
import { ChannelActionHours } from '@/components/hours/ChannelActionHours';
import { MessagesUserRanking, StampsUserRanking } from '@/components/rankings/UserRanking';

type Props = {
  channelId: string;
};

export const ChannelDetail: FC<Props> = ({ channelId }) => {
  const stampPicker = useStampPicker();
  const { getChannelName } = useChannels();
  const channelName = getChannelName(channelId);

  if (channelName === undefined) return null;

  return (
    <div className="bg-gray-100 min-h-screen sm:p-8 p-4 flex flex-col sm:gap-8 gap-4">
      <div className="lg:hidden flex">
        <Link
          to="/"
          className="px-4 py-2 flex justify-center items-center font-semibold hover:bg-gray-200 duration-200 transition-all rounded-md"
        >
          <IconChevronLeft />
          <span>ホームに戻る</span>
        </Link>
      </div>
      <div className="flex gap-8 justify-center items-center relative">
        <Link
          to="/"
          className="absolute top-1/2 -translate-y-1/2 left-0 px-4 py-2 flex justify-center items-center font-semibold hover:bg-gray-200 duration-200 transition-all rounded-md max-lg:hidden"
        >
          <IconChevronLeft />
          <span>ホームに戻る</span>
        </Link>
        <div className="flex items-center">
          <ChannelIcon className="size-10 -mr-1" />
          <div className="text-2xl font-semibold pb-1">{channelName}</div>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:gap-8 gap-4 max-lg:grid-cols-1">
        <div className="flex flex-col sm:gap-8 gap-4 @container">
          <div className="grid grid-cols-3 gap-4 auto-rows-min max-xs:grid-cols-1">
            <ChannelMessageCountStat channelId={channelId} />
            <ChannelStampCountStat channelId={channelId} />
            <ChannelSubscribersCountStat channelId={channelId} />
          </div>
          <Card>
            <div className="font-semibold mb-2">スタンプ</div>
            <StampRanking channelId={channelId} />
          </Card>
          <Card className="max-lg:hidden">
            <div className="font-semibold mb-4">リアクションの多い投稿</div>
            <div className="space-y-2">
              {stampPicker.render()}
              <TopReactedMessages stampId={stampPicker.stampId} channelId={channelId} />
            </div>
          </Card>
        </div>
        <div className="flex flex-col sm:gap-8 gap-4">
          <Card>
            <div className="font-semibold mb-4">各アクションの時系列遷移</div>
            <div>
              <ChannelActionTimeline channelId={channelId} />
            </div>
          </Card>
          <Card>
            <div className="font-semibold mb-4">各アクションの時間帯</div>
            <div>
              <ChannelActionHours channelId={channelId} />
            </div>
          </Card>
          <Card>
            <div className="font-semibold mb-4">よく投稿するユーザー</div>
            <div>
              <MessagesUserRanking channelId={channelId} />
            </div>
          </Card>
          <Card>
            <div className="font-semibold mb-4">よくスタンプを付けるユーザー</div>
            <div>
              <StampsUserRanking channelId={channelId} />
            </div>
          </Card>
          <Card>
            <div className="font-semibold mb-4">よく使われるスタンプ</div>
            <div>
              <StampRanking channelId={channelId} />
            </div>
          </Card>
          <Card className="lg:hidden">
            <div className="font-semibold mb-4">リアクションの多い投稿</div>
            <div className="space-y-2">
              {stampPicker.render()}
              <TopReactedMessages stampId={stampPicker.stampId} channelId={channelId} />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
