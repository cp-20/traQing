import { dropMessagesAndStamps, updateMessages } from '@/traQ';

await dropMessagesAndStamps();
await updateMessages(true);
