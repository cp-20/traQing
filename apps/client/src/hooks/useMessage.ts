import { useMessageData } from '@/hooks/useServerData';

export const useMessage = (messageId: string) => {
  const { data: message } = useMessageData(messageId);

  return { message };
};
