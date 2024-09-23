import { useChannelsData } from '@/hooks/useServerData';
import { useCallback } from 'react';

export const useChannels = () => {
  const { data: channels } = useChannelsData();

  const getChannelName = useCallback(
    (id: string): string | undefined => {
      if (!channels) return undefined;

      const channel = channels.find((c) => c.id === id);
      if (!channel) return undefined;

      const parent = channels.find((c) => c.id === channel.parentId);
      if (parent) {
        return `${getChannelName(parent.id)}/${channel.name}`;
      }

      return channel.name;
    },
    [channels],
  );

  const getSummedChannelName = useCallback(
    (id: string) => {
      const name = getChannelName(id);
      if (!name) return undefined;

      return name.replaceAll(/([^/])[^/]*\//g, '$1/');
    },
    [channels, getChannelName],
  );

  return { channels, getChannelName, getSummedChannelName };
};
