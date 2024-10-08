import { UserIcon } from '@/components/icons/UserIcon';
import { UserAvatar } from '@/components/UserAvatar';
import { useUsers } from '@/hooks/useUsers';
import { searchUsers } from '@/lib/search';
import { Card, Skeleton, TextInput } from '@mantine/core';
import { useState, type FC } from 'react';
import { Link } from 'react-router-dom';

const SearchUserBlock: FC = () => {
  const [keyword, setKeyword] = useState<string>('');
  const { users } = useUsers();

  const filteredUsers = users && searchUsers(users, keyword);

  return (
    <div className="space-y-4">
      <TextInput placeholder="ユーザー名" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
      <div className="h-96 overflow-y-scroll border rounded text-text-primary">
        {filteredUsers?.map((user) => (
          <Link
            key={user.id}
            to={`/users/${user.name}`}
            className="flex items-center gap-2 px-4 py-2 hover:bg-blue-100 transition-colors duration-200"
          >
            <UserAvatar userId={user.id} />
            <span className="font-semibold">{user.displayName}</span>
            <span className="text-gray-400">@{user.name}</span>
          </Link>
        )) ??
          [...Array(10)].map((_, i) => (
            <div key={i} className="h-10 flex items-center gap-2 px-4">
              <Skeleton circle h={24} w={24} />
              <Skeleton h={24} />
            </div>
          ))}
      </div>
    </div>
  );
};

export const UserOverviewPage: FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 lg:px-8 lg:py-16 px-4 py-8">
      <h1 className="text-2xl font-bold flex items-center justify-center py-8">
        <UserIcon className="size-8" />
        <span>ユーザー</span>
      </h1>

      <Card>
        <h2 className="font-semibold mb-2">ユーザー検索</h2>
        <SearchUserBlock />
      </Card>
    </div>
  );
};
