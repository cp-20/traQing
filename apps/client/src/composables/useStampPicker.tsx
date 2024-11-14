import { useMessageStamps } from '@/hooks/useMessageStamps';
import { searchStamps } from '@/lib/search';
import { Popover, Skeleton, TextInput, type TextInputProps } from '@mantine/core';
import { type FC, useState } from 'react';

export const useStampPicker = () => {
  const [stampId, setStampId] = useState<string | null>(null);
  const [keyword, setKeyword] = useState<string>('');
  const [opened, setOpened] = useState(false);
  const { stamps } = useMessageStamps();

  const currentStamp = stamps?.find((s) => s.name === keyword);

  const filteredStamps = stamps && searchStamps(stamps, keyword);

  const render = (props?: { textInputProps: TextInputProps }) => (
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
            {...props?.textInputProps}
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
  if (!stamp) return <Skeleton width={size} height={size} />;

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
