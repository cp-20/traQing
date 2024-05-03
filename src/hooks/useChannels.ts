import { atom, useAtom } from 'jotai';
import { useCallback, useEffect } from 'react';
import type { Channel } from 'traq-bot-ts';

const channelsAtom = atom<Channel[]>([]);

export const useChannels = () => {
  const [channels, setChannels] = useAtom(channelsAtom);

  const getChannelName = useCallback(
    (id: string): string => {
      const channel = channels.find((c) => c.id === id);
      if (!channel) {
        console.error(`Channel not found: ${id}`);
        return 'Unknown';
      }

      const parent = channels.find((c) => c.id === channel.parentId);
      if (parent) {
        return `${getChannelName(parent.id)}/${channel.name}`;
      }

      return channel.name;
    },
    [channels]
  );

  const getSummedChannelName = useCallback(
    (id: string): string => {
      const name = getChannelName(id);
      return name.replaceAll(/([^/])[^/]*\//g, '$1/');
    },
    [channels, getChannelName]
  );

  useEffect(() => {
    const fetchChannels = async () => {
      const res = await fetch('/api/channels');
      const data = await res.json();
      setChannels(data);
    };

    fetchChannels();
  }, [setChannels]);

  return { channels, getChannelName, getSummedChannelName };
};
