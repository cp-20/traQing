import { ChannelIcon } from '@/components/icons/ChannelIcon';
import { useChannels } from '@/hooks/useChannels';
import { searchChannels } from '@/lib/search';
import { Popover, ScrollArea, TextInput, type TextInputProps } from '@mantine/core';
import { type FC, useMemo, useState } from 'react';

type Props = {
  reducer: ReturnType<typeof useChannelSelect>;
  textInputProps?: TextInputProps;
};

export const useChannelSelect = () => {
  const [channelId, setChannelId] = useState<string | null>(null);

  return {
    channelId,
    state: { channelId },
    actions: { setChannelId },
  };
};

export const ChannelSelect: FC<Props> = ({ reducer, textInputProps }) => {
  const { setChannelId } = reducer.actions;
  const [keyword, setKeyword] = useState<string>('');
  const [opened, setOpened] = useState(false);
  const [isInvalid, setIsInvalid] = useState(false);
  const { channels, getChannelName, getChannelId } = useChannels();

  const channelNameSet = useMemo(() => new Set(channels?.map((c) => getChannelName(c.id))), [channels, getChannelName]);

  const filteredChannels = useMemo(() => channels && searchChannels(channels, keyword), [channels, keyword]);

  return (
    <div>
      <Popover width="target" position="bottom" shadow="sm" opened={opened} onChange={setOpened}>
        <Popover.Target>
          <TextInput
            placeholder="チャンネル名を入力"
            value={keyword}
            onFocus={() => setOpened(true)}
            leftSection={<ChannelIcon className="text-text-primary" />}
            error={isInvalid}
            onBlur={(e) => {
              if (channelNameSet.has(e.target.value)) {
                setChannelId(getChannelId(e.target.value) ?? '');
              } else {
                setIsInvalid(e.target.value !== '' && !channelNameSet.has(e.target.value));
              }
              if (e.target.value === '') setChannelId(null);
            }}
            onChange={(e) => {
              setKeyword(e.target.value);
            }}
            {...textInputProps}
          />
        </Popover.Target>
        <Popover.Dropdown>
          <ScrollArea.Autosize type="scroll" mah={320} className="-my-3 -mx-4">
            {filteredChannels?.length === 0 && (
              <div className="text-gray-400 px-4 py-1">チャンネルが見つかりません</div>
            )}
            <div className="flex flex-col gap-2 w-full">
              {filteredChannels?.slice(0, 100).map((c) => (
                <button
                  type="button"
                  title={getChannelName(c.id)}
                  key={c.id}
                  onClick={() => {
                    setKeyword(getChannelName(c.id) ?? '');
                    setChannelId(c.id);
                    setOpened(false);
                  }}
                  className="flex items-center gap-2 hover:bg-gray-100 px-4 py-1"
                >
                  <ChannelIcon className="shrink-0" />
                  <div className="flex flex-col items-start">
                    <span className="text-sm text-nowrap">{getChannelName(c.id)}</span>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea.Autosize>
        </Popover.Dropdown>
      </Popover>
    </div>
  );
};