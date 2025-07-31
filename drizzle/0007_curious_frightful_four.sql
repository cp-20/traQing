CREATE INDEX "message_stamps_stamp_id_user_id_idx" ON "message_stamps" USING btree ("stamp_id","user_id");--> statement-breakpoint
CREATE INDEX "message_stamps_stamp_id_message_user_id_idx" ON "message_stamps" USING btree ("stamp_id","message_user_id");--> statement-breakpoint
CREATE INDEX "message_stamps_stamp_id_channel_id_idx" ON "message_stamps" USING btree ("stamp_id","channel_id");--> statement-breakpoint
CREATE INDEX "message_stamps_stamp_id_message_id_idx" ON "message_stamps" USING btree ("stamp_id","message_id");--> statement-breakpoint
CREATE INDEX "message_stamps_user_id_stamp_id_idx" ON "message_stamps" USING btree ("user_id","stamp_id");--> statement-breakpoint
CREATE INDEX "message_stamps_user_id_channel_id_idx" ON "message_stamps" USING btree ("user_id","channel_id");--> statement-breakpoint
CREATE INDEX "message_stamps_message_user_id_channel_id_idx" ON "message_stamps" USING btree ("message_user_id","channel_id");--> statement-breakpoint
CREATE INDEX "messages_user_id_channel_id_idx" ON "messages" USING btree ("user_id","channel_id");