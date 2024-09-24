ALTER TABLE "message_stamps" ADD COLUMN "is_bot" boolean NOT NULL;--> statement-breakpoint
ALTER TABLE "message_stamps" ADD COLUMN "is_bot_message" boolean NOT NULL;--> statement-breakpoint
ALTER TABLE "messages" ADD COLUMN "is_bot" boolean NOT NULL;