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
import { FC } from 'react';
import LogoImage from '@/assets/logo.svg';

export const Dashboard: FC = () => {
  const { switcher: dailySwitcher, range: dailyRange } = useDailySwitcher();
  const { switcher: monthlySwitcher, range: monthlyRange } =
    useMonthlySwitcher();

  return (
    <div>
      <header className="border-b border-zinc-200 py-2 px-8 mb-8">
        <h1 className="font-semibold text-blue-500 text-2xl">
          <img src={LogoImage} alt="traQing" width={128} />
        </h1>
      </header>
      <div className="space-y-12 px-8">
        <div className="space-y-4">
          <div className="flex gap-4">
            <h2 className="font-semibold text-xl">デイリーランキング</h2>
            <DateSwitcher switcher={dailySwitcher} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr,1fr,15rem] *:min-w-0 gap-4">
            <DailyUserRanking range={dailyRange} />
            <DailyChannelRanking range={dailyRange} />
            <DailyStampRanking range={dailyRange} />
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex gap-4">
            <h2 className="font-semibold text-xl">マンスリーランキング</h2>
            <DateSwitcher switcher={monthlySwitcher} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr,1fr,15rem] *:min-w-0 gap-4">
            <MonthlyUserRanking range={monthlyRange} />
            <MonthlyChannelRanking range={monthlyRange} />
            <MonthlyStampRanking range={monthlyRange} />
          </div>
        </div>
      </div>
    </div>
  );
};
