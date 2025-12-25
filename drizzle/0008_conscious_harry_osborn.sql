DROP MATERIALIZED VIEW IF EXISTS "public"."yearly_channel_message_ranking";
CREATE MATERIALIZED VIEW "public"."yearly_channel_message_ranking" AS (select TO_CHAR("created_at", 'YYYY') as "year", "user_id", "channel_id", count(*) as "count" from "messages" group by TO_CHAR("messages"."created_at", 'YYYY'), "messages"."user_id", "messages"."channel_id" order by TO_CHAR("messages"."created_at", 'YYYY') desc, count(*) desc);--> statement-breakpoint
DROP MATERIALIZED VIEW IF EXISTS "public"."yearly_gave_message_stamp_channels_ranking";
CREATE MATERIALIZED VIEW "public"."yearly_gave_message_stamp_channels_ranking" AS (select TO_CHAR("created_at", 'YYYY') as "year", "user_id", "channel_id", count(*) as "count" from "message_stamps" group by TO_CHAR("message_stamps"."created_at", 'YYYY'), "message_stamps"."user_id", "message_stamps"."channel_id" order by TO_CHAR("message_stamps"."created_at", 'YYYY') desc, count(*) desc);--> statement-breakpoint
DROP MATERIALIZED VIEW IF EXISTS "public"."yearly_gave_message_stamps_ranking";
CREATE MATERIALIZED VIEW "public"."yearly_gave_message_stamps_ranking" AS (select TO_CHAR("created_at", 'YYYY') as "year", "user_id", "stamp_id", count(*) as "count" from "message_stamps" group by TO_CHAR("message_stamps"."created_at", 'YYYY'), "message_stamps"."user_id", "message_stamps"."stamp_id" order by count(*) desc);--> statement-breakpoint
DROP MATERIALIZED VIEW IF EXISTS "public"."yearly_message_length_ranking";
CREATE MATERIALIZED VIEW "public"."yearly_message_length_ranking" AS (select TO_CHAR("created_at", 'YYYY') as "year", "user_id", SUM(length("content")) as "total_length" from "messages" group by TO_CHAR("messages"."created_at", 'YYYY'), "messages"."user_id" order by SUM(length("messages"."content")) desc);--> statement-breakpoint
DROP MATERIALIZED VIEW IF EXISTS "public"."yearly_messages_ranking";
CREATE MATERIALIZED VIEW "public"."yearly_messages_ranking" AS (select TO_CHAR("created_at", 'YYYY') as "year", "user_id", count(*) as "count" from "messages" group by TO_CHAR("messages"."created_at", 'YYYY'), "messages"."user_id" order by count(*) desc);--> statement-breakpoint
DROP MATERIALIZED VIEW IF EXISTS "public"."yearly_received_message_stamps_ranking";
CREATE MATERIALIZED VIEW "public"."yearly_received_message_stamps_ranking" AS (select TO_CHAR("created_at", 'YYYY') as "year", "message_user_id", "stamp_id", count(*) as "count" from "message_stamps" group by TO_CHAR("message_stamps"."created_at", 'YYYY'), "message_stamps"."message_user_id", "message_stamps"."stamp_id" order by count(*) desc);--> statement-breakpoint

CREATE INDEX IF NOT EXISTS idx_yearly_channel_message_ranking ON yearly_channel_message_ranking (year DESC, user_id ASC, channel_id ASC);
CREATE INDEX IF NOT EXISTS idx_yearly_gave_message_stamp_channels_ranking ON yearly_gave_message_stamp_channels_ranking (year DESC, user_id ASC, channel_id ASC);
CREATE INDEX IF NOT EXISTS idx_yearly_gave_message_stamps_ranking ON yearly_gave_message_stamps_ranking (year DESC, user_id ASC);
CREATE INDEX IF NOT EXISTS idx_yearly_message_length_ranking ON yearly_message_length_ranking (year DESC, user_id ASC);
CREATE INDEX IF NOT EXISTS idx_yearly_messages_ranking ON yearly_messages_ranking (year DESC, user_id ASC);
CREATE INDEX IF NOT EXISTS idx_yearly_received_message_stamps_ranking ON yearly_received_message_stamps_ranking (year DESC, message_user_id ASC);
