// Stock Tab: real-time stock positions per product code
// Stock = produced − dispatched

import { useState, useMemo } from 'react';
import { useData } from './ProductionDashboard';
import { PRODUCT_TYPES } from './productCatalog';
import type { StockPosition } from './useProductionData';

function fmt(n: number) { return n.toLocaleString(); }

const S = {
  card:  'bg-[#1a1f2e] border border-[#2a2f3e] rounded-lg p-4',
  label: 'text-xs text-gray-400 font-mono uppercase tracking-wide mb-1',
  val:   'text-2xl font-bold font-mono text-white',
  sub:   'text-xs text-gray-500 mt-0.5',
  input: 'w-full bg-[#0f1117] border border-[#2a2f3e] rounded px-3 py-1.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-amber-500',
  th:    'text-left text-xs text-gray-400 font-mono uppercase px-3 py-2 border-b border-[#2a2f3e]',
  td:    'px-3 py-2 text-sm',
};

function StatusBadge({ status }: { status: StockPosition['status'] }) {
  const cfg = {
    BACKLOG: { label: 'BACKLOG', color: '#f87171', bg: '#450a0a40' },
    PARTIAL: { label: 'PARTIAL', color: '#fb923c', bg: '#43160840' },
    OK:      { label: 'OK',      color: '#4ade80', bg: '#05260840' },
  }[status];
  return (
    <span className="text-xs font-mono px-2 py-0.5 rounded" style={{ color: cfg.color, background: cfg.bg }}>
      {cfg.label}
    </span>
  );
}

type SortCol = 'code' | 'stockSet' | 'stockCover' | 'stockFrame' | 'producedCover';

