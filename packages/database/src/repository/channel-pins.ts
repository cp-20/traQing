import { and, eq, or } from 'drizzle-orm';
import { db } from '@/db';
import * as schema from '@/schema';

export const getChannelPins = async () => {
  return await db.select().from(schema.channelPins).execute();
};

export const insertChannelPins = async (pins: { channelId: string; messageId: string }[]) => {
  await db
    .insert(schema.channelPins)
    .values(pins)
    .onConflictDoNothing()
    .returning({ channelId: schema.channelPins.channelId })
    .execute();
};

export const deleteChannelPins = async (pins: { channelId: string; messageId: string }[]) => {
  await db
    .delete(schema.channelPins)
    .where(
      or(
        ...pins.map((pin) =>
          and(eq(schema.channelPins.channelId, pin.channelId), eq(schema.channelPins.messageId, pin.messageId)),
        ),
      ),
    )
    .returning({ channelId: schema.channelPins.channelId })
    .execute();
};
