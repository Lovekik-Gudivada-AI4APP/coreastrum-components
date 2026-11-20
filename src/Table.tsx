// Table · CoreAstrum AI Studio, from the prototype's src/ui.jsx.
// Needs tokens.css and foundations.css once per app, plus Table.css.
import React, { useMemo, useState } from 'react';
import { ArrowUp, ArrowDown, Filter } from './icons';
import { REDESIGN } from './design';
import { cx } from './cx';
import { Icon } from './Icon';
import { useScrollCue } from './useScrollCue';
import { withNameSort } from './withNameSort';
import { sortRows } from './sortRows';

// Sortable table. columns: [{key,label,render,sort,align,width,wrap,max,tip,sticky}]
// clip (default on, §9 T1): cells stay on one line (ellipsis + tooltip) unless the column sets wrap:true.
// A column with sticky:'r' stays pinned to the right edge (row actions); the frame shows
// edge fades / a pinned-column shadow whenever the table scrolls horizontally.
function clipTitle(e?: any) {
  const el = e.currentTarget;
  if (el.dataset.fixedTip) return;
  const cut = el.scrollWidth > el.clientWidth + 1 || [...el.querySelectorAll('*')].some(n => n.scrollWidth > n.clientWidth + 1 && getComputedStyle(n).overflow === 'hidden');
  if (cut) el.title = el.textContent.trim(); else el.removeAttribute('title');
}

export interface TableProps {
  columns?: any;
  rows?: any;
  onRow?: (...args: any[]) => any;
  selectedId?: any;
  empty?: any;
  initialSort?: any;
  dense?: any;
  rowKey?: any;
  clip?: boolean;
  className?: string;
  sort?: any;
  onSort?: (...args: any[]) => any;
}
// sort/onSort: a list that pages its rows sorts all of them itself and passes the current page here.
export function Table({ columns: columns0, rows, onRow, selectedId, empty, initialSort, dense, rowKey = 'id', clip = true, className, sort: sortCtl, onSort }: TableProps) {
  const columns = useMemo(() => withNameSort(columns0, rows), [columns0, rows]);
  const [sortOwn, setSortOwn] = useState(initialSort || null);
  const sort = onSort ? sortCtl : sortOwn;
  const setSort = onSort ? f => onSort(typeof f === 'function' ? f(sortCtl) : f) : setSortOwn;
  const [ref, cue, measure] = useScrollCue();
  const sorted = useMemo(() => onSort ? rows : sortRows(rows, columns, sort), [rows, sort, columns, onSort]);
  if (!rows.length && empty) return empty;
  const hasSticky = columns.some(c => c.sticky === 'r');
  const cellCls = c => cx(c.align === 'r' && 'r', c.sticky === 'r' && 'sticky-r', c.wrap && 'wrap') || undefined;
  const body = (c, r) => {
    const v = c.render ? c.render(r) : r[c.key];
    if (!clip || c.wrap || c.sticky || c.key === '_sel') return v;
    const tip = c.tip ? c.tip(r) : undefined;
    return <div className="cell-clip" style={c.max ? { maxWidth: c.max } : undefined} title={tip} data-fixed-tip={tip ? '1' : undefined} onMouseEnter={tip ? undefined : clipTitle}>{v}</div>;
  };
  return (
    <div className={cx('table-frame', clip && 'clip', hasSticky && 'has-sticky', className)} data-more-l={cue.l || undefined} data-more-r={cue.r || undefined}>
      <div className="table-wrap" ref={ref} onScroll={measure}>
        <table className={cx('table', dense && 'dense')}>
          <thead><tr>
            {columns.map(c => (
              <th key={c.key} className={cellCls(c)} style={{ width: c.width }} aria-sort={sort?.key === c.key ? (sort.dir === 'asc' ? 'ascending' : 'descending') : undefined}>
                {c.sort ? (
                  <button onClick={() => setSort(s => ({ key: c.key, dir: s?.key === c.key && s.dir === 'desc' ? 'asc' : 'desc' }))}
                    className={REDESIGN ? cx('th-sort', sort?.key === c.key && 'on') : undefined} title={REDESIGN ? `Sort by ${c.label}` : undefined}>
                    {c.label}
                    {REDESIGN && <Icon icon={Filter} size={12} className="th-sort-ic" />}
                    {sort?.key === c.key && <Icon icon={sort.dir === 'asc' ? ArrowUp : ArrowDown} size={11} />}
                  </button>
                ) : c.label}
              </th>
            ))}
          </tr></thead>
          <tbody>
            {sorted.map(r => (
              <tr key={r[rowKey]} className={onRow ? 'clickable' : undefined} aria-selected={selectedId === r[rowKey] || undefined}
                onClick={onRow ? () => onRow(r) : undefined} tabIndex={onRow ? 0 : undefined}
                onKeyDown={onRow ? e => { if (e.key === 'Enter') onRow(r); } : undefined}>
                {columns.map(c => <td key={c.key} data-label={typeof c.label === 'string' && c.label ? c.label : undefined} className={cx(c.align === 'r' && 'r num', c.sticky === 'r' && 'sticky-r', c.wrap && 'wrap') || undefined}>{body(c, r)}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
