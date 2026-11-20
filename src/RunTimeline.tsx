// RunTimeline · CoreAstrum AI Studio, from the prototype's src/test-bench.jsx.
// Needs tokens.css and foundations.css once per app, plus RunTimeline.css.
import React, { useEffect, useState, useRef } from 'react';
import { CircleCheck, TriangleAlert, CircleX, Minus, Circle, Square } from './icons';
import { cx } from './cx';
import { Icon } from './Icon';

// Re-renders every 100 ms while something is running, so elapsed times tick.
function useTicker(on?: any) {
  const [, f] = useState(0);
  useEffect(() => { if (!on) return; const t = setInterval(() => f(x => x + 1), 100); return () => clearInterval(t); }, [on]);
}

const fmtMs = (ms?: any) => ms == null ? '' : ms < 1000 ? Math.round(ms) + ' ms' : (ms / 1000).toFixed(ms < 10000 ? 2 : 1) + ' s';

const RUN_ICON = { pending: [Circle, 'var(--ink-4)'], running: [Circle, 'var(--live)'], ok: [CircleCheck, 'var(--ok)'], warn: [TriangleAlert, 'var(--warn)'], bad: [CircleX, 'var(--bad)'], skip: [Minus, 'var(--ink-4)'] };

export interface RunTimelineProps {
  run?: any;
  title?: any;
  onCancel?: (...args: any[]) => any;
  showLog?: boolean;
}
// The run as it happens: each step with its live state and measured time, then the log.
export function RunTimeline({ run, title = 'Run', onCancel, showLog = true }: RunTimelineProps) {
  const running = run.status === 'running';
  const logRef = useRef<any>(null);
  useTicker(running);
  useEffect(() => { const el = logRef.current; if (el) el.scrollTop = el.scrollHeight; }, [run.logs.length]);
  const now = performance.now();
  if (run.status === 'idle') return null;
  return (
    <section className="tb-sec tb-live" aria-live="polite">
      <h3><span className="row" style={{ gap: 8 }}>{running && <span className="tb-pulse" />}{title} · {running ? 'running' : run.status === 'done' ? 'finished' : run.status === 'cancelled' ? 'cancelled' : 'stopped'}</span>
        <span className="row" style={{ gap: 8 }}><span className="num">{fmtMs(running ? now - run.t0 : run.total)}</span>{running && onCancel && <button type="button" className="btn sm" onClick={onCancel}><Icon icon={Square} size={12} />Cancel</button>}</span></h3>
      <ol className="tb-steps tb-tl">{run.steps.map((s, i) => { const [ico, col] = RUN_ICON[s.status] || RUN_ICON.pending; return (
        <li key={i} className={cx('tb-tl-' + s.status)}>
          <Icon icon={ico} size={16} style={{ color: col }} className={s.status === 'running' ? 'tb-spin' : undefined} />
          <div><b>{s.label}</b>{s.detail && <small>{s.detail}</small>}</div>
          <span className="num tb-ms">{s.status === 'running' ? fmtMs(now - s.startedAt) : s.status === 'pending' ? 'waiting' : s.status === 'skip' ? 'skipped' : fmtMs(s.ms)}</span>
        </li>); })}</ol>
      {showLog && run.logs.length > 0 && <pre className="tb-log" tabIndex={0} ref={logRef}>{run.logs.map(l => `${('+' + fmtMs(l.at)).padStart(9)}  ${l.level === 'error' ? 'ERROR ' : l.level === 'warn' ? 'WARN  ' : '      '}${l.msg}`).join('\n')}</pre>}
    </section>
  );
}
