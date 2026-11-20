// pulseColumn · CoreAstrum AI Studio, from the prototype's src/signal.jsx.
// Needs tokens.css and foundations.css once per app, plus pulseColumn.css.
import React from 'react';
import { REDESIGN } from './design';
import { ActivityTicks } from './ActivityTicks';

export function pulseColumn(getSeries?: any, { key = 'pulse', label = 'Activity', noun = 'calls', unit = 'ms', count, countLabel = '30 days', width = 140 }: any = {}) {
  // Redesign: tables carry no graphs; the column is the plain count, sortable like any number.
  if (REDESIGN) return {
    key, label: label === 'Activity' ? noun[0].toUpperCase() + noun.slice(1) : label, align: 'r', priority: 60,
    sort: r => (count ? count(r) : getSeries(r).length),
    render: r => { const n = count ? count(r) : getSeries(r).length; return <span className="num" title={`${n} ${noun} in ${countLabel}`}>{n ? n.toLocaleString() : <span className="muted">—</span>}</span>; },
  };
  return {
    key, label, width, card: 'metric', priority: 60, wrap: true,
    sort: r => (count ? count(r) : getSeries(r).length),
    render: r => {
      const s = getSeries(r);
      const n = count ? count(r) : s.length;
      return (
        <span className="pulse-cell">
          <ActivityTicks series={s} height={18} noun={noun} unit={unit} />
          <span className="pc-n num" title={`${n} ${noun} in ${countLabel}`}>{n || '—'}</span>
        </span>
      );
    },
  };
}
