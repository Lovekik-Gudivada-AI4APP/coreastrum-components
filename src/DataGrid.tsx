// DataGrid · CoreAstrum AI Studio, from the prototype's src/kit.jsx.
// Needs tokens.css and foundations.css once per app, plus DataGrid.css.
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Search, Plus, RefreshCw, Eye, Pencil, Trash2, Inbox, ChevronLeft, ChevronRight, RotateCcw, Columns3, Check, Lock } from './icons';
import { useApp } from './app-context';
import { REDESIGN } from './design';
import * as D from './platform';
import { isA, ListLead } from './platform';
import { sleep } from './sleep';
import { cx } from './cx';
import { Icon } from './Icon';
import { Button } from './Button';
import { IconButton } from './IconButton';
import { SegmentedControl } from './SegmentedControl';
import { Switch } from './Switch';
import { withNameSort } from './withNameSort';
import { sortRows } from './sortRows';
import { Table } from './Table';
import { Dialog } from './Dialog';
import { Popover } from './Popover';
import { EmptyState } from './EmptyState';
import { SkeletonRows } from './SkeletonRows';
import { ActionsMenu } from './ActionsMenu';
import { setDensity, useDensity } from './setDensity';
import { useSignalCtx } from './useSignalCtx';
import { globalColumns } from './globalColumns';

const STATUS_KEY = /^(status|state|health|active|enabled|level|severity)$/i;

const META_KEY = /(updated|modified|created|date|time|At$|^at$|lastRun|last)/;

const NAME_KEY = /^(name|title|displayName|label|username)$/i;

function cardPlan(cols?: any) {
  const by = role => cols.find(c => c.card === role);
  const usable = cols.filter(c => c.card !== false && typeof c.label === 'string' && c.label);
  const title = by('title') || usable.find(c => NAME_KEY.test(c.key)) || cols[0];
  const id = by('id') || (cols[0] !== title ? cols[0] : null);
  const status = by('status') || usable.find(c => c !== title && c !== id && STATUS_KEY.test(c.key));
  const meta = by('meta') || usable.find(c => c !== title && c !== id && c !== status && META_KEY.test(c.key));
  const metric = by('metric') || usable.find(c => ![title, id, status, meta].includes(c) && c.align === 'r');
  return { title, id, status, metric, meta };
}

// Lower = hidden first when the table must shrink to keep the pinned actions column off the data.
const autoPriority = (c?: any, i?: any) => c.priority ?? (c.card === 'title' || c.card === 'status' || NAME_KEY.test(c.key) || STATUS_KEY.test(c.key) ? 100 : c.key === 'project' ? 1 : META_KEY.test(c.key) ? 2 : 5);

// Global view (redesign, All projects): a list that names its record kind gets Project, Depends on, Layers and Sessions columns.
export function DataGrid(props?: any) {
  return REDESIGN && props.globalKind ? <GlobalListView {...props} /> : <ListViewBase {...props} />;
}

interface GlobalListViewProps {
  globalKind?: any;
  columns?: any;
  [key: string]: any;
}
function GlobalListView({ globalKind, columns, ...props }: GlobalListViewProps) {
  const { scope } = useApp();
  const sig = useSignalCtx();
  const extra = scope?.crossApp ? globalColumns(globalKind, sig, scope, columns) : [];
  if (!extra.length) return <ListViewBase {...props} columns={columns} />;
  // Project sits right after the record's name; the global columns are never hidden to fit.
  const proj = columns.find(c => c.key === 'project') || extra.find(c => c.key === 'project');
  const rest = columns.filter(c => c.key !== 'project');
  const cols = [rest[0], { ...proj, keep: true }, ...rest.slice(1), ...extra.filter(c => c.key !== 'project').map(c => ({ ...c, keep: true }))];
  return <ListViewBase {...props} columns={cols} />;
}

