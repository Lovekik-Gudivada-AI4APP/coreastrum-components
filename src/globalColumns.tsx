// globalColumns · CoreAstrum AI Studio, from the prototype's src/signal.jsx.
// Needs tokens.css and foundations.css once per app, plus globalColumns.css.
import React from 'react';
import { REDESIGN } from './design';
import { lineage as lineageOf } from './platform';
import { globalInfo } from './globalInfo';

// Table columns for the same picture, shown only in Global view.
export function globalColumns(kind?: any, sig?: any, scope?: any, columns = []) {
  if (!REDESIGN || !scope?.crossApp) return [];
  const info = r => globalInfo(lineageOf[kind]?.(r.id, sig), sig);
  const memo = new Map<any, any>(); const gi = r => { if (!memo.has(r.id)) memo.set(r.id, info(r)); return memo.get(r.id); };
  return [
    ...(columns.some(c => c.key === 'project') ? [] : [{ key: 'project', label: 'Project', sort: true, render: r => r.project && r.project !== 'Core' ? <span className="t-meta">{r.project}</span> : <span className="chip info" style={{ height: 20 }}>Core</span> }]),
    { key: '_dep', label: 'Depends on', priority: 40, sort: r => (gi(r)?.up || []).map(n => n.label).join(', ').toLowerCase() || null, render: r => { const g = gi(r); const xs = g?.up || []; return xs.length ? <span className="cp-clamp" title={xs.map(n => n.label).join(', ')}>{xs.map(n => n.label).join(', ')}</span> : <span className="muted">—</span>; } },
    { key: '_layers', label: 'Layers', align: 'r', priority: 40, sort: r => gi(r)?.layers.length || 0, render: r => <span className="num">{gi(r)?.layers.length || '—'}</span> },
    { key: '_sessions', label: 'Sessions', align: 'r', priority: 40, sort: r => gi(r)?.sessions.length || 0, render: r => { const n = gi(r)?.sessions.length || 0; return n ? <span className="num">{n}</span> : <span className="muted">—</span>; } },
  ];
}

/* ------------------------------------------------------------------ Overview sheet (dashboards) */
/* A numbered sheet for analytics pages: same rules as Datasheet sections, no index column.
   sections: [{ id, title, content, action, count, desc, flush }]. */
