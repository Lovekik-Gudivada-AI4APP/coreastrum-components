// setDensity, useDensity · CoreAstrum AI Studio, from the prototype's src/ui.jsx.
// Needs tokens.css and foundations.css once per app.
import { useSyncExternalStore } from 'react';

/* Table density (§9 T4): comfortable 44px rows or compact 36px, remembered per user; ⌘. toggles it. */
const DENSITY_KEY = 'ca.density';

const densitySubs = new Set<any>();

let densityVal = (() => { try { return localStorage.getItem(DENSITY_KEY) === 'compact' ? 'compact' : 'comfortable'; } catch { return 'comfortable'; } })();

export function setDensity(v?: any) { densityVal = v; try { localStorage.setItem(DENSITY_KEY, v); } catch {} densitySubs.forEach(f => f()); }

export function useDensity() {
  const v = useSyncExternalStore(f => { densitySubs.add(f); return () => densitySubs.delete(f); }, () => densityVal, () => densityVal);
  return [v, setDensity] as const;
}
if (typeof window !== 'undefined') window.addEventListener('keydown', e => {
  if ((e.metaKey || e.ctrlKey) && e.key === '.' && document.querySelector('.lv')) { e.preventDefault(); setDensity(densityVal === 'compact' ? 'comfortable' : 'compact'); }
});

/* =========================================================================
   Dates (§9): a designed picker — native date inputs are banned.
   Values use the same strings native inputs did: 'YYYY-MM-DD', or
   'YYYY-MM-DDTHH:mm' when `time` is set — so pages swap them in place.
   ========================================================================= */
