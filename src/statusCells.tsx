// statusCells · CoreAstrum AI Studio, from the prototype's src/signal.jsx.
// Needs tokens.css and foundations.css once per app.
import React from 'react';
import { HealthIndicator } from './HealthIndicator';

/* A count-by-status strip for list tops: statusCells(rows, r => r.status, { ACTIVE: ['Active','ok'], ... }). */
export function statusCells(rows?: any, get?: any, map?: any) {
  return Object.entries(map).map(([v, [label, h]]: any) => {
    const n = rows.filter(r => get(r) === v).length;
    return { k: label, v: <><span className="num">{n}</span>{h && n > 0 && <HealthIndicator h={h} />}</> };
  });
}