export function StockTab() {
  const { stockPositions, productSizes, capacities } = useData();

  const [search, setSearch]             = useState('');
  const [filterType, setFilterType]     = useState('all');
  const [filterStatus, setFilterStatus] = useState<StockPosition['status'] | 'all'>('all');
  const [filterCat, setFilterCat]       = useState<'all' | 'commercial' | 'regular'>('all');
  const [filterSize, setFilterSize]     = useState('all');
  const [filterCap, setFilterCap]       = useState('all');
  const [sortBy, setSortBy]             = useState<SortCol>('stockSet');
  const [sortAsc, setSortAsc]           = useState(true);

  const totalStockSets  = stockPositions.reduce((a, s) => a + Math.max(s.stockSet, 0), 0);
  const totalProduced   = stockPositions.reduce((a, s) => a + s.producedCover, 0);
  const totalDispatched = stockPositions.reduce((a, s) => a + s.dispatchedCover, 0);
  const backlogCount    = stockPositions.filter(s => s.status === 'BACKLOG').length;
  const partialCount    = stockPositions.filter(s => s.status === 'PARTIAL').length;

  const filtered = useMemo(() => {
    let list = [...stockPositions];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(s => s.code.toLowerCase().includes(q) || s.item.toLowerCase().includes(q));
    }
    if (filterType !== 'all') {
      const prefix = PRODUCT_TYPES.find(t => t.code === filterType)?.prefix ?? '';
      list = list.filter(s => s.code.startsWith(prefix));
    }
    if (filterStatus !== 'all') list = list.filter(s => s.status === filterStatus);
    if (filterCat !== 'all')    list = list.filter(s => s.category === filterCat);
    if (filterSize !== 'all')   list = list.filter(s => s.size === filterSize);
    if (filterCap !== 'all')    list = list.filter(s => s.capacity === filterCap);
    list.sort((a, b) => {
      const diff =
        sortBy === 'code'          ? a.code.localeCompare(b.code) :
        sortBy === 'stockSet'      ? a.stockSet - b.stockSet :
        sortBy === 'stockCover'    ? a.stockCover - b.stockCover :
        sortBy === 'stockFrame'    ? a.stockFrame - b.stockFrame :
        a.producedCover - b.producedCover;
      return sortAsc ? diff : -diff;
    });
    return list;
  }, [stockPositions, search, filterType, filterStatus, filterCat, filterSize, filterCap, sortBy, sortAsc]);

  function toggleSort(col: SortCol) {
    if (sortBy === col) setSortAsc(a => !a); else { setSortBy(col); setSortAsc(true); }
  }
  function SortIcon({ col }: { col: SortCol }) {
    if (sortBy !== col) return <span className="text-gray-600 ml-1">↕</span>;
    return <span className="text-amber-400 ml-1">{sortAsc ? '↑' : '↓'}</span>;
  }

  return (
    <div className="space-y-5">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className={S.card}>
          <div className={S.label}>Stock (sets)</div>
          <div className={S.val}>{fmt(totalStockSets)}</div>
          <div className={S.sub}>{stockPositions.length} codes tracked</div>
        </div>
        <div className={S.card}>
          <div className={S.label}>Produced (covers)</div>
          <div className={`${S.val} text-amber-400`}>{fmt(totalProduced)}</div>
        </div>
        <div className={S.card}>
          <div className={S.label}>Dispatched (covers)</div>
          <div className={`${S.val} text-blue-400`}>{fmt(totalDispatched)}</div>
        </div>
        <div className={S.card}>
          <div className={S.label}>Problem Codes</div>
          <div className={`${S.val} ${backlogCount + partialCount > 0 ? 'text-red-400' : 'text-green-400'}`}>
            {backlogCount + partialCount}
          </div>
          <div className={S.sub}>{backlogCount} backlog · {partialCount} partial</div>
        </div>
      </div>

      {/* Category summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(['commercial', 'regular'] as const).map(cat => {
          const items = stockPositions.filter(s => s.category === cat);
          const sets  = items.reduce((a, s) => a + Math.max(s.stockSet, 0), 0);
          const bl    = items.filter(s => s.status === 'BACKLOG').length;
          return (
            <div key={cat} className={S.card}>
              <div className={S.label}>{cat} stock</div>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-mono font-bold text-white">{fmt(sets)}</span>
                <span className="text-sm text-gray-400 mb-0.5">sets</span>
              </div>
              {bl > 0 && <div className="text-xs text-red-400 font-mono mt-1">{bl} code(s) in backlog</div>}
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="bg-[#1a1f2e] border border-[#2a2f3e] rounded-lg p-4 flex flex-wrap gap-2 items-center">
        <input className={`${S.input} max-w-xs text-xs`} placeholder="Search code or item..."
          value={search} onChange={e => setSearch(e.target.value)} />
        <select className={`${S.input} w-auto text-xs`} value={filterType} onChange={e => setFilterType(e.target.value)}>
          <option value="all">All Types</option>
          {PRODUCT_TYPES.map(t => <option key={t.code} value={t.code}>{t.label}</option>)}
        </select>
        <select className={`${S.input} w-auto text-xs`} value={filterCat} onChange={e => setFilterCat(e.target.value as typeof filterCat)}>
          <option value="all">All Categories</option>
          <option value="commercial">Commercial</option>
          <option value="regular">Regular</option>
        </select>
        <select className={`${S.input} w-auto text-xs`} value={filterStatus} onChange={e => setFilterStatus(e.target.value as typeof filterStatus)}>
          <option value="all">All Status</option>
          <option value="OK">OK</option>
          <option value="PARTIAL">Partial</option>
          <option value="BACKLOG">Backlog</option>
        </select>
        <select className={`${S.input} w-auto text-xs`} value={filterSize} onChange={e => setFilterSize(e.target.value)}>
          <option value="all">All Sizes</option>
          {productSizes.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
        <select className={`${S.input} w-auto text-xs`} value={filterCap} onChange={e => setFilterCap(e.target.value)}>
          <option value="all">All Capacities</option>
          {capacities.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
        <span className="text-xs text-gray-500 font-mono ml-auto">{filtered.length} / {stockPositions.length} codes</span>
      </div>

      {/* Table */}
      <div className={S.card}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className={`${S.th} cursor-pointer`} onClick={() => toggleSort('code')}>Code <SortIcon col="code" /></th>
                <th className={S.th}>Item</th>
                <th className={S.th}>Size</th>
                <th className={S.th}>Cap.</th>
                <th className={S.th}>Cat.</th>
                <th className={`${S.th} cursor-pointer`} onClick={() => toggleSort('producedCover')}>Produced C/F <SortIcon col="producedCover" /></th>
                <th className={S.th}>Dispatched C/F</th>
                <th className={`${S.th} cursor-pointer`} onClick={() => toggleSort('stockCover')}>Cover Stock <SortIcon col="stockCover" /></th>
                <th className={`${S.th} cursor-pointer`} onClick={() => toggleSort('stockFrame')}>Frame Stock <SortIcon col="stockFrame" /></th>
                <th className={`${S.th} cursor-pointer`} onClick={() => toggleSort('stockSet')}>Sets <SortIcon col="stockSet" /></th>
                <th className={S.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={11} className="px-3 py-8 text-center text-gray-500">No stock positions</td></tr>
              )}
              {filtered.map(s => {
                const coverColor = s.stockCover < 0 ? '#f87171' : s.stockCover === 0 ? '#fb923c' : '#4ade80';
                const frameColor = s.stockFrame < 0 ? '#f87171' : s.stockFrame === 0 ? '#fb923c' : '#4ade80';
                const setColor   = s.stockSet < 0   ? '#f87171' : s.stockSet === 0   ? '#fb923c' : s.stockSet <= 5 ? '#fbbf24' : '#4ade80';
                return (
                  <tr key={s.code} className={`border-b border-[#1e2436] hover:bg-[#1e2436]/40 ${s.status === 'BACKLOG' ? 'bg-red-950/10' : ''}`}>
                    <td className={`${S.td} font-mono text-white`}>{s.code}</td>
                    <td className={`${S.td} text-gray-300`}>{s.item}</td>
                    <td className={`${S.td} font-mono text-gray-400`}>{s.size}</td>
                    <td className={`${S.td} font-mono text-gray-400`}>{s.capacity}</td>
                    <td className={S.td}>
                      <span className={`px-1.5 py-0.5 rounded text-xs font-mono ${s.category === 'commercial' ? 'bg-blue-900/40 text-blue-300' : 'bg-green-900/40 text-green-300'}`}>
                        {s.category === 'commercial' ? 'COM' : 'REG'}
                      </span>
                    </td>
                    <td className={`${S.td} font-mono text-amber-400`}>{s.producedCover}/{s.producedFrame}</td>
                    <td className={`${S.td} font-mono text-blue-400`}>{s.dispatchedCover}/{s.dispatchedFrame}</td>
                    <td className={`${S.td} font-mono font-bold`} style={{ color: coverColor }}>{s.stockCover}</td>
                    <td className={`${S.td} font-mono font-bold`} style={{ color: frameColor }}>{s.stockFrame}</td>
                    <td className={`${S.td} font-mono font-bold text-lg`} style={{ color: setColor }}>{s.stockSet}</td>
                    <td className={S.td}><StatusBadge status={s.status} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
