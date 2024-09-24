import { useChannelsData } from '@/hooks/useServerData';
import { useCallback } from 'react';

export const useChannels = () => {
  const { data: channels } = useChannelsData();

  const getChannelId = useCallback(
    (fullname: string): string | undefined => {
      if (!channels) return undefined;

      let parentId: string | null = null;
      for (const name of fullname.split('/')) {
        parentId = channels.find((c) => c.name === name && c.parentId === parentId)?.id ?? null;
        if (!parentId) return undefined;
      }

      return parentId ?? undefined;
    },
    [channels],
  );

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
    [getChannelName],
  );

  return { channels, getChannelId, getChannelName, getSummedChannelName };
};
