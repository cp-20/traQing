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
