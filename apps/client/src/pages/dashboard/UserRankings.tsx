import { OverallMessagesTimeline } from '@/components/timelines/OverallMessagesTimeline';
import { TopUserMessagesTimeline } from '@/components/timelines/TopUserMessagesTimeline';
import { UserMessagesRanking } from '@/models/UserRanking';
import { Card } from '@mantine/core';
import type { FC } from 'react';

export const UserRankings: FC = () => (
  <Card>
    <div className="font-semibold text-xl mb-2">投稿数ランキング</div>
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
      <Card className="border">
        <UserMessagesRanking />
      </Card>
      <div className="flex flex-col gap-4">
        <Card className="border max-h-80">
          <OverallMessagesTimeline />
        </Card>
        <Card className="border max-h-[480px]">
          <TopUserMessagesTimeline />
        </Card>
      </div>
    </div>
  </Card>
);
