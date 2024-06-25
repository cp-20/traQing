CREATE TABLE IF NOT EXISTS "message_stamps" (
	"user_id" uuid NOT NULL,
	"stamp_id" uuid NOT NULL,
	"message_id" uuid NOT NULL,
	"channel_id" uuid,
	"count" integer NOT NULL,
	"created_at" timestamp NOT NULL,
	CONSTRAINT "message_stamps_user_id_stamp_id_message_id_pk" PRIMARY KEY("user_id","stamp_id","message_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "messages" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"channel_id" uuid NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"pinned" boolean NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "message_stamps" ADD CONSTRAINT "message_stamps_message_id_messages_id_fk" FOREIGN KEY ("message_id") REFERENCES "public"."messages"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "message_stamps_user_id_idx" ON "message_stamps" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "message_stamps_stamp_id_idx" ON "message_stamps" USING btree ("stamp_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "message_stamps_channel_id_idx" ON "message_stamps" USING btree ("channel_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "message_stamps_message_id_idx" ON "message_stamps" USING btree ("message_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "message_stamps_created_at_idx" ON "message_stamps" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "messages_user_id_idx" ON "messages" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "messages_channel_id_idx" ON "messages" USING btree ("channel_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "messages_created_at_idx" ON "messages" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "messages_pinned_idx" ON "messages" USING btree ("pinned");