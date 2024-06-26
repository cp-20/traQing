import { Card } from '@/components/Card';
import { useUsers } from '@/hooks/useUsers';
import { UserActionTimeline } from '@/models/Timelines/UserActionTimeline';
import {
  UserGaveStampsChannels,
  UserMessageChannels,
} from '@/models/UserActionChannels';
import { UserMessageHours } from '@/models/UserMessageHours';
import {
  UserGaveStampRanking,
  UserReceivedStampRanking,
} from '@/models/UserStampRanking';
import {
  UserGaveStampStat,
  UserMessageCountStat,
  UserReceivedStampStat,
} from '@/models/UserStats';
import { UserTopReactedMessages } from '@/models/UserTopReactedMessages';
import { IconChevronLeft } from '@tabler/icons-react';
import { FC } from 'react';
import { Link } from 'react-router-dom';

type UserDetailProps = {
  userId: string;
  subscriptions?: string[];
};

export const UserDetail: FC<UserDetailProps> = ({ userId }) => {
  const { getUserFromId } = useUsers();
  const user = getUserFromId(userId);

  if (user === undefined) {
    return null;
  }

  return (
    <div className="bg-gray-100 min-h-screen sm:p-8 p-4 flex flex-col sm:gap-8 gap-4">
      <div className="lg:hidden flex">
        <Link
          to="/"
          className="px-4 py-2 flex justify-center items-center font-semibold hover:bg-gray-200 duration-200 transition-all rounded-md"
        >
          <IconChevronLeft />
          <span>ホームに戻る</span>
        </Link>
      </div>
      <div className="flex gap-8 justify-center items-center relative">
        <Link
          to="/"
          className="absolute top-1/2 -translate-y-1/2 left-0 px-4 py-2 flex justify-center items-center font-semibold hover:bg-gray-200 duration-200 transition-all rounded-md max-lg:hidden"
        >
          <IconChevronLeft />
          <span>ホームに戻る</span>
        </Link>
        <div>
          <img
            src={`/api/files/${user.iconFileId}`}
            alt=""
            loading="eager"
            width={128}
            height={128}
            className="rounded-full bg-white"
          />
        </div>
        <div>
          <div className="text-2xl font-semibold">{user.displayName}</div>
          <div className="text-gray-500">@{user.name}</div>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:gap-8 gap-4 max-lg:grid-cols-1">
        <div className="flex flex-col sm:gap-8 gap-4 @container">
          <div className="grid grid-cols-3 gap-4 auto-rows-min max-xs:grid-cols-1">
            <UserMessageCountStat userId={userId} />
            <UserGaveStampStat userId={userId} />
            <UserReceivedStampStat userId={userId} />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:gap-8 @lg:grid-cols-2 sm:@lg:gap-4">
            <Card>
              <div className="font-semibold mb-2">つけたスタンプ</div>
              <UserGaveStampRanking userId={userId} />
            </Card>
            <Card>
              <div className="font-semibold mb-2">もらったスタンプ</div>
              <UserReceivedStampRanking userId={userId} />
            </Card>
          </div>
          <Card className="max-lg:hidden">
            <div className="font-semibold mb-4">リアクションの多い投稿</div>
            <UserTopReactedMessages userId={userId} />
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
              <UserMessageHours userId={userId} />
            </div>
          </Card>
          <Card>
            <div className="font-semibold mb-4">よく投稿するチャンネル</div>
            <div>
              <UserMessageChannels userId={userId} />
            </div>
          </Card>
          <Card>
            <div className="font-semibold mb-4">
              スタンプをよく付けるチャンネル
            </div>
            <div>
              <UserGaveStampsChannels userId={userId} />
            </div>
          </Card>
          <Card className="lg:hidden">
            <div className="font-semibold mb-4">リアクションの多い投稿</div>
            <UserTopReactedMessages userId={userId} />
          </Card>
        </div>
      </div>
    </div>
  );
};
