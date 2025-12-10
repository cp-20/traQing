import type { FC, JSX } from 'react';

type Props = {
  stampId: string;
  size?: number;
} & JSX.IntrinsicElements['img'];

const sizes = [48, 64, 96, 128, 256, 512, 1024];
const dpi = 2;

const getImageUrl = (stampId: string, size: number) => {
  const fitSize = sizes.find((s) => s >= size * dpi) ?? sizes[sizes.length - 1];

  return `https://image-proxy.trap.jp/stamp/${stampId}?format=webp&width=${fitSize}&height=${fitSize}`;
};

export const StampImage: FC<Props> = ({ stampId, size = 24, ...props }) => {
  const imageUrl = getImageUrl(stampId, size);

  return <img src={imageUrl} width={size} height={size} loading="lazy" {...props} alt="" />;
};
