import type { FC } from 'react';
import LogoImage from '@/assets/logo.svg';
import { SearchUsers } from '@/pages/dashboard/SearchUsers';
import { DailyRankings } from '@/pages/dashboard/DailyRankings';
import { MonthlyRankings } from '@/pages/dashboard/MonthlyRankings';
import { UserRankings } from '@/pages/dashboard/UserRankings';
import { StampRankings } from '@/pages/dashboard/StampRankings';
import { ChannelRankings } from '@/pages/dashboard/ChannelRankings';

export const Dashboard: FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 lg:px-8 lg:py-16 px-4 py-8">
      <div className="space-y-8">
        <div className="grid place-content-center">
          <img src={LogoImage} alt="traQing" width={256} />
        </div>

        <DailyRankings />
        <MonthlyRankings />
        <SearchUsers />
        <UserRankings />
        <StampRankings />
        <ChannelRankings />
      </div>
    </div>
  );
};
