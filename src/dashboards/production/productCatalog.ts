// Product catalog: types, sizes, capacities, weights, raw material conversions

export type ItemCategory = 'commercial' | 'regular';
export type SizeCategory = 'commercial' | 'regular';

export interface ProductType {
  code: string;       // e.g. 'MHC'
  prefix: string;     // e.g. 'm_'  (kept for legacy use)
  itemCodes: string[]; // item values in ProductEntry that belong to this type
  label: string;
  category: ItemCategory;
  color: string;      // badge color
}

export interface ProductSize {
  value: string;
  label: string;
  category: SizeCategory;
}

export interface ProductCapacity {
  value: string;
  label: string;
}

export interface ProductWeight {
  code: string;
  coverKg: number;
  frameKg: number;
  setKg: number;
}

export interface ProductEntry {
  code: string;
  item: string;
  size: string;
  capacity: string;
  category: ItemCategory;
  coverKg: number;
  frameKg: number;
  setKg: number;
}

// ─── PRODUCT TYPES ────────────────────────────────────────────────────────────
export const PRODUCT_TYPES: ProductType[] = [
  { code: 'MHC',   prefix: 'm_',  itemCodes: ['MH'],         label: 'Manhole Cover',         category: 'commercial', color: '#60a5fa' },
  { code: 'EMHC',  prefix: 'e_',  itemCodes: ['EMHC'],       label: 'Extra Heavy MHC',       category: 'commercial', color: '#818cf8' },
  { code: 'ONGC',  prefix: 'o_',  itemCodes: ['ONGC'],       label: 'ONGC Cover',            category: 'commercial', color: '#fb923c' },
  { code: 'CGT',   prefix: 'c_',  itemCodes: ['CGT'],        label: 'CGT Cover',             category: 'commercial', color: '#f472b6' },
  { code: 'ROUND', prefix: 'R_',  itemCodes: ['ROUND'],      label: 'Round Cover',           category: 'commercial', color: '#a78bfa' },
  { code: 'DS',    prefix: 'D_',  itemCodes: ['DS'],         label: 'Double Seal Cover',     category: 'commercial', color: '#34d399' },
  { code: 'RCS',   prefix: 'r_',  itemCodes: ['RC', 'RCC'],  label: 'Road Cover Square',     category: 'regular',    color: '#4ade80' },
  { code: 'WGC',   prefix: 'w_',  itemCodes: ['WG'],         label: 'Wire Grating Cover',    category: 'regular',    color: '#2dd4bf' },
];

// ─── SIZES ────────────────────────────────────────────────────────────────────
export const PRODUCT_SIZES: ProductSize[] = [
  // Commercial inch sizes
  { value: '10*10',  label: '10×10 in',   category: 'commercial' },
  { value: '12*12',  label: '12×12 in',   category: 'commercial' },
  { value: '15*15',  label: '15×15 in',   category: 'commercial' },
  { value: '18*18',  label: '18×18 in',   category: 'commercial' },
  { value: '18*24',  label: '18×24 in',   category: 'commercial' },
  { value: '21*21',  label: '21×21 in',   category: 'commercial' },
  { value: '24*24',  label: '24×24 in',   category: 'commercial' },
  { value: '28*28',  label: '28×28 in',   category: 'commercial' },
  { value: '30*30',  label: '30×30 in',   category: 'commercial' },
  { value: '36*36',  label: '36×36 in',   category: 'commercial' },
  // DAI sizes
  { value: '600 DAI',  label: '600 DAI',   category: 'commercial' },
  { value: '700 DAI',  label: '700 DAI',   category: 'commercial' },
  { value: '800 DAI',  label: '800 DAI',   category: 'commercial' },
  { value: '900 DAI',  label: '900 DAI',   category: 'commercial' },
  // Regular mm sizes
  { value: '300x300',   label: '300×300 mm',   category: 'regular' },
  { value: '300x700',   label: '300×700 mm',   category: 'regular' },
  { value: '385x700',   label: '385×700 mm',   category: 'regular' },
  { value: '450x450',   label: '450×450 mm',   category: 'regular' },
  { value: '450x600',   label: '450×600 mm',   category: 'regular' },
  { value: '450x900',   label: '450×900 mm',   category: 'regular' },
  { value: '600x600',   label: '600×600 mm',   category: 'regular' },
  { value: '600x720',   label: '600×720 mm',   category: 'regular' },
  { value: '600x900',   label: '600×900 mm',   category: 'regular' },
  { value: '600x1000',  label: '600×1000 mm',  category: 'regular' },
  { value: '600x1200',  label: '600×1200 mm',  category: 'regular' },
  { value: '750x750',   label: '750×750 mm',   category: 'regular' },
  { value: '750x900',   label: '750×900 mm',   category: 'regular' },
  { value: '900x900',   label: '900×900 mm',   category: 'regular' },
  { value: '900x1200',  label: '900×1200 mm',  category: 'regular' },
  { value: '1000x1000', label: '1000×1000 mm', category: 'regular' },
  { value: '1200x1200', label: '1200×1200 mm', category: 'regular' },
  { value: '1500x1500', label: '1500×1500 mm', category: 'regular' },
  { value: '1600x1600', label: '1600×1600 mm', category: 'regular' },
  { value: '600 FRC',   label: '600 FRC',      category: 'regular' },
];

// ─── CAPACITIES ───────────────────────────────────────────────────────────────
export const PRODUCT_CAPACITIES: ProductCapacity[] = [
  { value: '2.5T',  label: '2.5T' },
  { value: '3T',    label: '3T' },
  { value: '5T',    label: '5T' },
  { value: '12.5T', label: '12.5T' },
  { value: '25T',   label: '25T' },
  { value: '30T',   label: '30T' },
  { value: '40T',   label: '40T' },
  { value: '60T',   label: '60T' },
  { value: '90T',   label: '90T' },
  { value: 'E600',  label: 'E600' },
  { value: 'F900',  label: 'F900' },
];

export const COLORS = ['GREY', 'BLACK', 'GREEN'] as const;
export type ProductColor = typeof COLORS[number];

