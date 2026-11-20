// sortRows · CoreAstrum AI Studio, from the prototype's src/ui.jsx.
// Needs tokens.css and foundations.css once per app.
import { REDESIGN } from './design';

// Orders every row by one column. Text compares by letters, not case, and numbers inside text in order.
export function sortRows(rows?: any, columns?: any, sort?: any) {
  if (!sort) return rows;
  const col = columns.find(c => c.key === sort.key);
  const get = col?.sort === true ? r => r[col.key] : col?.sort;
  if (!get) return rows;
  return [...rows].sort((a, b) => {
    const x = get(a), y = get(b);
    if (x == null) return 1; if (y == null) return -1;
    const c = REDESIGN && typeof x === 'string' && typeof y === 'string' ? x.localeCompare(y, undefined, { sensitivity: 'base', numeric: true }) : x > y ? 1 : x < y ? -1 : 0;
    return c * (sort.dir === 'asc' ? 1 : -1);
  });
}
