// withNameSort · CoreAstrum AI Studio, from the prototype's src/ui.jsx.
// Needs tokens.css and foundations.css once per app.
import { REDESIGN } from './design';

// Redesign: every name column sorts (Name, Display Name, Unit Name…), A to Z.
export function withNameSort(columns?: any, rows?: any) {
  if (!REDESIGN) return columns;
  return columns.map(c => {
    if (c.sort || typeof c.label !== 'string' || !/\bname\b/i.test(c.label + ' ' + c.key.replace(/([a-z])([A-Z])/g, '$1 $2'))) return c;
    const v = r => { const x = r[c.key] ?? r.name ?? r.displayName; return typeof x === 'string' || typeof x === 'number' ? x : null; };
    return rows.some(r => v(r) != null) ? { ...c, sort: v } : c;
  });
}
