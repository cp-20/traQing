import { useUsers } from '@/hooks/useUsers';
import { Skeleton } from '@mantine/core';
import clsx from 'clsx';
import type { FC } from 'react';

type Props = {
  userId: string;
  size?: number;
} & JSX.IntrinsicElements['img'];

export const UserAvatar: FC<Props> = ({ userId, size = 24, ...props }) => {
  const { getUserFromId } = useUsers();
  const user = getUserFromId(userId);

  if (user === undefined) {
    return <Skeleton circle height={size} />;
  }

  return (
    <img
      src={`/api/files/${user.iconFileId}`}
      width={size}
      height={size}
      loading="lazy"
      {...props}
      alt=""
      className={clsx('rounded-full', props.className)}
    />
  );
};
