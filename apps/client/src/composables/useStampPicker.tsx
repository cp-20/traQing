import { Popover, Skeleton, TextInput, type TextInputProps } from '@mantine/core';
import { type FC, type JSX, useEffect, useState } from 'react';
import { useMessageStamps } from '@/hooks/useMessageStamps';
import { searchStamps } from '@/lib/search';

export const useStampPicker = () => {
  const [stampId, setStampId] = useState<string | null>(null);

  return {
    stampId,
    state: {
      stampId,
    },
    actions: {
      setStampId,
    },
  };
};

type StampPickerProps = {
  reducer: ReturnType<typeof useStampPicker>;
  textInputProps?: TextInputProps;
};

export const StampPicker: FC<StampPickerProps> = ({ reducer, textInputProps }) => {
  const { setStampId } = reducer.actions;
  const [keyword, setKeyword] = useState<string>('');
  const [opened, setOpened] = useState(false);
  const { stamps } = useMessageStamps();

  const currentStamp = stamps?.find((s) => s.id === reducer.state.stampId);

  const filteredStamps = stamps && searchStamps(stamps, keyword);

  // biome-ignore lint/correctness/useExhaustiveDependencies: 外部から setStampId された時の処理
  useEffect(() => {
    if (!currentStamp) return;
    if (currentStamp.name !== keyword) {
      setKeyword(currentStamp.name);
    }
  }, [reducer.state.stampId, currentStamp]);

  return (
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
            onBlur={(e) => {
              if (e.relatedTarget?.classList.contains('stamp-picker-button')) return;

              setOpened(false);
              const stamp = stamps?.find((s) => s.name === e.target.value);
              if (stamp) {
                setStampId(stamp.id);
              } else {
                setKeyword(currentStamp?.name ?? '');
              }
            }}
            onChange={(e) => {
              setKeyword(e.target.value);
              const stamp = stamps?.find((s) => s.name === e.target.value);
              if (stamp) setStampId(stamp.id);
              if (e.target.value === '') setStampId(null);
            }}
            {...textInputProps}
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
                  className="stamp-picker-button"
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
