import clsx from 'clsx';
import type { FC, JSX } from 'react';

type Props = {
  userId: string;
  size?: number;
} & JSX.IntrinsicElements['img'];

const sizes = [48, 64, 96, 128, 256, 512, 1024];
const dpi = 2;

export const UserAvatar: FC<Props> = ({ userId, size = 24, ...props }) => {
  const fitSize = sizes.find((s) => s >= size * dpi) ?? sizes[sizes.length - 1];
  return (
    <img
      src={`/api/avatars/${userId}?width=${fitSize}&height=${fitSize}`}
      width={size}
      height={size}
      loading="lazy"
      {...props}
      alt=""
      className={clsx('rounded-full', props.className)}
    />
  );
};
