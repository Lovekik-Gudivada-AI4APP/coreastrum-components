// useRun · CoreAstrum AI Studio, from the prototype's src/test-bench.jsx.
// Needs tokens.css and foundations.css once per app.
import { useEffect, useRef, useState } from 'react';
import { sleep } from './sleep';

// ---------------------------------------------------------------- runtime
// Runs a list of steps for real, one after another: each step is timed with the clock, writes to a live log,
// can warn or stop the run, and the person can cancel between steps (and inside steps that check `cancelled()`).
// A step: { key, label, run: async ctx => ({ state?: 'ok'|'warn'|'bad'|'skip', detail?, value?, stop? }) }.
export function useRun() {
  const [st, setSt] = useState({ status: 'idle', steps: [], logs: [], t0: 0, total: null });
  const cancelled = useRef(false);
  const live = useRef(true);
  useEffect(() => () => { live.current = false; cancelled.current = true; }, []);
  const set = f => { if (live.current) setSt(f); };
  const start = async (defs, ctx = {}) => {
    cancelled.current = false;
    const t0 = performance.now();
    set({ status: 'running', steps: defs.map(d => ({ key: d.key, label: d.label, status: 'pending', ms: null, detail: '' })), logs: [], t0, total: null });
    const log = (msg, level = 'info') => set(s => ({ ...s, logs: [...s.logs, { at: performance.now() - t0, level, msg }] }));
    const patch = (i, p) => set(s => ({ ...s, steps: s.steps.map((x, j) => j === i ? { ...x, ...p } : x) }));
    const skipFrom = i => set(s => ({ ...s, steps: s.steps.map((x, j) => j >= i && x.status !== 'ok' && x.status !== 'warn' && x.status !== 'bad' ? { ...x, status: 'skip' } : x) }));
    const finish = status => { set(s => ({ ...s, status, total: performance.now() - t0 })); return { ...ctx, status }; };
    for (let i = 0; i < defs.length; i++) {
      if (cancelled.current) { log('Cancelled by you. Remaining steps did not run.', 'warn'); skipFrom(i); return finish('cancelled'); }
      const s0 = performance.now();
      patch(i, { status: 'running', startedAt: s0 });
      log(defs[i].label + '…');
      try {
        const out = (await defs[i].run({ ...ctx, ctx, log, wait: sleep, cancelled: () => cancelled.current, note: d => patch(i, { detail: d }) })) || {};
        if (out.value !== undefined) ctx[defs[i].key] = out.value;
        const state = out.state || 'ok';
        patch(i, { status: state, ms: Math.round(performance.now() - s0), detail: out.detail ?? '' });
        if (state === 'bad' && out.stop) { log(out.detail || defs[i].label + ' failed', 'error'); skipFrom(i + 1); return finish('failed'); }
      } catch (e) {
        patch(i, { status: 'bad', ms: Math.round(performance.now() - s0), detail: e.message });
        log(e.message, 'error'); skipFrom(i + 1); return finish('failed');
      }
    }
    log('Done.');
    return finish('done');
  };
  return { ...st, start, cancel: () => { cancelled.current = true; }, reset: () => set({ status: 'idle', steps: [], logs: [], t0: 0, total: null }) };
}
