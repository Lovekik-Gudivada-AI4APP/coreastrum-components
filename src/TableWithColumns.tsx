// TableWithColumns · CoreAstrum AI Studio, new in the CoreAstrum component library (built on the prototype's parts).
// Needs tokens.css and foundations.css once per app, plus TableWithColumns.css.
import React, { useState } from 'react';
import { Table } from './Table';
import { SearchInput } from './SearchInput';
import { ColumnSelector } from './ColumnSelector';

export interface TableWithColumnsProps {
  columns?: any[];
  rows?: any[];
  searchKeys?: any[];
  placeholder?: string;
  onRow?: (...args: any[]) => any;
  defaultHidden?: any[];
  empty?: any;
}
// A table with its own toolbar: search, the column selector, and the rows. ColumnChart follow the Table format
// ({ key, label, render, sort, align }); add locked: true to keep a column on.
export function TableWithColumns({ columns = [], rows = [], searchKeys = ['name'], placeholder = 'Search…', onRow, defaultHidden = [], empty }: TableWithColumnsProps) {
  const [q, setQ] = useState('');
  const [hidden, setHidden] = useState(defaultHidden);
  const ql = q.trim().toLowerCase();
  const filtered = !ql ? rows : rows.filter(r => searchKeys.some(k => String(r[k] ?? '').toLowerCase().includes(ql)));
  const visible = columns.filter(c => c.locked || !hidden.includes(c.key));
  return (
    <div className="lib-twc">
      <div className="toolbar lib-twc-bar">
        <SearchInput value={q} onChange={setQ} placeholder={placeholder} />
        <span className="t-meta num">{filtered.length} records</span>
        <ColumnSelector columns={columns.map(c => ({ key: c.key, label: typeof c.label === 'string' ? c.label : c.key, locked: c.locked }))} hidden={hidden} onChange={setHidden} defaultHidden={defaultHidden} />
      </div>
      <Table columns={visible} rows={filtered} onRow={onRow} empty={empty} />
    </div>
  );
}
