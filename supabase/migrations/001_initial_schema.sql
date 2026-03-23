-- ============================================================
--  FRP Production Dashboard — Initial Schema
--  Run this in Supabase SQL Editor (or via supabase db push)
-- ============================================================

-- Enable UUID extension (already available in Supabase by default)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── PRODUCTION ENTRIES ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS production_entries (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  date         DATE        NOT NULL,
  code         TEXT        NOT NULL,
  color        TEXT        NOT NULL DEFAULT 'GREY',
  cover_qty    INTEGER     NOT NULL DEFAULT 0 CHECK (cover_qty >= 0),
  frame_qty    INTEGER     NOT NULL DEFAULT 0 CHECK (frame_qty >= 0),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_production_date  ON production_entries (date);
CREATE INDEX IF NOT EXISTS idx_production_code  ON production_entries (code);

-- ─── FINISHING ENTRIES ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS finishing_entries (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  date            DATE        NOT NULL,
  code            TEXT        NOT NULL,
  color           TEXT        NOT NULL DEFAULT 'GREY',
  cover_finished  INTEGER     NOT NULL DEFAULT 0 CHECK (cover_finished >= 0),
  frame_finished  INTEGER     NOT NULL DEFAULT 0 CHECK (frame_finished >= 0),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_finishing_date ON finishing_entries (date);
CREATE INDEX IF NOT EXISTS idx_finishing_code ON finishing_entries (code);

-- ─── DISPATCH ENTRIES ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS dispatch_entries (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  date              DATE        NOT NULL,
  code              TEXT        NOT NULL,
  color             TEXT        NOT NULL DEFAULT 'GREY',
  cover_dispatched  INTEGER     NOT NULL DEFAULT 0 CHECK (cover_dispatched >= 0),
  frame_dispatched  INTEGER     NOT NULL DEFAULT 0 CHECK (frame_dispatched >= 0),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_dispatch_date ON dispatch_entries (date);
CREATE INDEX IF NOT EXISTS idx_dispatch_code ON dispatch_entries (code);

-- ─── RAW MATERIAL ENTRIES ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS raw_material_entries (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  date        DATE        NOT NULL,
  material    TEXT        NOT NULL,
  category    TEXT        NOT NULL CHECK (category IN ('INWARD', 'OUTWARD')),
  department  TEXT        NOT NULL CHECK (department IN ('PRODUCTION', 'FINISHING')),
  unit        TEXT        NOT NULL,
  qty         NUMERIC     NOT NULL DEFAULT 0 CHECK (qty >= 0),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_rawmat_date     ON raw_material_entries (date);
CREATE INDEX IF NOT EXISTS idx_rawmat_material ON raw_material_entries (material);

-- ─── ROW LEVEL SECURITY ───────────────────────────────────────────────────────
-- Enable RLS on all tables. Currently using the anon key from the frontend
-- so we allow all operations for authenticated requests.
-- Tighten these policies once proper Supabase Auth is integrated.

ALTER TABLE production_entries    ENABLE ROW LEVEL SECURITY;
ALTER TABLE finishing_entries     ENABLE ROW LEVEL SECURITY;
ALTER TABLE dispatch_entries      ENABLE ROW LEVEL SECURITY;
ALTER TABLE raw_material_entries  ENABLE ROW LEVEL SECURITY;

-- Allow full access via the service role (backend) and anon key (frontend).
-- If you want to restrict to authenticated users only, replace "true" with:
--   auth.role() = 'authenticated'

CREATE POLICY "allow_all_production"   ON production_entries    FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_finishing"    ON finishing_entries     FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_dispatch"     ON dispatch_entries      FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_rawmaterial"  ON raw_material_entries  FOR ALL USING (true) WITH CHECK (true);
