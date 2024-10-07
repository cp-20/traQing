CREATE TABLE IF NOT EXISTS "channel_pins" (
	"channel_id" uuid NOT NULL,
	"message_id" uuid NOT NULL,
	CONSTRAINT "channel_pins_channel_id_message_id_pk" PRIMARY KEY("channel_id","message_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "channel_subscriptions" (
	"user_id" uuid NOT NULL,
	"channel_id" uuid NOT NULL,
	CONSTRAINT "channel_subscriptions_user_id_channel_id_pk" PRIMARY KEY("user_id","channel_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "channels" (
	"id" uuid PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "groups" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tags" (
	"user_id" uuid NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "tags_user_id_name_pk" PRIMARY KEY("user_id","name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_group_relations" (
	"user_id" uuid NOT NULL,
	"group_id" uuid NOT NULL,
	"is_admin" boolean NOT NULL,
	CONSTRAINT "user_group_relations_user_id_group_id_pk" PRIMARY KEY("user_id","group_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"is_bot" boolean NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "channel_pins" ADD CONSTRAINT "channel_pins_channel_id_channels_id_fk" FOREIGN KEY ("channel_id") REFERENCES "public"."channels"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "channel_pins" ADD CONSTRAINT "channel_pins_message_id_messages_id_fk" FOREIGN KEY ("message_id") REFERENCES "public"."messages"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "channel_subscriptions" ADD CONSTRAINT "channel_subscriptions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "channel_subscriptions" ADD CONSTRAINT "channel_subscriptions_channel_id_channels_id_fk" FOREIGN KEY ("channel_id") REFERENCES "public"."channels"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_group_relations" ADD CONSTRAINT "user_group_relations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_group_relations" ADD CONSTRAINT "user_group_relations_group_id_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."groups"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "channel_pins_channel_id_idx" ON "channel_pins" USING btree ("channel_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "channel_pins_message_id_idx" ON "channel_pins" USING btree ("message_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "channel_subscriptions_user_id_idx" ON "channel_subscriptions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "channel_subscriptions_channel_id_idx" ON "channel_subscriptions" USING btree ("channel_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "groups_updated_at_idx" ON "groups" USING btree ("updated_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "tags_name_idx" ON "tags" USING btree ("name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_group_relations_user_id_idx" ON "user_group_relations" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_group_relations_group_id_idx" ON "user_group_relations" USING btree ("group_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "users_updated_at_idx" ON "users" USING btree ("updated_at");