import {
  useDailySwitcher,
  useMonthlySwitcher,
  DateSwitcher,
} from '@/models/DateSwitcher';
import { DailyChannelRanking } from '@/models/Rankings/DailyChannelRanking';
import { DailyStampRanking } from '@/models/Rankings/DailyStampRanking';
import { DailyUserRanking } from '@/models/Rankings/DailyUserRanking';
import { MonthlyChannelRanking } from '@/models/Rankings/MonthlyChannelRanking';
import { MonthlyStampRanking } from '@/models/Rankings/MonthlyStampRanking';
import { MonthlyUserRanking } from '@/models/Rankings/MonthlyUserRanking';
import { Card } from '@mantine/core';
import { FC } from 'react';
import LogoImage from '@/assets/logo.svg';

export const Dashboard: FC = () => {
  const { switcher: dailySwitcher, range: dailyRange } = useDailySwitcher();
  const { switcher: monthlySwitcher, range: monthlyRange } =
    useMonthlySwitcher();

  return (
    <div className="min-h-screen bg-gray-100 px-8 py-16">
      <div className="space-y-8">
        <div className="grid place-content-center">
          <img src={LogoImage} alt="traQing" width={256} />
        </div>
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
      </div>
    </div>
  );
};
