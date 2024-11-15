import { Card } from '@/components/Card';
import { UserAvatar } from '@/components/UserAvatar';
import { useUsers } from '@/hooks/useUsers';
import {
  UserGaveStampStat,
  UserGroupStat,
  UserMessageCountStat,
  UserReceivedStampStat,
  UserSubscriptionStat,
  UserTagStat,
} from '@/components/stats/UserStats';
import type { FC } from 'react';
import { StampRanking } from '@/components/rankings/StampRanking';
import { TopReactedMessages } from '@/components/messages/TopReactedMessages';
import { StampPicker, useStampPicker } from '@/composables/useStampPicker';
import { UserActionTimeline } from '@/components/timelines/UserActionTimeline';
import { UserActionHours } from '@/components/hours/UserActionHours';
import { MessagesChannelRanking, StampsChannelRanking } from '@/components/rankings/ChannelRanking';
import { Container, ContainerTitle } from '@/components/containers/Container';

type UserDetailProps = {
  userId: string;
  subscriptions?: string[];
};

export const UserDetail: FC<UserDetailProps> = ({ userId }) => {
  const stampPicker = useStampPicker();
  const { getUserFromId } = useUsers();
  const user = getUserFromId(userId);

  if (user === undefined) return null;

  return (
    <Container>
      <ContainerTitle>
        <div>
          <UserAvatar userId={user.id} size={128} loading="eager" />
        </div>
        <div className="ml-4">
          <div className="text-2xl font-semibold">{user.displayName}</div>
          <div className="text-gray-500">@{user.name}</div>
        </div>
      </ContainerTitle>
      <div className="grid grid-cols-2 sm:gap-8 gap-4 max-lg:grid-cols-1">
        <div className="flex flex-col sm:gap-8 gap-4 @container">
          <div className="grid grid-cols-3 gap-4 auto-rows-min max-xs:grid-cols-1">
            <UserMessageCountStat userId={userId} />
            <UserGaveStampStat userId={userId} />
            <UserReceivedStampStat userId={userId} />
            <UserGroupStat userId={userId} />
            <UserTagStat userId={userId} />
            <UserSubscriptionStat userId={userId} />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:gap-8 @lg:grid-cols-2 sm:@lg:gap-4">
            <Card>
              <div className="font-semibold mb-2">つけたスタンプ</div>
              <StampRanking gaveUserId={userId} />
            </Card>
            <Card>
              <div className="font-semibold mb-2">もらったスタンプ</div>
              <StampRanking receivedUserId={userId} />
            </Card>
          </div>
          <Card className="max-lg:hidden">
            <div className="font-semibold mb-4">リアクションの多い投稿</div>
            <div className="space-y-2">
              <StampPicker reducer={stampPicker} />

              <TopReactedMessages stampId={stampPicker.stampId} receivedUserId={userId} />
            </div>
          </Card>
        </div>
        <div className="flex flex-col sm:gap-8 gap-4">
          <Card>
            <div className="font-semibold mb-4">各アクションの時系列遷移</div>
            <div>
              <UserActionTimeline userId={userId} />
            </div>
          </Card>
          <Card>
            <div className="font-semibold mb-4">各アクションの時間帯</div>
            <div>
              <UserActionHours userId={userId} />
            </div>
          </Card>
          <Card>
            <div className="font-semibold mb-4">よく投稿するチャンネル</div>
            <div>
              <MessagesChannelRanking userId={userId} limit={20} />
            </div>
          </Card>
          <Card>
            <div className="font-semibold mb-4">スタンプをよく付けるチャンネル</div>
            <div>
              <StampsChannelRanking gaveUserId={userId} />
            </div>
          </Card>
          <Card>
            <div className="font-semibold mb-4">スタンプをよく付けられるチャンネル</div>
            <div>
              <StampsChannelRanking receivedUserId={userId} />
            </div>
          </Card>
          <Card className="lg:hidden">
            <div className="font-semibold mb-4">リアクションの多い投稿</div>
            <div className="space-y-2">
              <StampPicker reducer={stampPicker} />
              <TopReactedMessages stampId={stampPicker.stampId} receivedUserId={userId} />
            </div>
          </Card>
        </div>
      </div>
    </Container>
  );
};
