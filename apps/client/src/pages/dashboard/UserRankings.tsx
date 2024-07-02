import { UserMessagesRanking } from '@/models/UserRanking';
import { Card } from '@mantine/core';
import { FC } from 'react';

export const UserRankings: FC = () => (
  <Card>
    <div className="font-semibold text-xl mb-2">投稿数ランキング</div>
    <UserMessagesRanking />
  </Card>
);
