// Google Sheets sync via Google Apps Script Web App webhook.
// Fire-and-forget: does not block the UI or throw on failure.
// Uses mode: 'no-cors' + Content-Type: text/plain to avoid CORS preflight.
// The Apps Script receives the raw JSON string in e.postData.contents.

const WEBHOOK_URL = import.meta.env.VITE_SHEETS_WEBHOOK_URL as string | undefined;

export interface SheetRow {
  sheet: string;
  row: (string | number)[];
}

export async function syncToSheet(payload: SheetRow): Promise<void> {
  if (!WEBHOOK_URL) return; // not configured — skip silently

  try {
    await fetch(WEBHOOK_URL, {
      method: 'POST',
      mode: 'no-cors',                    // avoids CORS preflight
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify(payload),
    });
  } catch {
    // intentionally swallowed — sheet sync is non-critical
  }
}

// ─── Convenience wrappers ────────────────────────────────────────────────────

export function syncProduction(
  date: string, code: string,
  coverQty: number, frameQty: number,
  setQty: number, coverKg: number, frameKg: number, totalWeightKg: number,
): void {
  syncToSheet({
    sheet: 'Production',
    row: [
      date, code,
      coverQty, frameQty, setQty,
      coverKg.toFixed(2), frameKg.toFixed(2), totalWeightKg.toFixed(2),
      new Date().toISOString(),
    ],
  });
}

export function syncFinishing(
  date: string, code: string, color: string,
  coverFinished: number, frameFinished: number, setFinished: number,
): void {
  syncToSheet({
    sheet: 'Finishing',
    row: [
      date, code, color,
      coverFinished, frameFinished, setFinished,
      new Date().toISOString(),
    ],
  });
}

export function syncDispatch(
  date: string, code: string, color: string,
  coverDispatched: number, frameDispatched: number, setDispatched: number,
  coverKg: number, frameKg: number, totalWeightKg: number,
): void {
  syncToSheet({
    sheet: 'Dispatch',
    row: [
      date, code, color,
      coverDispatched, frameDispatched, setDispatched,
      coverKg.toFixed(2), frameKg.toFixed(2), totalWeightKg.toFixed(2),
      new Date().toISOString(),
    ],
  });
}
