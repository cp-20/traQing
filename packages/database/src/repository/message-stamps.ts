import { db } from '@/db';
import * as schema from '@/schema';

type MessageStamp = typeof schema.messageStamps.$inferSelect;

export const insertMessageStamps = async (stamps: MessageStamp[]) => {
  await db.insert(schema.messageStamps).values(stamps).onConflictDoNothing().execute();
};
