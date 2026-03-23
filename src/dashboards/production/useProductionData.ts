// Shared state + Supabase persistence for the production dashboard.
// All data is fetched from Supabase on mount.
// CRUD operations: optimistic local update → async Supabase write → rollback on error.
// Production / Finishing / Dispatch inserts also fire Google Sheets sync.

import { useState, useMemo, useCallback, useEffect } from 'react';
import {
  getWeights, getItemFromCode, getSizeFromCode, getCapacityFromCode,
  getCategoryFromCode, calcRawWeight, getEntryFromCode, PRODUCT_TYPES, PRODUCT_SIZES,
  PRODUCT_CAPACITIES, RAW_MATERIALS, ProductType, ProductSize, ProductCapacity,
} from './productCatalog';
import { supabase } from '../../lib/supabase';
import { syncProduction, syncDispatch } from '../../lib/sheetsSync';

// ─── TYPES ────────────────────────────────────────────────────────────────────

export interface ProductionEntry {
  id: string;
  date: string;
  code: string;
  item: string;
  size: string;
  capacity: string;
  coverQty: number;
  frameQty: number;
  setQty: number;
  extraCover: number;
  extraFrame: number;
  coverKg: number;
  frameKg: number;
  setKg: number;
  setWeightKg: number;
  totalWeightKg: number;
}

export interface DispatchEntry {
  id: string;
  date: string;
  code: string;
  item: string;
  size: string;
  capacity: string;
  color: string;
  coverDispatched: number;
  frameDispatched: number;
  setDispatched: number;
  coverKg: number;
  frameKg: number;
  totalWeightKg: number;
  // order/logistics metadata
  orderNo: string;
  salesRef: string;
  client: string;
  orderDate: string;
  targetDate: string;
  chalanNo: string;
  actualDate: string;
  vehicleNumber: string;
  dispatchStatus: 'Before Time' | 'On Time' | 'Delayed' | '';
}

export interface RawMaterialEntry {
  id: string;
  date: string;
  material: string;
  category: 'INWARD' | 'OUTWARD';
  department: 'PRODUCTION' | 'FINISHING';
  unit: string;
  qty: number;
  weightT: number;
}

export interface StockPosition {
  code: string;
  item: string;
  size: string;
  capacity: string;
  category: string;
  producedCover: number;
  producedFrame: number;
  dispatchedCover: number;
  dispatchedFrame: number;
  stockCover: number;
  stockFrame: number;
  stockSet: number;
  status: 'OK' | 'PARTIAL' | 'BACKLOG';
}

export interface Toast {
  id: string;
  type: 'error' | 'success' | 'warn';
  message: string;
}

export type FilterPeriod = 'today' | '7d' | 'month' | 'custom';

