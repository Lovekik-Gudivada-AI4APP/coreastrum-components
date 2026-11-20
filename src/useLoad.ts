// useLoad · CoreAstrum AI Studio, from the prototype's src/ui.jsx.
// Needs tokens.css and foundations.css once per app.
import { useEffect, useState } from 'react';

// Simulated first-load latency so loading states are visible.
export function useLoad(deps?: any, ms = 450) {
  const [ready, setReady] = useState(false);
  useEffect(() => { setReady(false); const t = setTimeout(() => setReady(true), ms); return () => clearTimeout(t); }, deps);
  return ready;
}

/* =========================================================================
   Layer — a portal anchored to a trigger (fixed position, flips up when there
   is no room below, clamped to the viewport). Used by row menus and date pickers
   so they are never clipped by scrolling tables, dialogs or panels.
   ========================================================================= */
