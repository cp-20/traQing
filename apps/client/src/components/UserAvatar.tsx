import clsx from 'clsx';
import type { FC } from 'react';

type Props = {
  userId: string;
  size?: number;
} & JSX.IntrinsicElements['img'];

export const UserAvatar: FC<Props> = ({ userId, size = 24, ...props }) => (
  <img
    src={`/api/avatars/${userId}?width=${size}&height=${size}`}
    width={size}
    height={size}
    loading="lazy"
    {...props}
    alt=""
    className={clsx('rounded-full', props.className)}
  />
);