export interface DateFilter {
  period: FilterPeriod;
  from: string;
  to: string;
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function genTempId(): string {
  return crypto.randomUUID();
}

function toISO(ddmmyyyy: string): string {
  const [d, m, y] = ddmmyyyy.split('/');
  return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}

export function todayISO(): string {
  return new Date().toISOString().split('T')[0];
}

function monthStart(iso: string): string {
  return iso.substring(0, 7) + '-01';
}

function filterByPeriod(entries: { date: string }[], filter: DateFilter): typeof entries {
  const today = todayISO();
  let from: string, to: string;
  if (filter.period === 'today')       { from = today; to = today; }
  else if (filter.period === '7d')     { from = new Date(Date.now() - 6 * 86400000).toISOString().split('T')[0]; to = today; }
  else if (filter.period === 'month')  { from = monthStart(today); to = today; }
  else                                 { from = filter.from; to = filter.to; }
  return entries.filter(e => e.date >= from && e.date <= to);
}

function buildProductionEntry(
  id: string, date: string, code: string, coverQty: number, frameQty: number
): ProductionEntry {
  const weights = getWeights(code);
  const coverKg = weights?.coverKg ?? 0;
  const frameKg = weights?.frameKg ?? 0;
  const setKg   = weights?.setKg ?? 0;
  const setQty  = Math.min(coverQty, frameQty);
  return {
    id, date, code,
    item: getItemFromCode(code),
    size: getSizeFromCode(code),
    capacity: getCapacityFromCode(code),
    coverQty, frameQty,
    setQty,
    extraCover: coverQty - setQty,
    extraFrame: frameQty - setQty,
    coverKg, frameKg, setKg,
    setWeightKg: setQty * setKg,
    totalWeightKg: (coverQty * coverKg) + (frameQty * frameKg),
  };
}

interface DispatchMeta {
  orderNo?: string; salesRef?: string; client?: string;
  orderDate?: string; targetDate?: string; chalanNo?: string;
  actualDate?: string; vehicleNumber?: string;
}

function calcDispatchStatus(actualDate: string, targetDate: string): DispatchEntry['dispatchStatus'] {
  if (!actualDate || !targetDate) return '';
  if (actualDate < targetDate) return 'Before Time';
  if (actualDate === targetDate) return 'On Time';
  return 'Delayed';
}

function buildDispatchEntry(
  id: string, date: string, code: string, color: string, coverDispatched: number, frameDispatched: number,
  setDispatched?: number,
  meta: DispatchMeta = {}
): DispatchEntry {
  const weights = getWeights(code);
  const coverKg = weights?.coverKg ?? 0;
  const frameKg = weights?.frameKg ?? 0;
  const setKg   = weights?.setKg ?? 0;
  const sets = setDispatched ?? Math.min(coverDispatched, frameDispatched);
  // Weight = sets × setKg for matched sets, plus leftover individual pieces
  const extraCovers = coverDispatched - sets;
  const extraFrames = frameDispatched - sets;
  const totalWeightKg = (sets * setKg) + (extraCovers * coverKg) + (extraFrames * frameKg);
  return {
    id, date, code, color,
    item: getItemFromCode(code),
    size: getSizeFromCode(code),
    capacity: getCapacityFromCode(code),
    coverDispatched, frameDispatched,
    setDispatched: sets,
    coverKg, frameKg,
    totalWeightKg,
    orderNo: meta.orderNo ?? '',
    salesRef: meta.salesRef ?? '',
    client: meta.client ?? '',
    orderDate: meta.orderDate ?? '',
    targetDate: meta.targetDate ?? '',
    chalanNo: meta.chalanNo ?? '',
    actualDate: meta.actualDate ?? '',
    vehicleNumber: meta.vehicleNumber ?? '',
    dispatchStatus: calcDispatchStatus(meta.actualDate ?? '', meta.targetDate ?? ''),
  };
}

// ─── MAIN HOOK ────────────────────────────────────────────────────────────────

export function useProductionData() {
  const [productionData,   setProductionData]   = useState<ProductionEntry[]>([]);
  const [dispatchData,     setDispatchData]      = useState<DispatchEntry[]>([]);
  const [rawMaterialData,  setRawMaterialData]   = useState<RawMaterialEntry[]>([]);

  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  // Toast notifications for CRUD feedback
  const [toasts, setToasts] = useState<Toast[]>([]);
  const addToast = useCallback((type: Toast['type'], message: string) => {
    const id = crypto.randomUUID();
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }, []);
  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Extensible catalogs (in-memory; persisting to DB is a future task)
  const [productTypes, setProductTypes] = useState<ProductType[]>(PRODUCT_TYPES);
  const [productSizes, setProductSizes] = useState<ProductSize[]>(PRODUCT_SIZES);
  const [capacities,   setCapacities]   = useState<ProductCapacity[]>(PRODUCT_CAPACITIES);

  // Filters
  const [prodFilter, setProdFilter] = useState<DateFilter>({ period: 'month', from: '', to: '' });
  const [dispFilter, setDispFilter] = useState<DateFilter>({ period: 'month', from: '', to: '' });

  // ── Initial data fetch ────────────────────────────────────────────────────
  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      setError(null);

      const [prodRes, dispRes, rmRes] = await Promise.all([
        supabase.from('production_entries').select('*').order('date', { ascending: false }),
        supabase.from('dispatch_entries').select('*').order('date', { ascending: false }),
        supabase.from('raw_material_entries').select('*').order('date', { ascending: false }),
      ]);

      if (prodRes.error || dispRes.error || rmRes.error) {
        const msg = prodRes.error?.message ?? dispRes.error?.message ?? rmRes.error?.message ?? 'Unknown error';
        setError(`Failed to load data: ${msg}`);
        setLoading(false);
        return;
      }

      setProductionData(
        (prodRes.data ?? []).map(r =>
          buildProductionEntry(r.id, r.date, r.code, r.cover_qty, r.frame_qty)
        )
      );

      setDispatchData(
        (dispRes.data ?? []).map(r =>
          buildDispatchEntry(r.id, r.date, r.code, r.color, r.cover_dispatched, r.frame_dispatched, r.set_dispatched ?? undefined, {
            orderNo: r.order_no ?? '', salesRef: r.sales_ref ?? '', client: r.client ?? '',
            orderDate: r.order_date ?? '', targetDate: r.target_date ?? '', chalanNo: r.chalan_no ?? '',
            actualDate: r.actual_date ?? '', vehicleNumber: r.vehicle_number ?? '',
          })
        )
      );

      setRawMaterialData(
        (rmRes.data ?? []).map(r => ({
          id:         r.id,
          date:       r.date,
          material:   r.material,
          category:   r.category as 'INWARD' | 'OUTWARD',
          department: r.department as 'PRODUCTION' | 'FINISHING',
          unit:       r.unit,
          qty:        Number(r.qty),
          weightT:    calcRawWeight(r.material, Number(r.qty)),
        }))
      );

      setLoading(false);
    }