interface ListViewBaseProps {
  rows?: any;
  columns?: any;
  searchKeys?: any[];
  placeholder?: string;
  filters?: any[];
  onOpen?: (...args: any[]) => any;
  onEdit?: (...args: any[]) => any;
  onDelete?: (...args: any[]) => any;
  onRestore?: (...args: any[]) => any;
  entity?: any;
  createLabel?: any;
  onCreate?: (...args: any[]) => any;
  createPerm?: any;
  updatePerm?: any;
  deletePerm?: any;
  projectScoped?: boolean;
  showCore?: boolean;
  pageSize?: number;
  extraActions?: any;
  menuActions?: any;
  emptyIcon?: any;
  emptyText?: any;
  toolbarExtra?: any;
  deleteText?: any;
  searchable?: boolean;
  canDelete?: any;
  listKey?: any;
  strip?: any;
  lockedColumns?: any;
  viewInline?: any;
}
function ListViewBase({ rows, columns, searchKeys = ['name'], placeholder = 'Search…', filters = [], onOpen, onEdit, onDelete, onRestore, entity = 'record',
  createLabel, onCreate, createPerm, updatePerm, deletePerm, projectScoped = true, showCore = true, pageSize = 10, extraActions, menuActions, emptyIcon = Inbox, emptyText, toolbarExtra, deleteText, searchable = true, canDelete, listKey, strip, lockedColumns, viewInline = REDESIGN }: ListViewBaseProps) {
  const { can, toast, path, scope } = useApp();
  // A page-level "project" filter would duplicate the built-in project scope filter: keep one.
  if (projectScoped) filters = filters.filter(f => f.key !== 'project');
  // C2 (redesign build): data belongs to the signed-in project. Only a cross-project session
  // (CROSS_APP.READ) sees the Project column and the "All projects" filter.
  const c2 = REDESIGN && scope ? scope : null;
  if (c2 && !c2.crossApp) { columns = columns.filter(c => c.key !== 'project'); filters = filters.filter(f => f.key !== 'project'); }
  const c2Own = r => r.accounts ? r.accounts.some(a => a.project === c2.own) : (!r.project || r.project === c2.own || r.project === 'Core');
  // Column visibility ("Columns" menu), remembered per list. A column with hidden:true starts hidden;
  // the first column is the record's identity and is always shown.
  const colKey = 'ca.lv.cols.' + (listKey || `${(path || '').split('?')[0].split('/')[1] || 'root'}.${entity}`);
  const hideable = columns.slice(1).filter(c => typeof c.label === 'string' && c.label);
  const [hidden, setHidden] = useState(() => {
    try { const v = JSON.parse(localStorage.getItem(colKey)); if (Array.isArray(v)) return new Set(v); } catch {}
    return new Set(columns.filter(c => c.hidden).map(c => c.key));
  });
  // Auto-fit: columns hidden only because the table is too narrow at this width; "keep" = the user re-showed them.
  const [auto, setAuto] = useState(() => new Set<any>());
  const [keep, setKeep] = useState(() => new Set<any>());
  const toggleCol = k => {
    if (auto.has(k)) { setKeep(s => new Set(s).add(k)); return; }
    setHidden(h => { const n = new Set(h); n.has(k) ? n.delete(k) : n.add(k); try { localStorage.setItem(colKey, JSON.stringify([...n])); } catch {} return n; });
    if (hidden.has(k)) setKeep(s => new Set(s).add(k));
  };
  const resetCols = () => { try { localStorage.removeItem(colKey); } catch {} setHidden(new Set(columns.filter(c => c.hidden).map(c => c.key))); setKeep(new Set<any>()); };
  const visibleCols = columns.filter((c, i) => i === 0 || (!hidden.has(c.key) && !auto.has(c.key)));
  const [density, setDensity] = useDensity();
  const [q, setQ] = useState('');
  const [fv, setFv] = useState({});
  const [proj, setProj] = useState('all');
  const [core, setCore] = useState(!c2);
  const [deleted, setDeleted] = useState(false);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [confirm, setConfirm] = useState(null);
  // Row selection for bulk actions (only offered when the list supports delete and the role may delete).
  const [sel, setSel] = useState(() => new Set<any>());
  const [refused, setRefused] = useState(null); // { r, why } when a record is still referenced
  const canBulkDelete = !!onDelete && can(deletePerm);
  const bulk = REDESIGN ? !deleted : canBulkDelete && !deleted;
  useEffect(() => setSel(new Set<any>()), [q, fv, proj, core, deleted, rows.length]);
  const [busy, setBusy] = useState(false);
  useEffect(() => { const t = setTimeout(() => setLoading(false), 420); return () => clearTimeout(t); }, []);
  useEffect(() => setPage(1), [q, fv, proj, core, deleted]);

  const filtered = useMemo(() => rows.filter(r => {
    if (!!r.isDeleted !== deleted) return false;
    if (q && !searchKeys.some(k => String(r[k] ?? '').toLowerCase().includes(q.toLowerCase()))) return false;
    for (const f of filters) if (fv[f.key] && fv[f.key] !== 'all' && String(r[f.key]) !== fv[f.key]) return false;
    if (c2) {
      if (projectScoped && r.project === 'Core' && c2.own !== 'Core' && !core) return false;
      if (projectScoped && r.project && r.project !== 'Core' && (c2.crossApp ? proj !== 'all' && r.project !== proj : r.project !== c2.own)) return false;
      if (projectScoped && proj !== 'all' && r.project === 'Core' && proj !== 'Core') return false;
      if (!projectScoped && !c2.crossApp && !c2Own(r)) return false;
    } else if (projectScoped) {
      if (!core && r.project === 'Core') return false;
      if (proj !== 'all' && r.project !== proj && r.project !== 'Core') return false;
    }
    return true;
  }), [rows, q, fv, proj, core, deleted]);
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  // Redesign: sorting orders every matching record, then the list pages them (not just the visible page).
  const [lsort, setLsort] = useState(null);
  const sortCols = useMemo(() => REDESIGN ? withNameSort(columns, rows) : columns, [columns, rows]);
  const ordered = useMemo(() => REDESIGN ? sortRows(filtered, sortCols, lsort) : filtered, [filtered, sortCols, lsort]);
  const onSort = REDESIGN ? s => { setLsort(s); setPage(1); } : undefined;
  const shown = ordered.slice((page - 1) * pageSize, page * pageSize);
  const refresh = async () => { setLoading(true); await sleep(450); setLoading(false); };

  // ---- auto-fit (T2): the pinned actions column may never cover a data column. When the table
  // overflows its panel, hide the lowest-priority visible column, one at a time, until it fits.
  const rootRef = useRef<any>(null);
  const [fitW, setFitW] = useState(0);
  useEffect(() => {
    const el = rootRef.current; if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(([e]: any) => setFitW(Math.round(e.contentRect.width))); ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const fitSig = [fitW, page, filtered.length, loading, density, [...hidden].join(), [...keep].join(), columns.map(c => c.key).join()].join('|');
  const sigRef = useRef<any>(null);
  useLayoutEffect(() => {
    if (sigRef.current !== fitSig) { sigRef.current = fitSig; if (auto.size) { setAuto(new Set<any>()); return; } }
    const wrap = rootRef.current?.querySelector('.lv-table .table-wrap');
    if (!wrap || !wrap.clientWidth || wrap.scrollWidth <= wrap.clientWidth + 1) return;
    const cand = columns.map((c, i) => [c, i]).filter(([c, i]: any) => i > 0 && !hidden.has(c.key) && !auto.has(c.key) && !keep.has(c.key) && !c.keep && autoPriority(c, i) < 100)
      .sort((a, b) => autoPriority(a[0], a[1]) - autoPriority(b[0], b[1]) || b[1] - a[1]);
    if (cand.length) setAuto(s => new Set(s).add(cand[0][0].key));
  });
  const offCount = hideable.filter(c => hidden.has(c.key) || auto.has(c.key)).length;

  // Extra row actions: icon buttons move into "…"; labelled buttons stay inline (revealed with Edit).
  const splitExtra = r => {
    const inline = [], menu = [];
    const walk = n => {
      if (n == null || n === false || n === true) return;
      if (Array.isArray(n)) return n.forEach(walk);
      if (n.type === React.Fragment) return walk(n.props.children);
      if (n.type === IconButton && n.props.label) { if (n.props.perm && !can(n.props.perm)) return; menu.push({ label: n.props.label, icon: n.props.icon, onClick: n.props.onClick, disabled: n.props.disabled, danger: /^delete/i.test(n.props.label) }); return; }
      // Redesign: only View stays on the row; a labelled button becomes a menu item ("Open" is View again).
      if (REDESIGN && n.type === Button) {
        const text = [].concat(n.props.children).filter(x => typeof x === 'string' || typeof x === 'number').join('').trim();
        if (!text || (n.props.perm && !can(n.props.perm))) return;
        if (/^(open|view)$/i.test(text) && onOpen) return;
        menu.push({ label: text, icon: n.props.icon, onClick: n.props.onClick, disabled: n.props.disabled, danger: /^delete/i.test(text) }); return;
      }
      inline.push(n);
    };
    walk(extraActions ? extraActions(r) : null);
    return [inline, menu];
  };
  const askDelete = r => { const why = canDelete && canDelete(r); why ? setRefused({ r, why }) : setConfirm(r); };
  const menuFor = (r, extraMenu) => {
    const own = (menuActions ? menuActions(r) : []).filter(Boolean);
    const dels = extraMenu.filter(m => m.danger), rest = extraMenu.filter(m => !m.danger);
    const canDel = onDelete && can(deletePerm);
    return [
      viewInline ? (onEdit && can(updatePerm) && { label: 'Edit', icon: Pencil, onClick: () => onEdit(r) }) : onOpen && { label: 'View', icon: Eye, onClick: () => onOpen(r) },
      ...own, ...rest,
      (canDel || dels.length) && { sep: true },
      ...dels,
      canDel && { label: 'Delete…', icon: Trash2, danger: true, onClick: () => askDelete(r) },
    ].filter(Boolean);
  };
  const actions = {
    key: '_actions', label: <span className="sr">Actions</span>, align: 'r', sticky: 'r', render: r => {
      if (deleted) return <div className="row lv-acts static" onClick={e => e.stopPropagation()}>{onRestore && <Button size="sm" icon={RotateCcw} perm={updatePerm} onClick={() => onRestore(r)}>Restore</Button>}</div>;
      const [inline, extraMenu] = splitExtra(r);
      return (
        <div className="row lv-acts" onClick={e => e.stopPropagation()}>
          {inline}
          {viewInline ? onOpen && <IconButton icon={Eye} size={15} label="View" onClick={() => onOpen(r)} /> : onEdit && can(updatePerm) && <IconButton icon={Pencil} size={15} label="Edit" onClick={() => onEdit(r)} />}
          <ActionsMenu label={`More actions for ${r.name || r.title || r.code || r.id}`} items={menuFor(r, extraMenu)} />
        </div>
      );
    },
  };
  const plan = cardPlan(columns);
  const cell = (c, r) => (c ? (c.render ? c.render(r) : r[c.key]) : null);

  return (
    <div className={cx('panel lv', strip && 'has-strip')} ref={rootRef} data-density={density}>
      {strip && (isA && strip.props && Array.isArray(strip.props.cells) ? <ListLead cells={strip.props.cells} /> : <div className="lv-strip">{strip}</div>)}
      <div className="toolbar lv-tb">
        <div className="lv-tb-main">
        {searchable && <div className="input-icon lv-search"><Icon icon={Search} size={14} /><input className="input" placeholder={placeholder} value={q} onChange={e => setQ(e.target.value)} aria-label={placeholder} /></div>}
        {filters.map(f => (
          <select key={f.key} className="select lv-filter" value={fv[f.key] || 'all'} onChange={e => setFv(v => ({ ...v, [f.key]: e.target.value }))} aria-label={f.label}>
            <option value="all">{f.label}: All</option>{f.options.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        ))}
        {projectScoped && !c2 && (
          <select className="select lv-filter" value={proj} onChange={e => setProj(e.target.value)} aria-label="Project">
            <option value="all">Project: All</option>{D.PROJECTS.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
          </select>
        )}
        {projectScoped && c2?.crossApp && (
          <select className="select lv-filter" value={proj} onChange={e => setProj(e.target.value)} aria-label="Project">
            <option value="all">All projects</option>{D.PROJECTS.map(p => { const k = p.id === 'core' ? 'Core' : p.name; return <option key={p.id} value={k}>{p.name}</option>; })}
          </select>
        )}
        {projectScoped && showCore && (!c2 || c2.own !== 'Core') && <label className="check lv-check"><Switch checked={core} onChange={setCore} label="Show core" />Show core</label>}
        {onRestore && <label className="check lv-check"><Switch checked={deleted} onChange={setDeleted} label="Show deleted" />Deleted</label>}
        {toolbarExtra}
        </div>
        <div className="lv-tb-end">
        <span className="t-meta num lv-count" aria-live="polite">{loading ? 'Loading…' : `${filtered.length} record${filtered.length === 1 ? '' : 's'}`}</span>
        <Popover align="right" width={240} trigger={({ toggle, open }: any) => <Button className="lv-cols-btn" icon={Columns3} onClick={toggle} aria-expanded={open} aria-haspopup="menu" title="Columns and row density" aria-label="Columns"><span className="lv-cols-txt">Columns</span>{offCount > 0 && <span className="lv-cols-n num">{hideable.length - offCount}/{hideable.length}</span>}</Button>}>
          <div role="menu" aria-label="Columns" className="lv-cols-menu">
            {hideable.length > 0 && <div className="menu-label">Show columns</div>}
            {lockedColumns && lockedColumns.map(l => (
              <div key={'lock-' + l} role="menuitemcheckbox" aria-checked="true" aria-disabled="true" className="menu-item lv-col-item lv-col-locked" title="Always shown; this column can't be hidden">
                <span className="lv-col-box" aria-hidden="true"><Icon icon={Check} size={12} /></span>{l}<Icon icon={Lock} size={12} className="lv-col-lock" />
              </div>
            ))}
            {hideable.map(c => {
              const on = !hidden.has(c.key) && !auto.has(c.key);
              return (
                <button key={c.key} type="button" role="menuitemcheckbox" className="menu-item lv-col-item" aria-checked={on} onClick={() => toggleCol(c.key)}>
                  <span className="lv-col-box" aria-hidden="true">{on && <Icon icon={Check} size={12} />}</span>{c.label}{auto.has(c.key) && <span className="lv-col-fit">hidden to fit</span>}
                </button>
              );
            })}
            {lockedColumns && hideable.length > 0 && <div className="lv-col-all">
              <Button size="sm" onClick={() => { const n = new Set<any>(); try { localStorage.setItem(colKey, '[]'); } catch {} setHidden(n); setKeep(new Set(hideable.map(c => c.key))); }}>Show all columns</Button>
              <Button size="sm" kind="ghost" onClick={() => { const n = new Set(hideable.map(c => c.key)); try { localStorage.setItem(colKey, JSON.stringify([...n])); } catch {} setHidden(n); }}>Hide all columns</Button>
            </div>}
            {hideable.length > 0 && <div className="menu-sep" />}
            <div className="menu-label">Row density <span className="lv-kbd-hint">⌘.</span></div>
            <div className="lv-density"><SegmentedControl label="Row density" options={[['comfortable', 'Comfortable'], ['compact', 'Compact']]} value={density} onChange={setDensity} /></div>
            {hideable.length > 0 && <><div className="menu-sep" />
            <button type="button" role="menuitem" className="menu-item" onClick={resetCols}>Reset to default</button></>}
          </div>
        </Popover>
        <IconButton icon={RefreshCw} label="Refresh" onClick={refresh} />
        {onCreate && <Button kind="primary" icon={Plus} perm={createPerm} onClick={onCreate}>{createLabel}</Button>}
        </div>
      </div>
      {loading ? <SkeletonRows n={6} /> : filtered.length === 0 ? (
        rows.length === 0 ? <EmptyState icon={emptyIcon} title={`No ${entity}s yet`} action={onCreate && can(createPerm) && <Button kind="primary" icon={Plus} onClick={onCreate}>{createLabel}</Button>}>{emptyText}</EmptyState>
          : <EmptyState icon={Search} title="No results" action={<Button onClick={() => { setQ(''); setFv({}); setProj('all'); setCore(true); setDeleted(false); }}>Clear filters</Button>}>Nothing matches the current search and filters.</EmptyState>
      ) : (
        <>
          {bulk && sel.size > 0 && (
            <div className="lv-bulk" role="region" aria-label="Bulk actions">
              <b className="num">{sel.size} selected</b>
              {canBulkDelete && <Button size="sm" kind="danger" icon={Trash2} onClick={() => setConfirm({ bulk: true, ids: [...sel] })}>Delete selected</Button>}
              <Button size="sm" kind="ghost" onClick={() => { const txt = filtered.filter(r => sel.has(r.id)).map(r => columns.map(c => String(r[c.key] ?? '')).join('\t')).join('\n'); navigator.clipboard?.writeText(txt).then(() => toast({ kind: 'ok', title: `Copied ${sel.size} row${sel.size === 1 ? '' : 's'}`, sub: 'Tab-separated, ready to paste into a spreadsheet.' }), () => toast({ kind: 'warn', title: 'Clipboard unavailable', sub: 'Your browser blocked copying.' })); }}>Copy rows</Button>
              <Button size="sm" kind="ghost" onClick={() => setSel(new Set<any>())}>Clear selection</Button>
            </div>
          )}
          <Table className="lv-table" dense={density === 'compact'} columns={[...(bulk ? [{ key: '_sel', label: <input type="checkbox" aria-label="Select all on this page" checked={shown.length > 0 && shown.every(r => sel.has(r.id))} onChange={e => setSel(s => { const n = new Set(s); shown.forEach(r => e.target.checked ? n.add(r.id) : n.delete(r.id)); return n; })} />, width: 36,
            render: r => <input type="checkbox" aria-label={`Select ${r.name || r.title || r.code || r.id}`} checked={sel.has(r.id)} onClick={e => e.stopPropagation()} onChange={e => setSel(s => { const n = new Set(s); e.target.checked ? n.add(r.id) : n.delete(r.id); return n; })} /> }] : []), ...visibleCols, actions]} rows={shown} onRow={onOpen} clip sort={lsort} onSort={onSort} />
          {/* Phones (T5): summary cards — title + identifier, status, one key metric, updated. */}
          <ul className="lv-cards" aria-label={`${entity}s`}>
            {shown.map(r => (
              <li key={r.id} className={cx('lv-card', onOpen && 'clickable')} onClick={onOpen ? () => onOpen(r) : undefined} tabIndex={onOpen ? 0 : undefined}
                role={onOpen ? 'link' : undefined} onKeyDown={onOpen ? e => { if (e.key === 'Enter') onOpen(r); } : undefined}>
                <div className="lv-card-h">
                  <div className="lv-card-t">{cell(plan.title, r)}</div>
                  {!deleted && <div className="lv-card-m" onClick={e => e.stopPropagation()}><ActionsMenu label={`Actions for ${r.name || r.title || r.code || r.id}`} items={[...(onEdit && can(updatePerm) ? [{ label: 'Edit', icon: Pencil, onClick: () => onEdit(r) }] : []), ...menuFor(r, splitExtra(r)[1])]} /></div>}
                  {deleted && onRestore && <div onClick={e => e.stopPropagation()}><Button size="sm" icon={RotateCcw} perm={updatePerm} onClick={() => onRestore(r)}>Restore</Button></div>}
                </div>
                {plan.id && <div className="lv-card-id">{cell(plan.id, r)}</div>}
                <div className="lv-card-f">
                  {plan.status && <span className="lv-card-s">{cell(plan.status, r)}</span>}
                  {plan.metric && <span className="lv-card-x"><span className="t-meta">{plan.metric.label}</span> <b className="num">{cell(plan.metric, r)}</b></span>}
                  {plan.meta && <span className="t-meta lv-card-u">{cell(plan.meta, r)}</span>}
                </div>
              </li>
            ))}
          </ul>
          <div className="pager">
            <span className="num">Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, filtered.length)} of {filtered.length}</span>
            <div className="pg-btns">
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)} aria-label="Previous page"><Icon icon={ChevronLeft} size={14} /></button>
              {Array.from({ length: pages }, (_, i) => i + 1).map(n => <button key={n} aria-current={n === page} onClick={() => setPage(n)}>{n}</button>)}
              <button disabled={page === pages} onClick={() => setPage(p => p + 1)} aria-label="Next page"><Icon icon={ChevronRight} size={14} /></button>
            </div>
          </div>
        </>
      )}
      {refused && (
        <Dialog title="Can’t delete yet" sub={refused.r.name || refused.r.title || refused.r.code || refused.r.id} onClose={() => setRefused(null)}
          footer={<Button kind="primary" onClick={() => setRefused(null)}>OK</Button>}>
          <p style={{ margin: 0 }}>{refused.why}</p>
        </Dialog>
      )}
      {confirm && (
        <Dialog title="Confirm Delete" sub={confirm.bulk ? `${confirm.ids.length} selected record${confirm.ids.length === 1 ? '' : 's'}` : (confirm.name || confirm.title || confirm.code || confirm.id)} onClose={() => setConfirm(null)}
          footer={<><Button kind="ghost" onClick={() => setConfirm(null)}>Cancel</Button><Button kind="danger solid" loading={busy} onClick={async () => { setBusy(true); await sleep(500); setBusy(false); if (confirm.bulk) { const skip = rows.filter(r => confirm.ids.includes(r.id) && canDelete && canDelete(r)); rows.filter(r => confirm.ids.includes(r.id) && !skip.includes(r)).forEach(r => onDelete(r)); if (skip.length) setTimeout(() => toast({ kind: 'warn', title: `${skip.length} not deleted`, sub: 'They are still referenced by other records.' }), 300); setSel(new Set<any>()); } else onDelete(confirm); setConfirm(null); toast({ kind: 'ok', title: confirm.bulk ? `${confirm.ids.length} ${entity}${confirm.ids.length === 1 ? '' : 's'} deleted` : `${entity[0].toUpperCase() + entity.slice(1)} deleted`, sub: confirm.bulk ? 'Restore them from the Deleted view.' : confirm.name }); }}>{busy ? 'Deleting...' : 'Delete'}</Button></>}>
          <p style={{ margin: 0 }}>{deleteText || `Are you sure you want to delete this ${entity}? This will mark it as deleted.`}</p>
        </Dialog>
      )}
    </div>
  );
}
