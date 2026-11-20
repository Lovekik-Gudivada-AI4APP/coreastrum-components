// useScrollCue · CoreAstrum AI Studio, from the prototype's src/ui.jsx.
// Needs tokens.css and foundations.css once per app.
import { useEffect, useRef, useState, useCallback } from 'react';

export function useScrollCue() {
  const ref = useRef<any>(null);
  const [cue, setCue] = useState({ l: false, r: false });
  const measure = useCallback(() => {
    const el = ref.current; if (!el) return;
    const l = el.scrollLeft > 2, r = el.scrollLeft + el.clientWidth < el.scrollWidth - 2;
    setCue(c => (c.l === l && c.r === r ? c : { l, r }));
  }, []);
  useEffect(() => {
    measure();
    const el = ref.current; if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(measure); ro.observe(el); if (el.firstElementChild) ro.observe(el.firstElementChild);
    return () => ro.disconnect();
  });
  return [ref, cue, measure] as const;
}
