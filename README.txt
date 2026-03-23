================================================================================
  FRP PRODUCTION DASHBOARD
  Full-Stack Manufacturing Management System
================================================================================

OVERVIEW
--------
A real-time production management dashboard built for FRP (Fiber Reinforced
Plastic) manufacturing operations. Tracks the complete manufacturing pipeline
from raw material intake through production, finishing, dispatch, and
inventory (stock) — all from a single web application.

Designed as a multi-role ERP-lite system with role-based access control,
real-time stock calculation, Google Sheets sync, and a dark-themed UI
optimized for factory floor and office use.


LIVE FEATURES
-------------
  - Production Logging    : Log daily cover & frame production per product code
  - Finishing Tracking    : Track finishing/coating progress per SKU
  - Dispatch Management   : Full dispatch workflow with order metadata, delivery
                            status tracking (Before Time / On Time / Delayed),
                            inline actual-date editing, and stock warnings
  - Real-Time Stock       : Auto-calculated stock = Production - Dispatch,
                            with backlog/partial status alerts per SKU
  - Raw Material Ledger   : Inward/outward tracking with weight conversions
  - Monthly Overview      : 6-month executive summary with KPIs and trends
  - CSV Import/Export     : Bulk import production, dispatch, and material data
  - Google Sheets Sync    : Auto-sync entries to Google Sheets via webhook
  - Weight Calculations   : Per-product weight catalog (cover/frame/set kg)
  - Role-Based Auth       : 7 roles (executive, sales, accounts, production,
                            dispatch, operations, quotation) with route guards


TECH STACK
----------
  Frontend        : React 18 + TypeScript 5 + Vite 5
  Styling         : Tailwind CSS 3.4 (dark theme, amber accent)
  Routing         : React Router DOM 6
  Database        : Supabase (PostgreSQL)
  Authentication  : JWT-based (custom backend or Supabase Auth)
  Sheets Sync     : Google Apps Script Web App (fire-and-forget webhook)
  Package Manager : npm


PRODUCT CATALOG
---------------
  8 Product Types   : MHC, EMHC, ONGC, CGT, ROUND, DS, RCS, WGC
  24 Size Variants  : 300x300 mm to 1600x1600 mm, inch sizes, DAI variants
  11 Load Capacities: 2.5T, 3T, 5T, 12.5T, 25T, 30T, 40T, 60T, 90T, E600, F900
  23 Raw Materials  : Resins, fiberglass, fillers, catalysts, pigments, tools

  Product Code Format: {prefix}_{size}_{capacity}
  Example: m_600*600_25t = Manhole Cover, 600x600 mm, 25 Tonne capacity


PROJECT STRUCTURE
-----------------
  frontend/
  |-- src/
  |   |-- main.tsx                          App entry point
  |   |-- App.tsx                           Router + auth wrapper
  |   |-- index.css                         Tailwind globals + scrollbar
  |   |-- lib/
  |   |   |-- supabase.ts                   Supabase client init
  |   |   +-- sheetsSync.ts                 Google Sheets webhook caller
  |   |-- auth/
  |   |   |-- AuthContext.tsx               JWT auth state + login/logout
  |   |   |-- LoginPage.tsx                 Login form UI
  |   |   |-- ProtectedRoute.tsx            Role-based route guard
  |   |   +-- roleGuard.ts                  Role-route mapping + access check
  |   +-- dashboards/
  |       +-- production/
  |           |-- ProductionDashboard.tsx    Shell: header, tabs, context
  |           |-- useProductionData.ts       Core hook: Supabase CRUD + stock
  |           |-- productCatalog.ts          Product types, weights, materials
  |           |-- ProductionTab.tsx          Production entry + KPIs + table
  |           |-- FinishingTab.tsx           Finishing progress + backlog
  |           |-- DispatchTab.tsx            Dispatch form + charts + log
  |           |-- StockTab.tsx              Real-time stock positions
  |           |-- RawMaterialsTab.tsx        Material inward/outward ledger
  |           |-- MonthlyOverviewTab.tsx     6-month executive summary
  |           |-- SettingsPanel.tsx          Dynamic product config
  |           +-- CodeSelect.tsx             Product code dropdown
  |-- supabase/
  |   +-- migrations/
  |       |-- 001_initial_schema.sql         Base tables + RLS policies
  |       +-- 002_dispatch_logistics_columns.sql  Dispatch metadata columns
  |-- google-apps-script/
  |   +-- Code.gs                           Apps Script webhook handler
  |-- index.html
  |-- package.json
  |-- vite.config.ts
  |-- tailwind.config.cjs
  |-- tsconfig.json
  +-- .env.example                          Environment variable template


