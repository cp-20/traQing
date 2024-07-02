import { useMonthlySwitcher, DateSwitcher } from '@/models/DateSwitcher';
import { MonthlyChannelRanking } from '@/models/Rankings/MonthlyChannelRanking';
import { MonthlyStampRanking } from '@/models/Rankings/MonthlyStampRanking';
import { MonthlyUserRanking } from '@/models/Rankings/MonthlyUserRanking';
import { Card } from '@mantine/core';
import type { FC } from 'react';

export const MonthlyRankings: FC = () => {
  const { switcher: monthlySwitcher, range: monthlyRange } =
    useMonthlySwitcher();

  return (
    <Card className="space-y-4">
      <div className="flex gap-4 justify-between">
        <h2 className="font-semibold text-xl">マンスリーランキング</h2>
        <DateSwitcher switcher={monthlySwitcher} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr,1fr,18rem] *:min-w-0 gap-4">
        <Card className="border">
          <div className="mb-2 font-medium">ユーザー投稿数</div>
          <MonthlyUserRanking range={monthlyRange} />
        </Card>
        <Card className="border">
          <div className="mb-2 font-medium">チャンネル投稿数</div>
          <MonthlyChannelRanking range={monthlyRange} />
        </Card>
        <Card className="border">
          <div className="mb-2 font-medium">スタンプ</div>
          <MonthlyStampRanking range={monthlyRange} />
        </Card>
      </div>
    </Card>
  );
};
