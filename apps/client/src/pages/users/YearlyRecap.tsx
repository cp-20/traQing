import { Card } from '@/components/Card';
import { UserAvatar } from '@/components/UserAvatar';
import { useUsers } from '@/hooks/useUsers';
import { assert } from '@/lib/invariant';
import type { UserContext } from '@/pages/users/UserGuard';
import type { FC } from 'react';
import { useOutletContext, useParams } from 'react-router';
import { TopGaveStamps, TopReceivedStamps } from '@/components/recap/stamps';
import { WordCloudRecap } from '@/components/recap/wordcloud';
import { PostCalendar } from '@/components/recap/post-calendar';
import {
  TotalMessages,
  TotalMessagesLength,
  TotalReactionsGave,
  TotalReactionsReceived,
} from '@/components/recap/stats';
import { MessagesChannelRanking, StampsChannelRanking } from '@/components/rankings/ChannelRanking';
import { yearToDateRange } from '@/components/recap/common';
import { HighlightedMessages } from '@/components/recap/messages';

export const YearlyRecapPage: FC = () => {
  const { year: yearRaw } = useParams<{ year: string }>();
  assert(yearRaw);
  const year = Number.parseInt(yearRaw, 10);
  const { userId } = useOutletContext() as UserContext;
  const { getUserFromId } = useUsers();
  const user = getUserFromId(userId);
  assert(user);

  return (
    <div className="max-w-7xl mx-auto px-8 flex flex-col gap-16">
      <div className="py-8 flex flex-col items-center gap-4">
        <UserAvatar userId={userId} size={128} />
        <h1 className="text-center text-2xl font-semibold">
          @{user.name} の{year}年の振り返り
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <TotalMessages userId={userId} year={year} />
        <TotalMessagesLength userId={userId} year={year} />
        <TotalReactionsGave userId={userId} year={year} />
        <TotalReactionsReceived userId={userId} year={year} />
      </div>

      <Card>
        <h2 className="text-xl font-semibold mb-2">投稿カレンダー</h2>
        <PostCalendar userId={userId} year={year} />
      </Card>

      <div className="grid grid-cols-2 max-lg:grid-cols-1 gap-4">
        <Card>
          <div className="font-semibold mb-2">よく投稿したチャンネル</div>
          <MessagesChannelRanking userId={userId} range={yearToDateRange(year)} />
        </Card>
        <Card>
          <div className="font-semibold mb-2">よくスタンプを付けたチャンネル</div>
          <StampsChannelRanking gaveUserId={userId} range={yearToDateRange(year)} />
        </Card>
      </div>

      <div className="grid grid-cols-2 max-lg:grid-cols-1 gap-4">
        <Card>
          <div className="font-semibold mb-2">よく付けたスタンプ</div>
          <TopGaveStamps userId={userId} year={year} />
        </Card>
        <Card>
          <div className="font-semibold mb-2">よく付けられたスタンプ</div>
          <TopReceivedStamps userId={userId} year={year} />
        </Card>
      </div>

      <Card>
        <div className="font-semibold mb-2">よく使った言葉</div>
        <WordCloudRecap userId={userId} year={year} />
      </Card>

      <Card>
        <div className="font-semibold mb-2">注目の投稿</div>
        <HighlightedMessages userId={userId} year={year} />
      </Card>

      <div className="h-16" />
    </div>
  );
};