GETTING STARTED
---------------
  Prerequisites:
    - Node.js 18+ and npm
    - A Supabase project (free tier works)
    - (Optional) Google Sheets + Apps Script for sync

  1. Clone the repository
       git clone <repo-url>
       cd company-dashboard/frontend

  2. Install dependencies
       npm install

  3. Set up environment variables
       Copy .env.example to .env.local and fill in:
         VITE_SUPABASE_URL=https://your-project.supabase.co
         VITE_SUPABASE_ANON_KEY=your-anon-key
         VITE_API_URL=http://localhost:8000
         VITE_SHEETS_WEBHOOK_URL=your-apps-script-url
         VITE_DEV_PREVIEW=true

  4. Run Supabase migrations
       Go to Supabase Dashboard > SQL Editor and run:
         - supabase/migrations/001_initial_schema.sql
         - supabase/migrations/002_dispatch_logistics_columns.sql

  5. Start the dev server
       npm run dev
       Open http://localhost:5173

  6. Build for production
       npm run build
       npm run preview


DATABASE SCHEMA
---------------
  production_entries:
    id (UUID PK), date, code, color, cover_qty, frame_qty, created_at

  finishing_entries:
    id (UUID PK), date, code, color, cover_finished, frame_finished, created_at

  dispatch_entries:
    id (UUID PK), date, code, color, cover_dispatched, frame_dispatched,
    set_dispatched, order_no, sales_ref, client, order_date, target_date,
    chalan_no, actual_date, vehicle_number, created_at

  raw_material_entries:
    id (UUID PK), date, material, category (INWARD|OUTWARD),
    department (PRODUCTION|FINISHING), unit, qty, created_at

  All tables have Row Level Security (RLS) enabled.
  Stock is computed client-side: Stock = Production - Dispatch (per SKU).


DISPATCH WORKFLOW
-----------------
  1. Log dispatch entry with product code, quantities, color
  2. Add order metadata: order no, client, chalan no, sales ref, dates
  3. Sets dispatched auto-fills to min(covers, frames), overridable
  4. Weight auto-calculated from product catalog (sets x setKg + extras)
  5. Stock warning shown if dispatching more than available
  6. Actual delivery date editable inline in the log table
  7. Dispatch status auto-computed:
       actual < target  -->  Before Time (green)
       actual = target  -->  On Time (blue)
       actual > target  -->  Delayed (red)


STOCK CALCULATION
-----------------
  Per product code (cumulative, all-time):
    Stock Cover = Total Produced Covers - Total Dispatched Covers
    Stock Frame = Total Produced Frames - Total Dispatched Frames
    Stock Sets  = min(Stock Cover, Stock Frame)

  Status:
    OK       : All stock >= 0
    PARTIAL  : One component negative, sets still >= 0
    BACKLOG  : Sets < 0 (dispatched more than produced)


WEIGHT CALCULATION
------------------
  Each product code maps to: coverKg, frameKg, setKg

  Production weight:
    Total = (covers x coverKg) + (frames x frameKg)
    Set weight = sets x setKg

  Dispatch weight:
    Total = (sets x setKg) + (extra covers x coverKg) + (extra frames x frameKg)
    Where extra = dispatched quantity - matched sets


GOOGLE SHEETS SYNC SETUP
-------------------------
  1. Open Google Sheets > Extensions > Apps Script
  2. Paste code from google-apps-script/Code.gs
  3. Deploy as Web App:
       Execute as: Me
       Access: Anyone
  4. Copy deployment URL to VITE_SHEETS_WEBHOOK_URL in .env.local
  5. Three sheets are auto-created: Production, Finishing, Dispatch


AUTHENTICATION
--------------
  - JWT-based auth with access + refresh tokens
  - 7 user roles with route-level access control
  - DEV PREVIEW mode (VITE_DEV_PREVIEW=true) bypasses auth for development
  - Set VITE_DEV_PREVIEW=false for production deployment


AVAILABLE SCRIPTS
-----------------
  npm run dev       Start development server (port 5173)
  npm run build     Type-check + production build to dist/
  npm run preview   Preview production build locally


CUSTOMIZATION (FOR TEMPLATE BUYERS)
------------------------------------
  This project is designed as a reusable template:

  1. Product Catalog: Edit src/dashboards/production/productCatalog.ts
     - Change product types, sizes, capacities to match your industry
     - Update weight entries for accurate calculations

  2. Branding: Edit tailwind.config.cjs
     - Change color scheme (currently amber accent on dark theme)
     - Modify fonts in src/index.css

  3. Roles: Edit src/auth/roleGuard.ts
     - Add/remove roles and route permissions

  4. Dashboards: Each tab in src/dashboards/production/ is self-contained
     - Add new tabs in ProductionDashboard.tsx
     - Create new dashboard folders under src/dashboards/

  5. Database: Run migrations in supabase/migrations/ in order
     - Add new tables by creating new migration files


LICENSE
-------
  Proprietary. All rights reserved.
  Contact the author for licensing and template purchase inquiries.


================================================================================
