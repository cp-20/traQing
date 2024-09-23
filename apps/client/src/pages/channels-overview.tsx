import { ChannelRankings } from '@/pages/dashboard/ChannelRankings';
import type { FC } from 'react';

export const ChannelsOverviewPage: FC = () => (
  <div className="min-h-screen bg-gray-100 lg:px-8 lg:py-16 px-4 py-8">
    <ChannelRankings />
  </div>
);
