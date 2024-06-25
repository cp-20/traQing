import { client } from '@/features/api';
import { useState, useEffect } from 'react';
import type { Message } from 'traq-bot-ts';

export const useMessage = (messageId: string) => {
  const [message, setMessage] = useState<Message | null>(null);

  useEffect(() => {
    const fetchMessage = async () => {
      const res = await client.messages[':id'].$get({
        param: { id: messageId },
      });
      if (!res.ok) {
        console.error(`Failed to fetch message: ${messageId}`);
        return;
      }
      const data = await res.json();
      setMessage(data);
    };

    fetchMessage();
  }, [messageId]);

  return { message };
};