// ─── PRODUCT CATALOG ──────────────────────────────────────────────────────────
// Full catalog with item, size, capacity, category, and weights for every code.
// setKg = coverKg + frameKg (some entries have only cover or only frame weight).

export const PRODUCT_CATALOG: ProductEntry[] = [

  // ── MH (Manhole Cover) — Inch sizes ─────────────────────────────────────────
  // Commercial: only m_12*12_5t, m_24*24_5t, m_28*28_5t, m_30*30_5t, m_36*36_5t
  { code: 'm_10*10_2.5t',  item: 'MH', size: '10*10',  capacity: '2.5T',  category: 'regular',    coverKg: 1.3,   frameKg: 0.9,   setKg: 2.2    },
  { code: 'm_10*10_3t',    item: 'MH', size: '10*10',  capacity: '3T',    category: 'regular',    coverKg: 1.3,   frameKg: 0.9,   setKg: 2.2    },
  { code: 'm_10*10_5t',    item: 'MH', size: '10*10',  capacity: '5T',    category: 'regular',    coverKg: 1.3,   frameKg: 0.9,   setKg: 2.2    },
  { code: 'm_12*12_2.5t',  item: 'MH', size: '12*12',  capacity: '2.5T',  category: 'regular',    coverKg: 1.85,  frameKg: 1.05,  setKg: 2.9    },
  { code: 'm_12*12_3t',    item: 'MH', size: '12*12',  capacity: '3T',    category: 'regular',    coverKg: 1.85,  frameKg: 1.05,  setKg: 2.9    },
  { code: 'm_12*12_5t',    item: 'MH', size: '12*12',  capacity: '5T',    category: 'commercial', coverKg: 1.85,  frameKg: 1.05,  setKg: 2.9    },
  { code: 'm_15*15_2.5t',  item: 'MH', size: '15*15',  capacity: '2.5T',  category: 'regular',    coverKg: 3.11,  frameKg: 1.67,  setKg: 4.78   },
  { code: 'm_15*15_5t',    item: 'MH', size: '15*15',  capacity: '5T',    category: 'regular',    coverKg: 3.11,  frameKg: 1.67,  setKg: 4.78   },
  { code: 'm_18*18_2.5t',  item: 'MH', size: '18*18',  capacity: '2.5T',  category: 'regular',    coverKg: 3.11,  frameKg: 1.67,  setKg: 4.78   },
  { code: 'm_18*18_3t',    item: 'MH', size: '18*18',  capacity: '3T',    category: 'regular',    coverKg: 3.11,  frameKg: 1.67,  setKg: 4.78   },
  { code: 'm_18*18_5t',    item: 'MH', size: '18*18',  capacity: '5T',    category: 'regular',    coverKg: 3.11,  frameKg: 1.67,  setKg: 4.78   },
  { code: 'm_18*24_2.5t',  item: 'MH', size: '18*24',  capacity: '2.5T',  category: 'regular',    coverKg: 6.23,  frameKg: 2.7,   setKg: 8.93   },
  { code: 'm_18*24_3t',    item: 'MH', size: '18*24',  capacity: '3T',    category: 'regular',    coverKg: 6.23,  frameKg: 2.7,   setKg: 8.93   },
  { code: 'm_18*24_5t',    item: 'MH', size: '18*24',  capacity: '5T',    category: 'regular',    coverKg: 6.23,  frameKg: 2.7,   setKg: 8.93   },
  { code: 'm_21*21_2.5t',  item: 'MH', size: '21*21',  capacity: '2.5T',  category: 'regular',    coverKg: 7.52,  frameKg: 3.29,  setKg: 10.81  },
  { code: 'm_21*21_3t',    item: 'MH', size: '21*21',  capacity: '3T',    category: 'regular',    coverKg: 7.52,  frameKg: 3.29,  setKg: 10.81  },
  { code: 'm_21*21_5t',    item: 'MH', size: '21*21',  capacity: '5T',    category: 'regular',    coverKg: 7.52,  frameKg: 3.29,  setKg: 10.81  },
  { code: 'm_24*24_2.5t',  item: 'MH', size: '24*24',  capacity: '2.5T',  category: 'regular',    coverKg: 9.6,   frameKg: 5.2,   setKg: 14.8   },
  { code: 'm_24*24_3t',    item: 'MH', size: '24*24',  capacity: '3T',    category: 'regular',    coverKg: 9.6,   frameKg: 5.2,   setKg: 14.8   },
  { code: 'm_24*24_5t',    item: 'MH', size: '24*24',  capacity: '5T',    category: 'commercial', coverKg: 9.6,   frameKg: 5.2,   setKg: 14.8   },
  { code: 'm_28*28_2.5t',  item: 'MH', size: '28*28',  capacity: '2.5T',  category: 'regular',    coverKg: 14.4,  frameKg: 4.67,  setKg: 19.07  },
  { code: 'm_28*28_3t',    item: 'MH', size: '28*28',  capacity: '3T',    category: 'regular',    coverKg: 14.4,  frameKg: 4.67,  setKg: 19.07  },
  { code: 'm_28*28_5t',    item: 'MH', size: '28*28',  capacity: '5T',    category: 'commercial', coverKg: 14.4,  frameKg: 4.67,  setKg: 19.07  },
  { code: 'm_30*30_2.5t',  item: 'MH', size: '30*30',  capacity: '2.5T',  category: 'regular',    coverKg: 17.5,  frameKg: 6.3,   setKg: 23.8   },
  { code: 'm_30*30_3t',    item: 'MH', size: '30*30',  capacity: '3T',    category: 'regular',    coverKg: 17.5,  frameKg: 6.3,   setKg: 23.8   },
  { code: 'm_30*30_5t',    item: 'MH', size: '30*30',  capacity: '5T',    category: 'commercial', coverKg: 17.5,  frameKg: 6.1,   setKg: 23.6   },
  { code: 'm_36*36_2.5t',  item: 'MH', size: '36*36',  capacity: '2.5T',  category: 'regular',    coverKg: 27,    frameKg: 12.2,  setKg: 39.2   },
  { code: 'm_36*36_3t',    item: 'MH', size: '36*36',  capacity: '3T',    category: 'regular',    coverKg: 27,    frameKg: 12.2,  setKg: 39.2   },
  { code: 'm_36*36_5t',    item: 'MH', size: '36*36',  capacity: '5T',    category: 'commercial', coverKg: 27,    frameKg: 12.2,  setKg: 39.2   },

  // ── MH (Manhole Cover) — mm sizes ────────────────────────────────────────────
  { code: 'm_300*300_2.5t',   item: 'MH', size: '300x300',   capacity: '2.5T',  category: 'regular', coverKg: 8,     frameKg: 6.1,   setKg: 14.1   },
  { code: 'm_300*300_5t',     item: 'MH', size: '300x300',   capacity: '5T',    category: 'regular', coverKg: 8,     frameKg: 6.1,   setKg: 14.1   },
  { code: 'm_300*300_12.5t',  item: 'MH', size: '300x300',   capacity: '12.5T', category: 'regular', coverKg: 8.5,   frameKg: 6.1,   setKg: 14.6   },
  { code: 'm_300*300_25t',    item: 'MH', size: '300x300',   capacity: '25T',   category: 'regular', coverKg: 8.5,   frameKg: 6.1,   setKg: 14.6   },
  { code: 'm_300*300_40t',    item: 'MH', size: '300x300',   capacity: '40T',   category: 'regular', coverKg: 19.1,  frameKg: 22,    setKg: 41.1   },
  { code: 'm_450*450_2.5t',   item: 'MH', size: '450x450',   capacity: '2.5T',  category: 'regular', coverKg: 15,    frameKg: 9.6,   setKg: 24.6   },
  { code: 'm_450*450_5t',     item: 'MH', size: '450x450',   capacity: '5T',    category: 'regular', coverKg: 15,    frameKg: 9.6,   setKg: 24.6   },
  { code: 'm_450*450_12.5t',  item: 'MH', size: '450x450',   capacity: '12.5T', category: 'regular', coverKg: 16,    frameKg: 14.6,  setKg: 30.6   },
  { code: 'm_450*450_25t',    item: 'MH', size: '450x450',   capacity: '25T',   category: 'regular', coverKg: 31,    frameKg: 25,    setKg: 56     },
  { code: 'm_450*450_40t',    item: 'MH', size: '450x450',   capacity: '40T',   category: 'regular', coverKg: 33,    frameKg: 25,    setKg: 58     },
  { code: 'm_450*600_2.5t',   item: 'MH', size: '450x600',   capacity: '2.5T',  category: 'regular', coverKg: 21,    frameKg: 10,    setKg: 31     },
  { code: 'm_450*600_5t',     item: 'MH', size: '450x600',   capacity: '5T',    category: 'regular', coverKg: 21,    frameKg: 10,    setKg: 31     },
  { code: 'm_450*600_12.5t',  item: 'MH', size: '450x600',   capacity: '12.5T', category: 'regular', coverKg: 34,    frameKg: 9.82,  setKg: 43.82  },
  { code: 'm_450*600_25t',    item: 'MH', size: '450x600',   capacity: '25T',   category: 'regular', coverKg: 34,    frameKg: 23,    setKg: 57     },
  { code: 'm_450*600_40t',    item: 'MH', size: '450x600',   capacity: '40T',   category: 'regular', coverKg: 36.7,  frameKg: 21.45, setKg: 58.15  },
  { code: 'm_450*900_5t',     item: 'MH', size: '450x900',   capacity: '5T',    category: 'regular', coverKg: 66,    frameKg: 0,     setKg: 66     },
  { code: 'm_450*900_12.5t',  item: 'MH', size: '450x900',   capacity: '12.5T', category: 'regular', coverKg: 31,    frameKg: 25,    setKg: 56     },
  { code: 'm_600*600_2.5t',   item: 'MH', size: '600x600',   capacity: '2.5T',  category: 'regular', coverKg: 32.9,  frameKg: 15,    setKg: 47.9   },
  { code: 'm_600*600_5t',     item: 'MH', size: '600x600',   capacity: '5T',    category: 'regular', coverKg: 32.9,  frameKg: 15,    setKg: 47.9   },
  { code: 'm_600*600_12.5t',  item: 'MH', size: '600x600',   capacity: '12.5T', category: 'regular', coverKg: 38.6,  frameKg: 15,    setKg: 53.6   },
  { code: 'm_600*600_25t',    item: 'MH', size: '600x600',   capacity: '25T',   category: 'regular', coverKg: 56.5,  frameKg: 30,    setKg: 86.5   },
  { code: 'm_600*600_40t',    item: 'MH', size: '600x600',   capacity: '40T',   category: 'regular', coverKg: 61,    frameKg: 30,    setKg: 91     },
  { code: 'm_600*600_60t',    item: 'MH', size: '600x600',   capacity: 'E600',  category: 'regular', coverKg: 123,   frameKg: 63,    setKg: 186    },
  // { code: 'm_600*600_f900',   item: 'MH', size: '600x600',   capacity: 'F900',  category: 'regular', coverKg: 0,     frameKg: 0,     setKg: 0      },
  { code: 'm_600*900_2.5t',   item: 'MH', size: '600x900',   capacity: '2.5T',  category: 'regular', coverKg: 38.6,  frameKg: 15,    setKg: 53.6   },
  { code: 'm_600*900_5t',     item: 'MH', size: '600x900',   capacity: '5T',    category: 'regular', coverKg: 38.6,  frameKg: 15,    setKg: 53.6   },
  { code: 'm_600*900_12.5t',  item: 'MH', size: '600x900',   capacity: '12.5T', category: 'regular', coverKg: 66,    frameKg: 30,    setKg: 96     },
  { code: 'm_600*900_25t',    item: 'MH', size: '600x900',   capacity: '25T',   category: 'regular', coverKg: 92,    frameKg: 33,    setKg: 125    },
  { code: 'm_600*900_40t',    item: 'MH', size: '600x900',   capacity: '40T',   category: 'regular', coverKg: 94,    frameKg: 33,    setKg: 127    },
  { code: 'm_750*750_2.5t',   item: 'MH', size: '750x750',   capacity: '2.5T',  category: 'regular', coverKg: 41,    frameKg: 22.5,  setKg: 63.5   },
  { code: 'm_750*750_5t',     item: 'MH', size: '750x750',   capacity: '5T',    category: 'regular', coverKg: 41,    frameKg: 22.5,  setKg: 63.5   },
  { code: 'm_750*750_12.5t',  item: 'MH', size: '750x750',   capacity: '12.5T', category: 'regular', coverKg: 66.5,  frameKg: 24.7,  setKg: 91.2   },
  { code: 'm_750*750_25t',    item: 'MH', size: '750x750',   capacity: '25T',   category: 'regular', coverKg: 92,    frameKg: 31,    setKg: 123    },
  { code: 'm_750*750_40t',    item: 'MH', size: '750x750',   capacity: '40T',   category: 'regular', coverKg: 94,    frameKg: 31,    setKg: 125    },
  { code: 'm_750*900_5t',     item: 'MH', size: '750x900',   capacity: '5T',    category: 'regular', coverKg: 71.9,  frameKg: 30.3,  setKg: 102.2  },
  { code: 'm_750*900_12.5t',  item: 'MH', size: '750x900',   capacity: '12.5T', category: 'regular', coverKg: 71.9,  frameKg: 30.3,  setKg: 102.2  },
  { code: 'm_900*900_2.5t',   item: 'MH', size: '900x900',   capacity: '2.5T',  category: 'regular', coverKg: 72,    frameKg: 24.5,  setKg: 96.5   },
  { code: 'm_900*900_5t',     item: 'MH', size: '900x900',   capacity: '5T',    category: 'regular', coverKg: 72,    frameKg: 24.5,  setKg: 96.5   },
  { code: 'm_900*900_12.5t',  item: 'MH', size: '900x900',   capacity: '12.5T', category: 'regular', coverKg: 63,    frameKg: 37,    setKg: 100    },
  { code: 'm_900*900_25t',    item: 'MH', size: '900x900',   capacity: '25T',   category: 'regular', coverKg: 63,    frameKg: 37,    setKg: 100    },
  { code: 'm_900*900_40t',    item: 'MH', size: '900x900',   capacity: '40T',   category: 'regular', coverKg: 65,    frameKg: 37,    setKg: 102    },
  { code: 'm_900*900_90t',    item: 'MH', size: '900x900',   capacity: '90T',   category: 'regular', coverKg: 254,   frameKg: 120,   setKg: 374    },
  // { code: 'm_900*1200_12.5t', item: 'MH', size: '900x1200',  capacity: '12.5T', category: 'regular', coverKg: 0,     frameKg: 0,     setKg: 0      },
  { code: 'm_900*1200_25t',   item: 'MH', size: '900x1200',  capacity: '25T',   category: 'regular', coverKg: 119,   frameKg: 72,    setKg: 191    },
  { code: 'm_900*1200_40t',   item: 'MH', size: '900x1200',  capacity: '40T',   category: 'regular', coverKg: 119,   frameKg: 72,    setKg: 191    },
  { code: 'm_1000*1000_2.5t', item: 'MH', size: '1000x1000', capacity: '2.5T',  category: 'regular', coverKg: 105,   frameKg: 40,    setKg: 145    },
  { code: 'm_1000*1000_5t',   item: 'MH', size: '1000x1000', capacity: '5T',    category: 'regular', coverKg: 105,   frameKg: 40,    setKg: 145    },
  { code: 'm_1000*1000_12.5t',item: 'MH', size: '1000x1000', capacity: '12.5T', category: 'regular', coverKg: 123,   frameKg: 34.25, setKg: 157.25 },
  { code: 'm_1000*1000_25t',  item: 'MH', size: '1000x1000', capacity: '25T',   category: 'regular', coverKg: 82,    frameKg: 0,     setKg: 82     },
  { code: 'm_1000*1000_40t',  item: 'MH', size: '1000x1000', capacity: '40T',   category: 'regular', coverKg: 82,    frameKg: 0,     setKg: 82     },
  { code: 'm_1200*1200_2.5t', item: 'MH', size: '1200x1200', capacity: '2.5T',  category: 'regular', coverKg: 89.98, frameKg: 42.7,  setKg: 132.68 },
  { code: 'm_1200*1200_5t',   item: 'MH', size: '1200x1200', capacity: '5T',    category: 'regular', coverKg: 89.98, frameKg: 42.7,  setKg: 132.68 },
  { code: 'm_1200*1200_12.5t',item: 'MH', size: '1200x1200', capacity: '12.5T', category: 'regular', coverKg: 89.98, frameKg: 42.7,  setKg: 132.68 },
  { code: 'm_1200*1200_25t',  item: 'MH', size: '1200x1200', capacity: '25T',   category: 'regular', coverKg: 89.98, frameKg: 42.7,  setKg: 132.68 },
  { code: 'm_1500*1500_5t',   item: 'MH', size: '1500x1500', capacity: '5T',    category: 'regular', coverKg: 164,   frameKg: 90,    setKg: 254    },
  { code: 'm_1500*1500_12.5t',item: 'MH', size: '1500x1500', capacity: '12.5T', category: 'regular', coverKg: 376,   frameKg: 0,     setKg: 376    },
  { code: 'm_1600*1600_5t',   item: 'MH', size: '1600x1600', capacity: '5T',    category: 'regular', coverKg: 164,   frameKg: 0,     setKg: 164    },

  // ── DS (Double Seal Cover) ───────────────────────────────────────────────────
  { code: 'D_450*450_12.5t',  item: 'DS', size: '450x450', capacity: '12.5T', category: 'regular', coverKg: 31,   frameKg: 25,   setKg: 56   },
  { code: 'D_450*450_25t',    item: 'DS', size: '450x450', capacity: '25T',   category: 'regular', coverKg: 31,   frameKg: 25,   setKg: 56   },
  { code: 'D_600*600_12.5t',  item: 'DS', size: '600x600', capacity: '12.5T', category: 'regular', coverKg: 40.4, frameKg: 20.9, setKg: 61.3 },
  { code: 'D_600*600_60t',    item: 'DS', size: '600x600', capacity: 'E600',  category: 'regular', coverKg: 123,  frameKg: 68,   setKg: 191  },
  { code: 'd_750*750_12.5t',  item: 'DS', size: '750x750', capacity: '12.5T', category: 'regular', coverKg: 66.5, frameKg: 24.7, setKg: 91.2 },

  // ── CGT Cover ────────────────────────────────────────────────────────────────
  { code: 'c_700 DAI_5t',    item: 'CGT', size: '700 DAI', capacity: '5T',    category: 'regular', coverKg: 9,    frameKg: 22,    setKg: 31    },
  { code: 'c_700 DAI_12.5t', item: 'CGT', size: '700 DAI', capacity: '12.5T', category: 'regular', coverKg: 9,    frameKg: 22,    setKg: 31    },
  { code: 'c_800 DAI_5t',    item: 'CGT', size: '800 DAI', capacity: '5T',    category: 'regular', coverKg: 11.5, frameKg: 22.85, setKg: 34.35 },

  // ── ROUND Cover ──────────────────────────────────────────────────────────────
  // { code: 'R_600 DAI_2.5t',  item: 'ROUND', size: '600 DAI', capacity: '2.5T', category: 'regular', coverKg: 0,    frameKg: 0,    setKg: 0     },
  { code: 'R_900 DAI_5t',    item: 'ROUND', size: '900 DAI', capacity: '5T',   category: 'regular', coverKg: 50,   frameKg: 25,   setKg: 75    },
  { code: 'R_900 DAI_25t',   item: 'ROUND', size: '900 DAI', capacity: '25T',  category: 'regular', coverKg: 98.1, frameKg: 36.5, setKg: 134.6 },
  { code: 'R_900 DAI_40t',   item: 'ROUND', size: '900 DAI', capacity: '40T',  category: 'regular', coverKg: 98.1, frameKg: 36.5, setKg: 134.6 },

  // ── EMHC (Extra Heavy MHC) ───────────────────────────────────────────────────
  { code: 'e_600*600_5t',    item: 'EMHC', size: '600x600', capacity: '5T',    category: 'regular', coverKg: 32,   frameKg: 0,    setKg: 32    },
  { code: 'e_600*600_12.5t', item: 'EMHC', size: '600x600', capacity: '12.5T', category: 'regular', coverKg: 37.9, frameKg: 21.5, setKg: 59.4  },

  // ── RC (Road Cover Square) ───────────────────────────────────────────────────
  { code: 'r_300*300_2.5t',         item: 'RC', size: '300x300', capacity: '2.5T',  category: 'regular', coverKg: 19,    frameKg: 22,    setKg: 41     },
  { code: 'r_300*300_5t',           item: 'RC', size: '300x300', capacity: '5T',    category: 'regular', coverKg: 19,    frameKg: 22,    setKg: 41     },
  { code: 'r_300*300_12.5t',        item: 'RC', size: '300x300', capacity: '12.5T', category: 'regular', coverKg: 19,    frameKg: 22,    setKg: 41     },
  { code: 'r_300*300_40t',          item: 'RC', size: '300x300', capacity: '40T',   category: 'regular', coverKg: 19,    frameKg: 22,    setKg: 41     },
  { code: 'r_300*300(65MM)_5t',     item: 'RC', size: '300x300', capacity: '5T',    category: 'regular', coverKg: 19,    frameKg: 22,    setKg: 41     },
  { code: 'r_300*300(65MM)_40t',    item: 'RC', size: '300x300', capacity: '40T',   category: 'regular', coverKg: 19,    frameKg: 22,    setKg: 41     },
  { code: 'r_450*450_2.5t',         item: 'RC', size: '450x450', capacity: '2.5T',  category: 'regular', coverKg: 42,    frameKg: 24,    setKg: 66     },
  { code: 'r_450*450_5t',           item: 'RC', size: '450x450', capacity: '5T',    category: 'regular', coverKg: 42,    frameKg: 24,    setKg: 66     },
  { code: 'r_450*450_12.5t',        item: 'RC', size: '450x450', capacity: '12.5T', category: 'regular', coverKg: 42,    frameKg: 24,    setKg: 66     },
  { code: 'r_450*450_25t',          item: 'RC', size: '450x450', capacity: '25T',   category: 'regular', coverKg: 42,    frameKg: 24,    setKg: 66     },
  { code: 'r_450*450_40t',          item: 'RC', size: '450x450', capacity: '40T',   category: 'regular', coverKg: 42,    frameKg: 24,    setKg: 66     },
  { code: 'r_450*450(65MM)_5t',     item: 'RC', size: '450x450', capacity: '5T',    category: 'regular', coverKg: 42,    frameKg: 24,    setKg: 66     },
  { code: 'r_450*450(65MM)_40t',    item: 'RC', size: '450x450', capacity: '40T',   category: 'regular', coverKg: 42,    frameKg: 24,    setKg: 66     },
  { code: 'r_600*600_2.5t',         item: 'RC', size: '600x600', capacity: '2.5T',  category: 'regular', coverKg: 42,    frameKg: 24,    setKg: 66     },
  { code: 'r_600*600_5t',           item: 'RC', size: '600x600', capacity: '5T',    category: 'regular', coverKg: 41,    frameKg: 35.8,  setKg: 76.8   },
  { code: 'r_600*600_12.5t',        item: 'RC', size: '600x600', capacity: '12.5T', category: 'regular', coverKg: 41,    frameKg: 35.8,  setKg: 76.8   },
  { code: 'r_600*600_25t',          item: 'RC', size: '600x600', capacity: '25T',   category: 'regular', coverKg: 55,    frameKg: 38,    setKg: 93     },
  { code: 'r_600*600_40t',          item: 'RC', size: '600x600', capacity: '40T',   category: 'regular', coverKg: 55,    frameKg: 38,    setKg: 93     },
  { code: 'r_600*600(32MM)_5t',     item: 'RC', size: '600x600', capacity: '5T',    category: 'regular', coverKg: 42,    frameKg: 24,    setKg: 66     },
  { code: 'r_600*600(32MM)_40t',    item: 'RC', size: '600x600', capacity: '40T',   category: 'regular', coverKg: 55,    frameKg: 38,    setKg: 93     },
  { code: 'r_600*600(65MM)_12.5t',  item: 'RC', size: '600x600', capacity: '12.5T', category: 'regular', coverKg: 42,    frameKg: 24,    setKg: 66     },
  { code: 'r_600*600(65MM)_25t',    item: 'RC', size: '600x600', capacity: '25T',   category: 'regular', coverKg: 55,    frameKg: 38,    setKg: 93     },
  { code: 'r_600*600(65MM)_40t',    item: 'RC', size: '600x600', capacity: '40T',   category: 'regular', coverKg: 55,    frameKg: 38,    setKg: 93     },
  { code: 'r_750*750_2.5t',         item: 'RC', size: '750x750', capacity: '2.5T',  category: 'regular', coverKg: 70,    frameKg: 32.35, setKg: 102.35 },
  { code: 'r_750*750_5t',           item: 'RC', size: '750x750', capacity: '5T',    category: 'regular', coverKg: 70,    frameKg: 32.35, setKg: 102.35 },
  { code: 'r_750*750_12.5t',        item: 'RC', size: '750x750', capacity: '12.5T', category: 'regular', coverKg: 70,    frameKg: 32.35, setKg: 102.35 },
  { code: 'r_750*750_25t',          item: 'RC', size: '750x750', capacity: '25T',   category: 'regular', coverKg: 70.15, frameKg: 32.35, setKg: 102.5  },
  { code: 'r_750*750_40t',          item: 'RC', size: '750x750', capacity: '40T',   category: 'regular', coverKg: 70.15, frameKg: 32.35, setKg: 102.5  },
  { code: 'r_750*750(65MM)_12.5t',  item: 'RC', size: '750x750', capacity: '12.5T', category: 'regular', coverKg: 70.15, frameKg: 32.35, setKg: 102.5  },
  { code: 'r_750*750(65MM)_40t',    item: 'RC', size: '750x750', capacity: '40T',   category: 'regular', coverKg: 70.15, frameKg: 32.35, setKg: 102.5  },
  { code: 'r_900*900_2.5t',         item: 'RC', size: '900x900', capacity: '2.5T',  category: 'regular', coverKg: 105,   frameKg: 52,    setKg: 157    },
  { code: 'r_900*900_5t',           item: 'RC', size: '900x900', capacity: '5T',    category: 'regular', coverKg: 105,   frameKg: 52,    setKg: 157    },
  { code: 'r_900*900_12.5t',        item: 'RC', size: '900x900', capacity: '12.5T', category: 'regular', coverKg: 98,    frameKg: 52,    setKg: 150    },
  { code: 'r_900*900_25t',          item: 'RC', size: '900x900', capacity: '25T',   category: 'regular', coverKg: 105,   frameKg: 52,    setKg: 157    },
  { code: 'r_900*900_40t',          item: 'RC', size: '900x900', capacity: '40T',   category: 'regular', coverKg: 105,   frameKg: 52,    setKg: 157    },
  { code: 'r_900*900(65MM)_5t',     item: 'RC', size: '900x900', capacity: '5T',    category: 'regular', coverKg: 98,    frameKg: 52,    setKg: 150    },
  { code: 'r_900*900(65MM)_40t',    item: 'RC', size: '900x900', capacity: '40T',   category: 'regular', coverKg: 105,   frameKg: 52,    setKg: 157    },

  // ── RCC (Road Cover Circular) ─────────────────────────────────────────────────
  { code: 'r_600_30t',   item: 'RCC', size: '600 FRC', capacity: '30T', category: 'regular', coverKg: 0, frameKg: 53, setKg: 53 },

  // ── WG (Wire Grating Cover) ───────────────────────────────────────────────────
  { code: 'w_300*300_2.5t',    item: 'WG', size: '300x300',   capacity: '2.5T',  category: 'regular', coverKg: 6,      frameKg: 8,     setKg: 14     },
  { code: 'w_300*300_5t',      item: 'WG', size: '300x300',   capacity: '5T',    category: 'regular', coverKg: 6,      frameKg: 8,     setKg: 14     },
  // { code: 'w_300*700_12.5t',   item: 'WG', size: '300x700',   capacity: '12.5T', category: 'regular', coverKg: 0,      frameKg: 0,     setKg: 0      },
  // { code: 'w_385*700_5t',      item: 'WG', size: '385x700',   capacity: '5T',    category: 'regular', coverKg: 0,      frameKg: 0,     setKg: 0      },
  // { code: 'w_385*700_12.5t',   item: 'WG', size: '385x700',   capacity: '12.5T', category: 'regular', coverKg: 0,      frameKg: 0,     setKg: 0      },
  // { code: 'w_385*700_40t',     item: 'WG', size: '385x700',   capacity: '40T',   category: 'regular', coverKg: 0,      frameKg: 0,     setKg: 0      },
  { code: 'w_450*450_2.5t',    item: 'WG', size: '450x450',   capacity: '2.5T',  category: 'regular', coverKg: 22.6,   frameKg: 14.6,  setKg: 37.2   },
  { code: 'w_450*450_5t',      item: 'WG', size: '450x450',   capacity: '5T',    category: 'regular', coverKg: 22.6,   frameKg: 14.6,  setKg: 37.2   },
  { code: 'w_450*450_12.5t',   item: 'WG', size: '450x450',   capacity: '12.5T', category: 'regular', coverKg: 22.6,   frameKg: 14.6,  setKg: 37.2   },
  { code: 'w_450*450_25t',     item: 'WG', size: '450x450',   capacity: '25T',   category: 'regular', coverKg: 23.2,   frameKg: 14.6,  setKg: 37.8   },
  // { code: 'w_450*600_5t',      item: 'WG', size: '450x600',   capacity: '5T',    category: 'regular', coverKg: 0,      frameKg: 0,     setKg: 0      },
  // { code: 'w_450*600_12.5t',   item: 'WG', size: '450x600',   capacity: '12.5T', category: 'regular', coverKg: 0,      frameKg: 0,     setKg: 0      },
  // { code: 'w_450*600_40t',     item: 'WG', size: '450x600',   capacity: '40T',   category: 'regular', coverKg: 0,      frameKg: 0,     setKg: 0      },
  { code: 'w_600*600_2.5t',    item: 'WG', size: '600x600',   capacity: '2.5T',  category: 'regular', coverKg: 43,     frameKg: 26,    setKg: 69     },
  { code: 'w_600*600_5t',      item: 'WG', size: '600x600',   capacity: '5T',    category: 'regular', coverKg: 43,     frameKg: 26,    setKg: 69     },
  { code: 'w_600*600_12.5t',   item: 'WG', size: '600x600',   capacity: '12.5T', category: 'regular', coverKg: 43,     frameKg: 26,    setKg: 69     },
  { code: 'w_600*600_25t',     item: 'WG', size: '600x600',   capacity: '25T',   category: 'regular', coverKg: 56,     frameKg: 31,    setKg: 87     },
  { code: 'w_600*600_30t',     item: 'WG', size: '600x600',   capacity: '30T',   category: 'regular', coverKg: 40,     frameKg: 24,    setKg: 64     },
  { code: 'w_600*600_40t',     item: 'WG', size: '600x600',   capacity: '40T',   category: 'regular', coverKg: 58,     frameKg: 31,    setKg: 89     },
  { code: 'w_600*600_60t',     item: 'WG', size: '600x600',   capacity: 'E600',  category: 'regular', coverKg: 58,     frameKg: 31,    setKg: 89     },
  // { code: 'w_600*720_90t',     item: 'WG', size: '600x720',   capacity: '90T',   category: 'regular', coverKg: 0,      frameKg: 0,     setKg: 0      },
  { code: 'w_600*900_12.5t',   item: 'WG', size: '600x900',   capacity: '12.5T', category: 'regular', coverKg: 78.25,  frameKg: 34,    setKg: 112.25 },
  { code: 'w_600*900_25t',     item: 'WG', size: '600x900',   capacity: '25T',   category: 'regular', coverKg: 81.5,   frameKg: 34,    setKg: 115.5  },
  { code: 'w_600*900_40t',     item: 'WG', size: '600x900',   capacity: '40T',   category: 'regular', coverKg: 81,     frameKg: 34,    setKg: 115    },
  { code: 'w_600*1200_25t',    item: 'WG', size: '600x1200',  capacity: '25T',   category: 'regular', coverKg: 105.2,  frameKg: 38.2,  setKg: 143.4  },
  { code: 'w_750*750_40t',     item: 'WG', size: '750x750',   capacity: '40T',   category: 'regular', coverKg: 75.5,   frameKg: 32.5,  setKg: 108    },
  { code: 'w_900*900_2.5t',    item: 'WG', size: '900x900',   capacity: '2.5T',  category: 'regular', coverKg: 92,     frameKg: 38,    setKg: 130    },
  { code: 'w_900*900_5t',      item: 'WG', size: '900x900',   capacity: '5T',    category: 'regular', coverKg: 92,     frameKg: 38,    setKg: 130    },
  { code: 'w_900*900_12.5t',   item: 'WG', size: '900x900',   capacity: '12.5T', category: 'regular', coverKg: 92,     frameKg: 38,    setKg: 130    },
  { code: 'w_900*900_40t',     item: 'WG', size: '900x900',   capacity: '40T',   category: 'regular', coverKg: 92,     frameKg: 38,    setKg: 130    },
  { code: 'w_1500*1500_25t',   item: 'WG', size: '1500x1500', capacity: '25T',   category: 'regular', coverKg: 376,    frameKg: 124,   setKg: 500    },

  // ── ONGC Cover ────────────────────────────────────────────────────────────────
  { code: 'o_300*300_5t',      item: 'ONGC', size: '300x300',  capacity: '5T',    category: 'regular', coverKg: 19.5,  frameKg: 0, setKg: 19.5  },
  { code: 'o_300*700_5t',      item: 'ONGC', size: '300x700',  capacity: '5T',    category: 'regular', coverKg: 12.5,  frameKg: 0, setKg: 12.5  },
  { code: 'o_300*700_12.5t',   item: 'ONGC', size: '300x700',  capacity: '12.5T', category: 'regular', coverKg: 12.5,  frameKg: 0, setKg: 12.5  },
  { code: 'o_300*700_25t',     item: 'ONGC', size: '300x700',  capacity: '25T',   category: 'regular', coverKg: 19.5,  frameKg: 0, setKg: 19.5  },
  { code: 'o_385*700_5t',      item: 'ONGC', size: '385x700',  capacity: '5T',    category: 'regular', coverKg: 19.5,  frameKg: 0, setKg: 19.5  },
  { code: 'o_385*700_12.5t',   item: 'ONGC', size: '385x700',  capacity: '12.5T', category: 'regular', coverKg: 15.7,  frameKg: 0, setKg: 15.7  },
  // { code: 'o_385*700_25t',     item: 'ONGC', size: '385x700',  capacity: '25T',   category: 'regular', coverKg: 0,     frameKg: 0, setKg: 0     },
  { code: 'o_385*700_40t',     item: 'ONGC', size: '385x700',  capacity: '40T',   category: 'regular', coverKg: 23,    frameKg: 0, setKg: 23    },
  { code: 'o_450*600_5t',      item: 'ONGC', size: '450x600',  capacity: '5T',    category: 'regular', coverKg: 29,    frameKg: 0, setKg: 29    },
  { code: 'o_450*600_12.5t',   item: 'ONGC', size: '450x600',  capacity: '12.5T', category: 'regular', coverKg: 29,    frameKg: 0, setKg: 29    },
  { code: 'o_450*600_25t',     item: 'ONGC', size: '450x600',  capacity: '25T',   category: 'regular', coverKg: 29,    frameKg: 0, setKg: 29    },
  { code: 'o_450*600_40t',     item: 'ONGC', size: '450x600',  capacity: '40T',   category: 'regular', coverKg: 29,    frameKg: 0, setKg: 29    },
  { code: 'o_600*600_5t',      item: 'ONGC', size: '600x600',  capacity: '5T',    category: 'regular', coverKg: 46,    frameKg: 0, setKg: 46    },
  { code: 'o_600*600_12.5t',   item: 'ONGC', size: '600x600',  capacity: '12.5T', category: 'regular', coverKg: 36.75, frameKg: 0, setKg: 36.75 },
  { code: 'o_600*600_25t',     item: 'ONGC', size: '600x600',  capacity: '25T',   category: 'regular', coverKg: 36.75, frameKg: 0, setKg: 36.75 },
  { code: 'o_600*600_40t',     item: 'ONGC', size: '600x600',  capacity: '40T',   category: 'regular', coverKg: 42,    frameKg: 0, setKg: 42    },
  { code: 'o_600*1000_5t',     item: 'ONGC', size: '600x1000', capacity: '5T',    category: 'regular', coverKg: 57,    frameKg: 0, setKg: 57    },
];

