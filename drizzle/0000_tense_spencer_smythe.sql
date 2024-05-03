CREATE TABLE `message_stamps` (
	`user_id` text NOT NULL,
	`stamp_id` text NOT NULL,
	`message_id` text NOT NULL,
	`channel_id` text NOT NULL,
	`count` integer NOT NULL,
	`created_at` text NOT NULL,
	`created_at_timestamp` integer NOT NULL,
	PRIMARY KEY(`message_id`, `stamp_id`, `user_id`),
	FOREIGN KEY (`message_id`) REFERENCES `messages`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `messages` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`channel_id` text NOT NULL,
	`content` text NOT NULL,
	`created_at` text NOT NULL,
	`created_at_timestamp` integer NOT NULL,
	`pinned` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `message_stamps_user_id_idx` ON `message_stamps` (`user_id`);--> statement-breakpoint
CREATE INDEX `message_stamps_stamp_id_idx` ON `message_stamps` (`stamp_id`);--> statement-breakpoint
CREATE INDEX `message_stamps_message_id_idx` ON `message_stamps` (`message_id`);--> statement-breakpoint
CREATE INDEX `message_stamps_channel_id_idx` ON `message_stamps` (`channel_id`);--> statement-breakpoint
CREATE INDEX `message_stamps_created_at_idx` ON `message_stamps` (`created_at`);--> statement-breakpoint
CREATE INDEX `message_stamps_created_at_timestamp_idx` ON `message_stamps` (`created_at_timestamp`);--> statement-breakpoint
CREATE INDEX `messages_user_id_idx` ON `messages` (`user_id`);--> statement-breakpoint
CREATE INDEX `messages_channel_id_idx` ON `messages` (`channel_id`);--> statement-breakpoint
CREATE INDEX `messages_created_at_idx` ON `messages` (`created_at`);--> statement-breakpoint
CREATE INDEX `messages_created_at_timestamp_idx` ON `messages` (`created_at_timestamp`);--> statement-breakpoint
CREATE INDEX `messages_pinned_idx` ON `messages` (`pinned`);