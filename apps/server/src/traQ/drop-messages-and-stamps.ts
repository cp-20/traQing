import { dropMessages, dropStamps } from '@traq-ing/database';

export const dropMessagesAndStamps = async () => {
  await dropMessages();
  await dropStamps();
};
