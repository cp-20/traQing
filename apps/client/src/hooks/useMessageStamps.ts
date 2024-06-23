import { atom, useAtom } from 'jotai';
import { useCallback, useEffect } from 'react';
import type { Stamp } from 'traq-bot-ts';

const stampsAtom = atom<Stamp[]>([]);

export const useMessageStamps = () => {
  const [stamps, setStamps] = useAtom(stampsAtom);

  const getStamp = useCallback(
    (id: string) => {
      const stamp = stamps.find((s) => s.id === id);
      if (!stamp) {
        console.error(`Stamp not found: ${id}`);
        return null;
      }

      return stamp;
    },
    [stamps]
  );

  useEffect(() => {
    const fetchStamps = async () => {
      const res = await fetch('/api/message-stamps');
      const data = await res.json();
      setStamps(data);
    };

    fetchStamps();
  }, [setStamps]);

  return { stamps, getStamp };
};
