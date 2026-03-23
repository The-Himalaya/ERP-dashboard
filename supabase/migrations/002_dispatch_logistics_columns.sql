-- ============================================================
--  FRP Production Dashboard — Dispatch Logistics Columns
--  Run this in Supabase SQL Editor (or via supabase db push)
-- ============================================================

ALTER TABLE dispatch_entries
  ADD COLUMN IF NOT EXISTS set_dispatched   INTEGER,
  ADD COLUMN IF NOT EXISTS order_no         TEXT,
  ADD COLUMN IF NOT EXISTS sales_ref        TEXT,
  ADD COLUMN IF NOT EXISTS client           TEXT,
  ADD COLUMN IF NOT EXISTS order_date       DATE,
  ADD COLUMN IF NOT EXISTS target_date      DATE,
  ADD COLUMN IF NOT EXISTS chalan_no        TEXT,
  ADD COLUMN IF NOT EXISTS actual_date      DATE,
  ADD COLUMN IF NOT EXISTS vehicle_number   TEXT;
