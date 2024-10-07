ALTER TABLE "channel_pins" DROP CONSTRAINT "channel_pins_channel_id_channels_id_fk";
--> statement-breakpoint
ALTER TABLE "channel_pins" DROP CONSTRAINT "channel_pins_message_id_messages_id_fk";
--> statement-breakpoint
ALTER TABLE "channel_subscriptions" DROP CONSTRAINT "channel_subscriptions_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "channel_subscriptions" DROP CONSTRAINT "channel_subscriptions_channel_id_channels_id_fk";
--> statement-breakpoint
ALTER TABLE "user_group_relations" DROP CONSTRAINT "user_group_relations_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "user_group_relations" DROP CONSTRAINT "user_group_relations_group_id_groups_id_fk";

DROP TABLE "channels";--> statement-breakpoint
DROP TABLE "groups";--> statement-breakpoint
DROP TABLE "users";--> statement-breakpoint
