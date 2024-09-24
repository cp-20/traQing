import { useMessageStamps } from '@/hooks/useMessageStamps';
import { Popover, Skeleton, TextInput } from '@mantine/core';
import { type FC, useState } from 'react';
import type { Stamp } from 'traq-bot-ts';

const searchStamps = (stamps: Stamp[], keyword: string) => {
  return stamps
    .filter((prof) => prof.name.toLowerCase().includes(keyword.toLowerCase()))
    .sort((a, b) => {
      const aIndex = a.name.toLowerCase().indexOf(keyword.toLowerCase());
      const bIndex = b.name.toLowerCase().indexOf(keyword.toLowerCase());
      return aIndex > bIndex
        ? 1
        : aIndex < bIndex
          ? -1
          : a.name.length > b.name.length
            ? 1
            : a.name.length < b.name.length
              ? -1
              : a.name > b.name
                ? 1
                : a.name < b.name
                  ? -1
                  : 0;
    });
};

export const useStampPicker = () => {
  const [stampId, setStampId] = useState<string | null>(null);
  const [keyword, setKeyword] = useState<string>('');
  const [opened, setOpened] = useState(false);
  const { stamps } = useMessageStamps();

  const currentStamp = stamps?.find((s) => s.name === keyword);

  const filteredStamps = stamps && searchStamps(stamps, keyword);

  const render = () => (
    <div>
      <Popover width="target" position="bottom" shadow="sm" opened={opened} onChange={setOpened}>
        <Popover.Target>
          <TextInput
            placeholder="スタンプ名を入力"
            value={keyword}
            onFocus={() => setOpened(true)}
            leftSection={
              currentStamp ? (
                <div className="inline-grid place-content-center p-1">
                  <StampImage stampId={currentStamp.id} />
                </div>
              ) : null
            }
            onChange={(e) => {
              setKeyword(e.target.value);
              const stamp = stamps?.find((s) => s.name === e.target.value);
              if (stamp) setStampId(stamp.id);
              if (e.target.value === '') setStampId(null);
            }}
          />
        </Popover.Target>
        <Popover.Dropdown>
          <div className="max-h-40 overflow-y-auto -my-3 p-4 -mx-4">
            {filteredStamps?.length === 0 && <div className="text-gray-400">スタンプが見つかりません</div>}
            <div className="flex flex-wrap gap-2 w-fit">
              {filteredStamps?.slice(0, 100).map((s) => (
                <button
                  type="button"
                  title={s.name}
                  key={s.id}
                  onClick={() => {
                    setKeyword(s.name);
                    setStampId(s.id);
                    setOpened(false);
                  }}
                >
                  <div className="bg-gray-400 animate-pulse" />
                  <StampImage stampId={s.id} />
                </button>
              ))}
            </div>
          </div>
        </Popover.Dropdown>
      </Popover>
    </div>
  );

  return { stampId, render };
};

export type StampImageProps = {
  stampId: string;
  size?: number;
} & JSX.IntrinsicElements['img'];

export const StampImage: FC<StampImageProps> = ({ stampId, size = 24, ...props }) => {
  const { getStamp } = useMessageStamps();
  const stamp = getStamp(stampId);
  if (!stamp) return <Skeleton width={24} height={24} />;

  return (
    <img
      src={`/api/files/${stamp.fileId}?width=${size * 2}&height=${size * 2}`}
      width={size}
      height={size}
      loading="lazy"
      {...props}
      alt=""
    />
  );
};
