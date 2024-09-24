ALTER TABLE "message_stamps" ALTER COLUMN "message_user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "message_stamps" ALTER COLUMN "channel_id" SET NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "message_stamps_message_user_id_idx" ON "message_stamps" USING btree ("message_user_id");

--- Materialized view for channel messages ranking
DROP MATERIALIZED VIEW IF EXISTS channel_messages_ranking;
CREATE MATERIALIZED VIEW channel_messages_ranking AS
SELECT
  channel_id,
  COUNT(*) AS count
FROM
  messages
GROUP BY
  channel_id
ORDER BY
  count DESC;

-- Materialized view for messages ranking
DROP MATERIALIZED VIEW IF EXISTS messages_ranking;
CREATE MATERIALIZED VIEW messages_ranking AS
SELECT
  user_id,
  COUNT(*) AS count
FROM
  messages
GROUP BY
  user_id
ORDER BY
  count DESC;

-- Materialized view for messages monthly timeline
DROP MATERIALIZED VIEW IF EXISTS messages_monthly_timeline;
CREATE MATERIALIZED VIEW messages_monthly_timeline AS
SELECT
  TO_CHAR(created_at, 'YYYY-MM') as month,
  COUNT(*) AS count
FROM
  messages
GROUP BY
  TO_CHAR(created_at, 'YYYY-MM')
ORDER BY
  TO_CHAR(created_at, 'YYYY-MM') ASC;

-- Materialized view for stamp ranking
DROP MATERIALIZED VIEW IF EXISTS stamp_ranking;
CREATE MATERIALIZED VIEW stamp_ranking AS
SELECT
  stamp_id,
  COUNT(*) AS count
FROM
  message_stamps
GROUP BY
  stamp_id
ORDER BY
  count DESC;

-- Materialized view for channel stamps ranking
DROP MATERIALIZED VIEW IF EXISTS channel_stamps_ranking;
CREATE MATERIALIZED VIEW channel_stamps_ranking AS
SELECT
  channel_id,
  COUNT(*) AS count
FROM
  message_stamps
GROUP BY
  channel_id
ORDER BY
  count DESC;

-- Materialized view for gave message stamps ranking
DROP MATERIALIZED VIEW IF EXISTS gave_message_stamps_ranking;
CREATE MATERIALIZED VIEW gave_message_stamps_ranking AS
SELECT
  user_id,
  COUNT(*) AS count
FROM
  message_stamps
GROUP BY
  user_id
ORDER BY
  count DESC;

-- Materialized view for received message stamps ranking
DROP MATERIALIZED VIEW IF EXISTS received_message_stamps_ranking;
CREATE MATERIALIZED VIEW received_message_stamps_ranking AS
SELECT
  message_user_id,
  COUNT(*) AS count
FROM
  message_stamps
GROUP BY
  message_user_id
ORDER BY
  count DESC;

-- Materialized view for stamp relations
DROP MATERIALIZED VIEW IF EXISTS stamp_relations;
CREATE MATERIALIZED VIEW stamp_relations AS
SELECT
  user_id,
  message_user_id,
  COUNT(*) AS count
FROM
  message_stamps
GROUP BY
  user_id,
  message_user_id
ORDER BY
  count DESC;

-- functions

CREATE
OR REPLACE FUNCTION formatMonth (prm TIMESTAMP) RETURNS TEXT LANGUAGE SQL IMMUTABLE STRICT AS $$
  SELECT to_char($1, 'YYYY-MM')
$$;

CREATE INDEX IF NOT EXISTS idx_month_on_messages_created_at ON messages (formatMonth (created_at));

CREATE INDEX IF NOT EXISTS idx_month_on_message_stamps_created_at ON message_stamps (formatMonth (created_at));

CREATE
OR REPLACE FUNCTION formatDate (prm TIMESTAMP) RETURNS TEXT LANGUAGE SQL IMMUTABLE STRICT AS $$
  SELECT to_char($1, 'YYYY-MM-DD')
$$;

CREATE INDEX IF NOT EXISTS idx_date_on_messages_created_at ON messages (formatDate (created_at));

CREATE INDEX IF NOT EXISTS idx_date_on_message_stamps_created_at ON message_stamps (formatDate (created_at));

CREATE
OR REPLACE FUNCTION formatHour (prm TIMESTAMP) RETURNS TEXT LANGUAGE SQL IMMUTABLE STRICT AS $$
  SELECT to_char($1, 'HH24')
$$;

CREATE INDEX IF NOT EXISTS idx_hour_on_messages_created_at ON messages (formatHour (created_at));

CREATE INDEX IF NOT EXISTS idx_hour_on_message_stamps_created_at ON message_stamps (formatHour (created_at));