    fetchAll();
  }, []);

  // ── Filtered slices ───────────────────────────────────────────────────────
  const filteredProd = useMemo(() => filterByPeriod(productionData, prodFilter) as ProductionEntry[], [productionData, prodFilter]);
  const filteredDisp = useMemo(() => filterByPeriod(dispatchData,   dispFilter) as DispatchEntry[],   [dispatchData,   dispFilter]);

  // ── Stock positions (real-time, always cumulative) ────────────────────────
  // Stock = production − dispatched, tracked per product code
  const stockPositions = useMemo((): StockPosition[] => {
    const map = new Map<string, StockPosition>();

    function getOrCreate(code: string, item: string, size: string, capacity: string) {
      if (!map.has(code)) {
        map.set(code, {
          code, item, size, capacity,
          category: getCategoryFromCode(code),
          producedCover: 0, producedFrame: 0,
          dispatchedCover: 0, dispatchedFrame: 0,
          stockCover: 0, stockFrame: 0, stockSet: 0, status: 'OK',
        });
      }
      return map.get(code)!;
    }

    productionData.forEach(e => {
      const p = getOrCreate(e.code, e.item, e.size, e.capacity);
      p.producedCover += e.coverQty;
      p.producedFrame += e.frameQty;
    });

    dispatchData.forEach(e => {
      const p = getOrCreate(e.code, e.item, e.size, e.capacity);
      p.dispatchedCover += e.coverDispatched;
      p.dispatchedFrame += e.frameDispatched;
    });

    map.forEach(p => {
      p.stockCover = p.producedCover - p.dispatchedCover;
      p.stockFrame = p.producedFrame - p.dispatchedFrame;
      p.stockSet   = Math.min(p.stockCover, p.stockFrame);
      p.status = p.stockSet < 0 ? 'BACKLOG' : (p.stockCover < 0 || p.stockFrame < 0) ? 'PARTIAL' : 'OK';
    });

    return Array.from(map.values()).sort((a, b) => a.code.localeCompare(b.code));
  }, [productionData, dispatchData]);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const getStock = useCallback((code: string) =>
    stockPositions.find(s => s.code === code),
  [stockPositions]);

  // ── CRUD: Production ──────────────────────────────────────────────────────
  const addProduction = useCallback(async (date: string, code: string, cover: number, frame: number) => {
    const tempId = genTempId();
    const entry  = buildProductionEntry(tempId, date, code, cover, frame);
    setProductionData(prev => [entry, ...prev]);

    const { data, error: err } = await supabase
      .from('production_entries')
      .insert({ date, code, cover_qty: cover, frame_qty: frame })
      .select()
      .single();

    if (err || !data) {
      setProductionData(prev => prev.filter(e => e.id !== tempId));
      addToast('error', `Failed to save production entry: ${err?.message ?? 'unknown error'}`);
      return;
    }

    const realEntry = buildProductionEntry(data.id, data.date, data.code, data.cover_qty, data.frame_qty);
    setProductionData(prev => prev.map(e => e.id === tempId ? realEntry : e));

    syncProduction(
      date, code, cover, frame,
      realEntry.setQty, realEntry.coverKg, realEntry.frameKg, realEntry.totalWeightKg,
    );
  }, [addToast]);

  const updateProduction = useCallback(async (id: string, date: string, code: string, cover: number, frame: number) => {
    const newEntry = buildProductionEntry(id, date, code, cover, frame);
    setProductionData(prev => prev.map(e => e.id === id ? newEntry : e));

    const { error: err } = await supabase
      .from('production_entries')
      .update({ date, code, cover_qty: cover, frame_qty: frame })
      .eq('id', id);

    if (err) {
      addToast('error', `Failed to update production entry: ${err.message}`);
      // Re-fetch to restore correct state
      const { data } = await supabase.from('production_entries').select('*').eq('id', id).single();
      if (data) {
        setProductionData(prev => prev.map(e =>
          e.id === id ? buildProductionEntry(data.id, data.date, data.code, data.cover_qty, data.frame_qty) : e
        ));
      }
    }
  }, [addToast]);

  const deleteProduction = useCallback(async (id: string) => {
    const backup = productionData.find(e => e.id === id);
    setProductionData(prev => prev.filter(e => e.id !== id));
    const { error: err } = await supabase.from('production_entries').delete().eq('id', id);
    if (err) {
      addToast('error', `Failed to delete production entry: ${err.message}`);
      if (backup) setProductionData(prev => [backup, ...prev]);
    }
  }, [productionData, addToast]);

  // ── CRUD: Dispatch ────────────────────────────────────────────────────────
  const addDispatch = useCallback(async (date: string, code: string, color: string, cd: number, fd: number, sd?: number, meta: DispatchMeta = {}) => {
    const tempId = genTempId();
    const entry  = buildDispatchEntry(tempId, date, code, color, cd, fd, sd, meta);
    setDispatchData(prev => [entry, ...prev]);

    const { data, error: err } = await supabase
      .from('dispatch_entries')
      .insert({
        date, code, color, cover_dispatched: cd, frame_dispatched: fd, set_dispatched: entry.setDispatched,
        order_no: meta.orderNo || null, sales_ref: meta.salesRef || null, client: meta.client || null,
        order_date: meta.orderDate || null, target_date: meta.targetDate || null, chalan_no: meta.chalanNo || null,
        actual_date: meta.actualDate || null, vehicle_number: meta.vehicleNumber || null,
      })
      .select()
      .single();

    if (err || !data) {
      setDispatchData(prev => prev.filter(e => e.id !== tempId));
      addToast('error', `Failed to save dispatch entry: ${err?.message ?? 'unknown error'}`);
      return;
    }

    const realEntry = buildDispatchEntry(data.id, data.date, data.code, data.color, data.cover_dispatched, data.frame_dispatched, data.set_dispatched ?? undefined, {
      orderNo: data.order_no ?? '', salesRef: data.sales_ref ?? '', client: data.client ?? '',
      orderDate: data.order_date ?? '', targetDate: data.target_date ?? '', chalanNo: data.chalan_no ?? '',
      actualDate: data.actual_date ?? '', vehicleNumber: data.vehicle_number ?? '',
    });
    setDispatchData(prev => prev.map(e => e.id === tempId ? realEntry : e));

    syncDispatch(
      date, code, color, cd, fd, realEntry.setDispatched,
      realEntry.coverKg, realEntry.frameKg, realEntry.totalWeightKg,
    );
  }, [addToast]);

  const updateDispatch = useCallback(async (id: string, date: string, code: string, color: string, cd: number, fd: number, sd?: number, meta: DispatchMeta = {}) => {
    const backup = dispatchData.find(e => e.id === id);
    const newEntry = buildDispatchEntry(id, date, code, color, cd, fd, sd, meta);
    setDispatchData(prev => prev.map(e => e.id === id ? newEntry : e));

    const { error: err } = await supabase
      .from('dispatch_entries')
      .update({
        date, code, color, cover_dispatched: cd, frame_dispatched: fd, set_dispatched: newEntry.setDispatched,
        order_no: meta.orderNo || null, sales_ref: meta.salesRef || null, client: meta.client || null,
        order_date: meta.orderDate || null, target_date: meta.targetDate || null, chalan_no: meta.chalanNo || null,
        actual_date: meta.actualDate || null, vehicle_number: meta.vehicleNumber || null,
      })
      .eq('id', id);

    if (err) {
      addToast('error', `Failed to update dispatch entry: ${err.message}`);
      if (backup) setDispatchData(prev => prev.map(e => e.id === id ? backup : e));
    }
  }, [dispatchData, addToast]);

  const deleteDispatch = useCallback(async (id: string) => {
    const backup = dispatchData.find(e => e.id === id);
    setDispatchData(prev => prev.filter(e => e.id !== id));
    const { error: err } = await supabase.from('dispatch_entries').delete().eq('id', id);
    if (err) {
      addToast('error', `Failed to delete dispatch entry: ${err.message}`);
      if (backup) setDispatchData(prev => [backup, ...prev]);
    }
  }, [dispatchData, addToast]);

  // ── CRUD: Raw Material ────────────────────────────────────────────────────
  const addRawMaterial = useCallback(async (
    date: string, material: string, category: 'INWARD' | 'OUTWARD',
    department: 'PRODUCTION' | 'FINISHING', unit: string, qty: number,
  ) => {
    const tempId = genTempId();
    const entry: RawMaterialEntry = {
      id: tempId, date, material, category, department, unit, qty,
      weightT: calcRawWeight(material, qty),
    };
    setRawMaterialData(prev => [entry, ...prev]);

    const { data, error: err } = await supabase
      .from('raw_material_entries')
      .insert({ date, material, category, department, unit, qty })
      .select()
      .single();

    if (err || !data) {
      setRawMaterialData(prev => prev.filter(e => e.id !== tempId));
      addToast('error', `Failed to save raw material entry: ${err?.message ?? 'unknown error'}`);
      return;
    }

    setRawMaterialData(prev => prev.map(e =>
      e.id === tempId
        ? { id: data.id, date: data.date, material: data.material, category: data.category, department: data.department, unit: data.unit, qty: Number(data.qty), weightT: calcRawWeight(data.material, Number(data.qty)) }
        : e
    ));
  }, [addToast]);

  const deleteRawMaterial = useCallback(async (id: string) => {
    const backup = rawMaterialData.find(e => e.id === id);
    setRawMaterialData(prev => prev.filter(e => e.id !== id));
    const { error: err } = await supabase.from('raw_material_entries').delete().eq('id', id);
    if (err) {
      addToast('error', `Failed to delete raw material entry: ${err.message}`);
      if (backup) setRawMaterialData(prev => [backup, ...prev]);
    }
  }, [rawMaterialData, addToast]);

  // ── CSV Import ────────────────────────────────────────────────────────────
  const importProductionCSV = useCallback((csv: string) => {
    const lines = csv.trim().split('\n').slice(1);
    let imported = 0; const skipped: string[] = [];
    lines.forEach((line, i) => {
      const [date, code, coverStr, frameStr] = line.split(',').map(s => s.trim());
      if (!date || !code || !coverStr || !frameStr) { skipped.push(`Row ${i + 2}: missing fields`); return; }
      const isoDate = date.includes('/') ? toISO(date) : date;
      if (!/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) { skipped.push(`Row ${i + 2}: invalid date "${date}"`); return; }
      if (!getEntryFromCode(code)) { skipped.push(`Row ${i + 2}: unknown product code "${code}"`); return; }
      const cover = parseInt(coverStr); const frame = parseInt(frameStr);
      if (isNaN(cover) || isNaN(frame)) { skipped.push(`Row ${i + 2}: invalid numbers`); return; }
      if (cover < 0 || frame < 0) { skipped.push(`Row ${i + 2}: negative quantities`); return; }
      addProduction(isoDate, code, cover, frame);
      imported++;
    });
    return { imported, skipped };
  }, [addProduction]);

  const importDispatchCSV = useCallback((csv: string) => {
    const lines = csv.trim().split('\n').slice(1);
    let imported = 0; const skipped: string[] = [];
    lines.forEach((line, i) => {
      const [date, code, color, cdStr, fdStr] = line.split(',').map(s => s.trim());
      if (!date || !code || !cdStr || !fdStr) { skipped.push(`Row ${i + 2}: missing fields`); return; }
      const isoDate = date.includes('/') ? toISO(date) : date;
      if (!/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) { skipped.push(`Row ${i + 2}: invalid date "${date}"`); return; }
      if (!getEntryFromCode(code)) { skipped.push(`Row ${i + 2}: unknown product code "${code}"`); return; }
      const cd = parseInt(cdStr); const fd = parseInt(fdStr);
      if (isNaN(cd) || isNaN(fd)) { skipped.push(`Row ${i + 2}: invalid numbers`); return; }
      if (cd < 0 || fd < 0) { skipped.push(`Row ${i + 2}: negative quantities`); return; }
      addDispatch(isoDate, code, (color || 'GREY').toUpperCase(), cd, fd);
      imported++;
    });
    return { imported, skipped };
  }, [addDispatch]);

  const importRawMaterialCSV = useCallback((csv: string) => {
    const lines = csv.trim().split('\n').slice(1);
    let imported = 0; const skipped: string[] = [];
    const validCategories = ['INWARD', 'OUTWARD'];
    const validDepts = ['PRODUCTION', 'FINISHING'];
    lines.forEach((line, i) => {
      const [date, material, category, department, unit, qtyStr] = line.split(',').map(s => s.trim());
      if (!date || !material || !category || !department || !unit || !qtyStr) {
        skipped.push(`Row ${i + 2}: missing fields`); return;
      }
      const isoDate = date.includes('/') ? toISO(date) : date;
      if (!/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) { skipped.push(`Row ${i + 2}: invalid date "${date}"`); return; }
      const catUpper = category.toUpperCase();
      const deptUpper = department.toUpperCase();
      if (!validCategories.includes(catUpper)) { skipped.push(`Row ${i + 2}: invalid category "${category}"`); return; }
      if (!validDepts.includes(deptUpper)) { skipped.push(`Row ${i + 2}: invalid department "${department}"`); return; }
      const qty = parseFloat(qtyStr);
      if (isNaN(qty) || qty < 0) { skipped.push(`Row ${i + 2}: invalid qty`); return; }
      addRawMaterial(isoDate, material, catUpper as 'INWARD' | 'OUTWARD', deptUpper as 'PRODUCTION' | 'FINISHING', unit, qty);
      imported++;
    });
    return { imported, skipped };
  }, [addRawMaterial]);

  // ── Settings ──────────────────────────────────────────────────────────────
  const addProductType  = useCallback((t: ProductType)     => setProductTypes(prev => [...prev, t]), []);
  const addProductSize  = useCallback((s: ProductSize)     => setProductSizes(prev => [...prev, s]), []);
  const addCapacity     = useCallback((c: ProductCapacity) => setCapacities(prev => [...prev, c]),   []);

  return {
    // Status
    loading, error, toasts, dismissToast,
    // Data
    productionData, dispatchData, rawMaterialData,
    filteredProd, filteredDisp,
    stockPositions,
    // Filters
    prodFilter, setProdFilter,
    dispFilter, setDispFilter,
    // Catalog
    productTypes, productSizes, capacities,
    addProductType, addProductSize, addCapacity,
    // Helpers
    getStock,
    // CRUD
    addProduction, updateProduction, deleteProduction,
    addDispatch,   updateDispatch,   deleteDispatch,
    addRawMaterial, deleteRawMaterial,
    // CSV
    importProductionCSV, importDispatchCSV, importRawMaterialCSV,
    // Utils
    formatDate, todayISO,
  };
}

export type ProductionDataContext = ReturnType<typeof useProductionData>;
