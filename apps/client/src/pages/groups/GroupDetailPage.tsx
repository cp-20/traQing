import { Loader } from '@mantine/core';
import clsx from 'clsx';
import type { FC } from 'react';
import { Link, useParams } from 'react-router';
import { useGroups } from '@/hooks/useGroups';
import { assert } from '@/lib/invariant';
import { GroupDetail } from '@/pages/groups/GroupDetail';

export const GroupDetailPage: FC = () => {
  const { groupName } = useParams<{ groupName: string }>();
  assert(groupName);
  const { groups, getGroupId } = useGroups();
  const groupId = getGroupId(groupName);

  return (
    <div className="bg-gray-100 min-h-screen relative">
      <div
        className={clsx(
          'grid place-content-center absolute inset-0 bg-gray-100 duration-200 transition-all ease-in',
          groups !== undefined && 'invisible opacity-0',
        )}
      >
        <Loader type="bars" size="xl" />
      </div>
      {groups !== undefined && !groupId && (
        <div className="min-h-screen flex flex-col justify-center items-center gap-4">
          <div className="text-2xl font-semibold">
            <span>@{groupName}</span>
            <span> というグループが見つかりません</span>
          </div>
          <div>
            <Link to="/" className="underline text-blue-500">
              トップページに戻る
            </Link>
          </div>
        </div>
      )}
      {groupId && <GroupDetail groupId={groupId} />}
    </div>
  );
};
