import { useUsers } from '@/hooks/useUsers';
import { UserDetail } from '@/models/UserDetail';
import { FC } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Loader } from '@mantine/core';
import clsx from 'clsx';

export const UserDetailPage: FC = () => {
  const params = useParams<{ username: string }>();
  const { getUserId, users } = useUsers();
  const userId = getUserId(params.username!);

  return (
    <div className="bg-gray-100 min-h-screen relative">
      <div
        className={clsx(
          'grid place-content-center absolute inset-0 bg-gray-100 duration-200 transition-all ease-in',
          userId && 'invisible opacity-0'
        )}
      >
        <Loader type="bars" size="xl" />
      </div>
      {users !== undefined && !userId && (
        <div className="min-h-screen flex flex-col justify-center items-center gap-4">
          <div className="text-2xl font-semibold">
            <span>@{params.username}</span>
            <span> というユーザーが見つかりません</span>
          </div>
          <div>
            <Link to="/" className="underline text-blue-500">
              トップページに戻る
            </Link>
          </div>
        </div>
      )}
      {userId && <UserDetail userId={userId} />}
    </div>
  );
};