// ─── HELPER FUNCTIONS ─────────────────────────────────────────────────────────

export function getEntryFromCode(code: string): ProductEntry | undefined {
  return PRODUCT_CATALOG.find(p => p.code === code);
}

export function getWeights(code: string): ProductWeight | undefined {
  return getEntryFromCode(code);
}

export function getItemFromCode(code: string): string {
  return getEntryFromCode(code)?.item ?? code.split('_')[0].toUpperCase();
}

export function getSizeFromCode(code: string): string {
  return getEntryFromCode(code)?.size ?? (code.split('_')[1] ?? '');
}

export function getCapacityFromCode(code: string): string {
  return getEntryFromCode(code)?.capacity ?? (code.split('_')[2]?.toUpperCase() ?? '');
}

export function getCategoryFromCode(code: string): ItemCategory {
  return getEntryFromCode(code)?.category ?? 'regular';
}

export function buildCode(prefix: string, size: string, capacity: string): string {
  return `${prefix}${size}_${capacity.toLowerCase()}`;
}

// ─── RAW MATERIAL UNIT CONVERSIONS ────────────────────────────────────────────
export interface RawMaterial {
  name: string;
  unit: string;
  weightPerUnitT: number; // tonnes per unit
  department: 'PRODUCTION' | 'FINISHING' | 'BOTH';
}

