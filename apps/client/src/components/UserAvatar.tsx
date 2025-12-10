import clsx from 'clsx';
import type { FC, JSX } from 'react';
import type { User } from 'traq-bot-ts';

type Props = {
  user: User;
  size?: number;
} & JSX.IntrinsicElements['img'];

const sizes = [48, 64, 96, 128, 256, 512, 1024];
const dpi = 2;

const getImageUrl = (user: User, size: number) => {
  const fitSize = sizes.find((s) => s >= size * dpi) ?? sizes[sizes.length - 1];

  if (user.name.startsWith('Webhook#')) {
    return `/api/files/${user.iconFileId}?width=${fitSize}&height=${fitSize}`;
  }

  return `https://image-proxy.trap.jp/icon/${user.name}?format=webp&width=${fitSize}&height=${fitSize}`;
};

export const UserAvatar: FC<Props> = ({ user, size = 24, ...props }) => {
  const imageUrl = getImageUrl(user, size);

  return (
    <img
      src={imageUrl}
      width={size}
      height={size}
      loading="lazy"
      {...props}
      alt=""
      className={clsx('rounded-full', props.className)}
    />
  );
};
