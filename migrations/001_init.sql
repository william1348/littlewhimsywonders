-- Studio list and hold requests. Preview traffic is stored apart from
-- production rows so a preview host does not mix into the live list.

CREATE TABLE IF NOT EXISTS subscribers (
  id BIGSERIAL PRIMARY KEY,
  email TEXT NOT NULL,
  source TEXT NOT NULL,
  stage TEXT NOT NULL CHECK (stage IN ('production', 'preview')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (email, stage)
);

CREATE TABLE IF NOT EXISTS inquiries (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  pieces TEXT NOT NULL,
  stage TEXT NOT NULL CHECK (stage IN ('production', 'preview')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS subscribers_stage_created_idx
  ON subscribers (stage, created_at DESC);

CREATE INDEX IF NOT EXISTS inquiries_stage_created_idx
  ON inquiries (stage, created_at DESC);

CREATE TABLE IF NOT EXISTS orders (
  id BIGSERIAL PRIMARY KEY,
  session_id TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  customer_email TEXT NOT NULL DEFAULT '',
  amount_total INTEGER NOT NULL CHECK (amount_total >= 0),
  currency TEXT NOT NULL DEFAULT 'usd',
  status TEXT NOT NULL CHECK (status IN ('paid', 'unpaid', 'failed')),
  source TEXT NOT NULL,
  stage TEXT NOT NULL CHECK (stage IN ('production', 'preview')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS orders_stage_created_idx
  ON orders (stage, created_at DESC);
