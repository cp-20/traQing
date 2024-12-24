import { useUsers } from '@/hooks/useUsers';
import { assert } from '@/lib/invariant';
import { Loader } from '@mantine/core';
import clsx from 'clsx';
import type { FC } from 'react';
import { Link, Outlet, useParams } from 'react-router';

export type UserContext = {
  userId: string;
};

export const UserGuard: FC = () => {
  const { username } = useParams<{ username: string }>();
  const { getUserId, users } = useUsers();
  assert(username);
  const userId = getUserId(username);

  return (
    <div className="bg-gray-100 min-h-screen relative">
      <div
        className={clsx(
          'grid place-content-center absolute inset-0 bg-gray-100 duration-200 transition-all ease-in',
          users !== undefined && 'invisible opacity-0',
        )}
      >
        <Loader type="bars" size="xl" />
      </div>
      {users !== undefined && !userId && (
        <div className="min-h-screen flex flex-col justify-center items-center gap-4">
          <div className="text-2xl font-semibold">
            <span>@{username}</span>
            <span> というユーザーが見つかりません</span>
          </div>
          <div>
            <Link to="/" className="underline text-blue-500">
              トップページに戻る
            </Link>
          </div>
        </div>
      )}
      {userId && <Outlet context={{ userId }} />}
    </div>
  );
};
