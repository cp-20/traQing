import { useUsers } from '@/hooks/useUsers';
import { Card, TextInput } from '@mantine/core';
import { type FC, useState } from 'react';
import { Link } from 'react-router-dom';
import type { User } from 'traq-bot-ts';

const normalize = (str: string) => str.toLowerCase();

const searchUser = (user: User, keyword: string) => {
  const normalizedKeyword = normalize(keyword);
  const normalizedName = normalize(user.name);
  const normalizedDisplayName = normalize(user.displayName);
  return normalizedName.includes(normalizedKeyword) || normalizedDisplayName.includes(normalizedKeyword);
};

export const SearchUsers: FC = () => {
  const { users } = useUsers();
  const [keyword, setKeyword] = useState('');

  return (
    <Card>
      <div className="font-semibold text-xl mb-2">ユーザー検索</div>
      <div className="flex flex-col gap-4">
        <TextInput placeholder="ユーザーIDを入力" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
        <div className="flex flex-col h-96 overflow-auto">
          {users === undefined &&
            new Array(10).fill(0).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="w-8 h-8 rounded-full bg-gray-200" />
              </div>
            ))}
          {users &&
            users.filter((user) => user.name.includes(keyword) || user.displayName.includes(keyword)).length === 0 && (
              <div className="text-gray-500 text-center">お探しのユーザーは見つかりません</div>
            )}
          {users
            ?.filter((user) => searchUser(user, keyword))
            .slice(0, 100)
            .map((user) => (
              <Link
                to={`/users/${encodeURIComponent(user.name)}`}
                key={user.id}
                className="flex gap-2 px-4 py-1 items-center hover:bg-gray-100 rounded-md transition-all duration-200"
              >
                <img src={`/api/files/${user.iconFileId}`} alt="" width={32} height={32} className="rounded-full" />
                <span className="space-x-1">
                  <span className="font-medium">{user.displayName}</span>
                  <span className="text-gray-500">@{user.name}</span>
                </span>
              </Link>
            ))}
        </div>
      </div>
    </Card>
  );
};