export const RAW_MATERIALS: RawMaterial[] = [
  { name: 'Resin',          unit: 'Barrel', weightPerUnitT: 0.225, department: 'PRODUCTION' },
  { name: 'ISO Resin',      unit: 'Barrel', weightPerUnitT: 0.225, department: 'PRODUCTION' },
  { name: 'PET Resin',      unit: 'Barrel', weightPerUnitT: 0.225, department: 'PRODUCTION' },
  { name: 'Vinyl Resin',    unit: 'Barrel', weightPerUnitT: 0.225, department: 'PRODUCTION' },
  { name: 'CSM 225',        unit: 'Roll',   weightPerUnitT: 0.030, department: 'PRODUCTION' },
  { name: 'CSM 450',        unit: 'Roll',   weightPerUnitT: 0.035, department: 'PRODUCTION' },
  { name: 'UD Matt',        unit: 'Roll',   weightPerUnitT: 0.325, department: 'PRODUCTION' },
  { name: '225 Matt',       unit: 'Roll',   weightPerUnitT: 0.325, department: 'PRODUCTION' },
  { name: 'Woven Roving',   unit: 'Roll',   weightPerUnitT: 0.035, department: 'PRODUCTION' },
  { name: 'Tissue Matt',    unit: 'Roll',   weightPerUnitT: 0.030, department: 'PRODUCTION' },
  { name: 'Sand',           unit: 'Bag',    weightPerUnitT: 0.050, department: 'PRODUCTION' },
  { name: 'Dolomite Powder',unit: 'Bag',    weightPerUnitT: 0.050, department: 'PRODUCTION' },
  { name: 'Powder',         unit: 'Bag',    weightPerUnitT: 0.050, department: 'PRODUCTION' },
  { name: 'MEKP',           unit: 'KG',     weightPerUnitT: 0.001, department: 'PRODUCTION' },
  { name: 'Catalyst',       unit: 'KG',     weightPerUnitT: 0.001, department: 'PRODUCTION' },
  { name: 'Cobalt',         unit: 'KG',     weightPerUnitT: 0.001, department: 'PRODUCTION' },
  { name: 'Pigment',        unit: 'KG',     weightPerUnitT: 0.001, department: 'PRODUCTION' },
  { name: 'PVA',            unit: 'KG',     weightPerUnitT: 0.001, department: 'PRODUCTION' },
  { name: 'Wax',            unit: 'KG',     weightPerUnitT: 0.001, department: 'PRODUCTION' },
  { name: 'Thinner',        unit: 'Litre',  weightPerUnitT: 0.001, department: 'PRODUCTION' },
  { name: 'Grey Color',     unit: 'Litre',  weightPerUnitT: 0.001, department: 'FINISHING' },
  { name: 'Black Color',    unit: 'Litre',  weightPerUnitT: 0.001, department: 'FINISHING' },
  { name: 'Diamond Cutter', unit: 'Piece',  weightPerUnitT: 0,     department: 'FINISHING' },
];

export function getRawMaterial(name: string): RawMaterial | undefined {
  return RAW_MATERIALS.find(m => m.name === name);
}

export function calcRawWeight(materialName: string, qty: number): number {
  const mat = getRawMaterial(materialName);
  return mat ? mat.weightPerUnitT * qty : 0;
}
