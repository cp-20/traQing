ALTER TABLE "message_stamps" ADD COLUMN "message_user_id" uuid;

CREATE OR REPLACE FUNCTION get_message_user (prm uuid) RETURNS uuid LANGUAGE SQL IMMUTABLE STRICT AS $$
  SELECT "user_id" FROM "messages" WHERE "id" = $1
$$;
CREATE INDEX IF NOT EXISTS idx_message_stamps ON message_stamps ( get_message_user(message_id) );

UPDATE "message_stamps" SET "message_user_id" = get_message_user("message_id") WHERE "message_user_id" IS NULL;

DROP INDEX IF EXISTS idx_message_stamps;
DROP FUNCTION get_message_user(uuid);
