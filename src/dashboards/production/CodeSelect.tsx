// Shared product code dropdown used by Production, Finishing, and Dispatch forms.
// Groups codes by product type using <optgroup>.

import { PRODUCT_CATALOG, PRODUCT_TYPES } from './productCatalog';

interface CodeSelectProps {
  value: string;
  onChange: (code: string) => void;
  className?: string;
}

export function CodeSelect({ value, onChange, className }: CodeSelectProps) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className={className}
    >
      <option value="">— Select product code —</option>
      {PRODUCT_TYPES.map(pt => {
        const codes = PRODUCT_CATALOG.filter(p => pt.itemCodes.includes(p.item));
        if (codes.length === 0) return null;
        return (
          <optgroup key={pt.code} label={`${pt.code} — ${pt.label}`}>
            {codes.map(p => (
              <option key={p.code} value={p.code}>
                {p.code}
              </option>
            ))}
          </optgroup>
        );
      })}
    </select>
  );
}
