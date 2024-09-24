import LogoImage from '@/assets/logo.svg';
import { Card } from '@/components/Card';
import { ChannelIcon } from '@/components/icons/ChannelIcon';
import { StampIcon } from '@/components/icons/StampIcon';
import { UserIcon } from '@/components/icons/UserIcon';
import { MessagesChannelRanking } from '@/components/rankings/ChannelRanking';
import { StampRanking } from '@/components/rankings/StampRanking';
import { MessagesUserRanking } from '@/components/rankings/UserRanking';
import { useDateRangePicker } from '@/models/useDateRangePicker';
import type { FC } from 'react';
import { Link } from 'react-router-dom';

export const Dashboard: FC = () => {
  const range = useDateRangePicker('last-7-days');
  return (
    <div className="min-h-screen bg-gray-100 lg:px-8 lg:py-16 px-4 py-8">
      <div className="space-y-8">
        <div className="grid place-content-center">
          <img src={LogoImage} alt="traQing" width={256} />
        </div>

        <div className="space-y-2">
          <div className="flex justify-end">{range.render()}</div>
          <div className="grid grid-cols-3 max-2xl:grid-cols-1 gap-4">
            <Card>
              <p className="text-lg font-bold mb-2">ユーザー投稿数ランキング</p>
              <MessagesUserRanking range={range.value} />
            </Card>
            <Card>
              <p className="text-lg font-bold mb-2">チャンネル投稿数ランキング</p>
              <MessagesChannelRanking range={range.value} />
            </Card>
            <Card>
              <p className="text-lg font-bold mb-2">スタンプランキング</p>
              <StampRanking range={range.value} />
            </Card>
          </div>
        </div>

        <div className="pt-8">
          <h2 className="font-bold text-center text-xl mb-4">もっと詳細を見る</h2>

          <div className="grid grid-cols-3 gap-4 max-md:grid-cols-1">
            <Link
              to="/users"
              className="flex items-center gap-2 bg-white rounded-md p-4 justify-center hover:text-blue-500 transition-colors duration-200"
            >
              <UserIcon className="size-8" />
              <span className="text-lg font-bold">ユーザー</span>
            </Link>
            <Link
              to="/channels"
              className="flex items-center gap-2 bg-white rounded-md p-4 justify-center hover:text-blue-500 transition-colors duration-200"
            >
              <ChannelIcon className="size-8" />
              <span className="text-lg font-bold">チャンネル</span>
            </Link>
            <Link
              to="/stamps"
              className="flex items-center gap-2 bg-white rounded-md p-4 justify-center hover:text-blue-500 transition-colors duration-200"
            >
              <StampIcon className="size-8" />
              <span className="text-lg font-bold">スタンプ</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
