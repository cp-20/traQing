import { useDateRangePicker } from '@/models/useDateRangePicker';
import { FC } from 'react';
import { UserPostRanking } from '@/models/Rankings/UserPostRanking';
import { Card } from '@/components/Card';
import { ChannelPostRanking } from '@/models/Rankings/ChannelPostRanking';

export const RankingsPage: FC = () => {
  const dateRange = useDateRangePicker('last-7-days');
  return (
    <div className="min-h-screen bg-gray-100 lg:px-8 lg:py-16 px-4 py-8">
      <h1>ランキング</h1>

      <div>{dateRange.render()}</div>

      <div className="grid grid-cols-2 gap-2">
        <Card className="p-4 rounded-md">
          <h3 className="font-bold mb-2">ユーザー投稿数</h3>
          <UserPostRanking range={dateRange.value} />
        </Card>

        <Card className="p-4 rounded-md">
          <h3 className="font-bold mb-2">チャンネル投稿数</h3>
          <ChannelPostRanking range={dateRange.value} />
        </Card>
      </div>

      {/* <div className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr,1fr,18rem] *:min-w-0 gap-4">
          <Card className="border">
            <div className="mb-2 font-medium">ユーザー投稿数</div>
            <DailyUserRanking range={dateRange} />
          </Card>
          <Card className="border">
            <div className="mb-2 font-medium">チャンネル投稿数</div>
            <DailyChannelRanking range={dateRange} />
          </Card>
          <Card className="border min-w-fit">
            <div className="mb-2 font-medium">スタンプ</div>
            <DailyStampRanking range={dateRange} />
          </Card>
        </div>
      </div> */}
    </div>
  );
};
