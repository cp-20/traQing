import { DateSwitcher, useDailySwitcher } from '@/models/DateSwitcher';
import { DailyChannelRanking } from '@/models/Rankings/DailyChannelRanking';
import { DailyStampRanking } from '@/models/Rankings/DailyStampRanking';
import { DailyUserRanking } from '@/models/Rankings/DailyUserRanking';
import { Card } from '@mantine/core';
import type { FC } from 'react';

export const DailyRankings: FC = () => {
  const { switcher: dailySwitcher, range: dailyRange } = useDailySwitcher();
  return (
    <Card className="space-y-4">
      <div className="flex gap-4 justify-between">
        <h2 className="font-semibold text-xl">デイリーランキング</h2>
        <DateSwitcher switcher={dailySwitcher} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr,1fr,18rem] *:min-w-0 gap-4">
        <Card className="border">
          <div className="mb-2 font-medium">ユーザー投稿数</div>
          <DailyUserRanking range={dailyRange} />
        </Card>
        <Card className="border">
          <div className="mb-2 font-medium">チャンネル投稿数</div>
          <DailyChannelRanking range={dailyRange} />
        </Card>
        <Card className="border min-w-fit">
          <div className="mb-2 font-medium">スタンプ</div>
          <DailyStampRanking range={dailyRange} />
        </Card>
      </div>
    </Card>
  );
};
