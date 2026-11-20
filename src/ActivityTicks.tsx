// ActivityTicks · CoreAstrum AI Studio, from the prototype's src/signal.jsx.
// Needs tokens.css and foundations.css once per app, plus ActivityTicks.css.
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { cx } from './cx';
import { pulseSummary } from './pulseSummary';

export interface ActivityTicksProps {
  series?: any[];
  slots?: number;
  height?: number;
  noun?: any;
  unit?: any;
  stat?: any;
  onPick?: (...args: any[]) => any;
  className?: string;
  label?: any;
}
export function ActivityTicks({ series = [], slots = 24, height = 22, noun, unit = 'ms', stat, onPick, className, label }: ActivityTicksProps) {
  const [tip, setTip] = useState(null);
  const max = Math.max(1, ...series.map(e => e.value || 0));
  const shown = series.slice(-slots);
  const pad = Math.max(0, slots - shown.length);
  const summary = label || pulseSummary(series, { noun, unit, stat });
  const show = (e, el) => { const r = el.getBoundingClientRect(); setTip({ text: e.tip || e.status, x: r.left + r.width / 2, y: r.top }); };
  const tick = (e, i) => {
    const h = e.value == null ? (e.status === 'bad' ? 1 : 0.45) : Math.max(0.16, e.value / max);
    const body = <i style={{ height: `${Math.round(h * 100)}%` }} />;
    const hover = { onMouseEnter: ev => show(e, ev.currentTarget), onMouseLeave: () => setTip(null) };
    return onPick && e.to
      ? <button key={i} type="button" className="spulse-t" data-s={e.status} aria-label={e.tip || e.status} {...hover} onFocus={ev => show(e, ev.currentTarget)} onBlur={() => setTip(null)} onClick={ev => { ev.stopPropagation(); onPick(e); }}>{body}</button>
      : <span key={i} className="spulse-t" data-s={e.status} {...hover}>{body}</span>;
  };
  return (
    <span className={cx('spulse', onPick && 'pick', className)} style={{ '--pulse-h': height + 'px', '--slots': slots } as React.CSSProperties} role={onPick ? 'group' : 'img'} aria-label={summary}>
      {Array.from({ length: pad }, (_, i) => <span key={'p' + i} className="spulse-t" data-s="none"><i /></span>)}
      {shown.map(tick)}
      {tip && createPortal(<span className="spulse-tip" role="tooltip" style={{ left: tip.x, top: tip.y }}>{tip.text}</span>, document.body)}
    </span>
  );
}

/* ListView column: replaces a bare count with the activity pulse + count.
   getSeries(row) → events; opts.count(row) → the number shown beside it (e.g. calls in 30 days). */
