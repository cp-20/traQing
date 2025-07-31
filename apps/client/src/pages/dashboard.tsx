import type { FC } from 'react';
import { Link } from 'react-router';
import LogoImage from '@/assets/logo.svg';
import { Card } from '@/components/Card';
import { ChannelIcon } from '@/components/icons/ChannelIcon';
import { EffectIcon } from '@/components/icons/EffectIcon';
import { GroupIcon } from '@/components/icons/GroupIcon';
import { MessageIcon } from '@/components/icons/MessageIcon';
import { StampIcon } from '@/components/icons/StampIcon';
import { TagIcon } from '@/components/icons/TagIcon';
import { UserIcon } from '@/components/icons/UserIcon';
import { NotificationIcon } from '@/components/NotificationIcon';
import { MessagesChannelRanking } from '@/components/rankings/ChannelRanking';
import { StampRanking } from '@/components/rankings/StampRanking';
import { MessagesUserRanking } from '@/components/rankings/UserRanking';
import { useDateRangePicker } from '@/composables/useDateRangePicker';

export const Dashboard: FC = () => {
  const range = useDateRangePicker('last-7-days');

  const links = [
    { to: '/users', icon: <UserIcon className="size-8" />, label: 'ユーザー' },
    { to: '/channels', icon: <ChannelIcon className="size-8" />, label: 'チャンネル' },
    { to: '/stamps', icon: <StampIcon className="size-8" />, label: 'スタンプ' },
    { to: '/messages', icon: <MessageIcon className="size-7" />, label: 'メッセージ' },
    { to: '/groups', icon: <GroupIcon className="size-7" />, label: 'グループ' },
    { to: '/tags', icon: <TagIcon className="size-7" />, label: 'タグ' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 lg:px-8 lg:py-16 px-4 py-8">
      <div className="space-y-16 pt-8">
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

        <div>
          <h2 className="font-bold text-center text-xl mb-4">もっと詳細を見る</h2>

          <div className="grid grid-cols-3 gap-4 max-md:grid-cols-2 max-xs:grid-cols-1">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="flex items-center gap-2 bg-white rounded-md p-4 justify-center hover:text-blue-500 transition-colors duration-200"
              >
                {link.icon}
                <span className="text-lg font-bold">{link.label}</span>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h2 className="font-bold text-center text-xl mb-4">ツール</h2>
          <div className="grid grid-cols-2 gap-4 max-xs:grid-cols-1">
            <Link
              to="/subscriptions"
              className="flex items-center gap-2 bg-white rounded-md p-4 justify-center hover:text-blue-500 transition-colors duration-200"
            >
              <NotificationIcon level={2} className="size-8" />
              <span className="text-lg font-bold">通知管理</span>
            </Link>
            <Link
              to="/playground"
              className="flex items-center gap-2 bg-white rounded-md p-4 justify-center hover:text-blue-500 transition-colors duration-200"
            >
              <EffectIcon className="size-8" />
              <span className="text-lg font-bold">APIプレイグラウンド</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
