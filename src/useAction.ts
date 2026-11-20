// useAction · CoreAstrum AI Studio, from the prototype's src/ui.jsx.
// Needs tokens.css and foundations.css once per app.
import { useState, useCallback } from 'react';

// Run an async simulated action with loading state.
export function useAction() {
  const [busy, setBusy] = useState(null);
  const run = useCallback(async (key, fn) => { setBusy(key); try { return await fn(); } finally { setBusy(null); } }, []);
  return [busy, run] as const;
}
