import { StampHours } from '@/components/hours/StampHours';
import { TopReactedMessages } from '@/components/messages/TopReactedMessages';
import { StampsChannelRanking } from '@/components/rankings/ChannelRanking';
import { StampsGaveUserRanking, StampsReceivedUserRanking } from '@/components/rankings/UserRanking';
import { RangeStampCountStat, StampCountStat } from '@/components/stats/StampStats';
import { StampTimeline } from '@/components/timelines/StampTimeline';
import { dateRangeKinds } from '@/composables/useDateRangePicker';
import { StampImage } from '@/composables/useStampPicker';
import { useMessageStamps } from '@/hooks/useMessageStamps';
import { assert } from '@/lib/invariant';
import { Card } from '@mantine/core';
import { IconChevronLeft } from '@tabler/icons-react';
import type { FC } from 'react';
import { Link } from 'react-router-dom';

type Props = {
  stampId: string;
};

export const StampDetail: FC<Props> = ({ stampId }) => {
  const { getStamp } = useMessageStamps();
  const stamp = getStamp(stampId);
  assert(stamp);

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
        <div>
          <StampImage stampId={stampId} size={64} loading="eager" />
        </div>
        <div>
          <div className="text-2xl font-semibold">:{stamp.name}:</div>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:gap-8 gap-4 max-lg:grid-cols-1">
        <div className="flex flex-col sm:gap-8 gap-4 @container">
          <div className="grid grid-cols-3 gap-4 auto-rows-min max-xs:grid-cols-1">
            <StampCountStat stampId={stampId} />
            <RangeStampCountStat
              stampId={stampId}
              range={dateRangeKinds['last-30-days'].range}
              label={`押された回数 (${dateRangeKinds['last-30-days'].label})`}
            />
            <RangeStampCountStat
              stampId={stampId}
              range={dateRangeKinds['last-7-days'].range}
              label={`押された回数 (${dateRangeKinds['last-7-days'].label})`}
            />
          </div>
          <Card className="max-lg:hidden">
            <div className="font-semibold mb-4">リアクションの多い投稿</div>
            <TopReactedMessages stampId={stampId} />
          </Card>
        </div>
        <div className="flex flex-col sm:gap-8 gap-4">
          <Card>
            <div className="font-semibold mb-4">リアクション数の時系列遷移</div>
            <div>
              <StampTimeline stampId={stampId} />
            </div>
          </Card>
          <Card>
            <div className="font-semibold mb-4">リアクションの時間帯</div>
            <div>
              <StampHours stampId={stampId} />
            </div>
          </Card>
          <Card>
            <div className="font-semibold mb-2">つけた人</div>
            <StampsGaveUserRanking stampId={stampId} />
          </Card>
          <Card>
            <div className="font-semibold mb-2">つけられた人</div>
            <StampsReceivedUserRanking stampId={stampId} />
          </Card>
          <Card>
            <div className="font-semibold mb-2">よく使われるチャンネル</div>
            <StampsChannelRanking stampId={stampId} />
          </Card>
          <Card className="lg:hidden">
            <div className="font-semibold mb-4">リアクションの多い投稿</div>
            <TopReactedMessages stampId={stampId} />
          </Card>
        </div>
      </div>
    </div>
  );
};
