// StatStrip · CoreAstrum AI Studio, from the prototype's src/signal.jsx.
// Needs tokens.css and foundations.css once per app, plus StatStrip.css.
import React from 'react';
import { cx } from './cx';

export interface StatStripProps {
  cells?: any;
}
/* ------------------------------------------------------------------ Live strip */
/* cells: [{ k, v, sub, wide }] — the first is usually the pulse. */
export function StatStrip({ cells }: StatStripProps) {
  return (
    <div className="live-strip" role="group" aria-label="Current state">
      {cells.filter(Boolean).map((c, i) => (
        <div key={i} className={cx('ls-c', c.wide && 'wide')}>
          <div className="ls-k">{c.k}</div>
          <div className="ls-v">{c.v}</div>
          {c.sub && <div className="ls-s">{c.sub}</div>}
        </div>
      ))}
    </div>
  );
}
