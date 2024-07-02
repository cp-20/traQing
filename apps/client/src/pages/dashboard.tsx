import { FC } from 'react';
import LogoImage from '@/assets/logo.svg';
import { SearchUsers } from '@/pages/dashboard/SearchUsers';
import { DailyRankings } from '@/pages/dashboard/DailyRankings';
import { MonthlyRankings } from '@/pages/dashboard/MonthlyRankings';
import { UserRankings } from '@/pages/dashboard/UserRankings';
import { StampRankings } from '@/pages/dashboard/StampRankings';

export const Dashboard: FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 px-8 py-16">
      <div className="space-y-8">
        <div className="grid place-content-center">
          <img src={LogoImage} alt="traQing" width={256} />
        </div>

        <DailyRankings />
        <MonthlyRankings />
        <SearchUsers />
        <UserRankings />
        <StampRankings />
      </div>
    </div>
  );
};
