// kit: ListScreen · A module list page: title, the list toolbar (search, filters, ColumnChart), the table with checkboxes,
// funnel sort, View + ⋯ row actions and paging. Built from the prototype's PageLayout and DataGrid (src/kit.jsx).
import React from 'react';
import { Bot } from './icons';
import { PageLayout } from './PageLayout';
import { DataGrid } from './DataGrid';
import { StatusBadge } from './StatusBadge';
import { AGENTS } from './sample-data';

const COLUMNS = [
  { key: 'code', label: 'Agent Key', sort: true, render: r => <span className="mono">{r.code}</span> },
  { key: 'name', label: 'Name', render: r => <span className="cell-title">{r.name}</span> },
  { key: 'status', label: 'Status', sort: true, render: r => <StatusBadge s={r.status} /> },
  { key: 'model', label: 'Model', render: r => <span className="tag">{r.model}</span> },
  { key: 'runs', label: 'Runs (7d)', align: 'r', sort: true, render: r => <span className="num">{r.runs.toLocaleString()}</span> },
  { key: 'updated', label: 'Updated At', render: r => <span className="t-meta">{r.updated}</span> },
];

export interface ListScreenProps {
  rows?: any;
  onOpen?: (...args: any[]) => any;
  onEdit?: (...args: any[]) => any;
  onDelete?: (...args: any[]) => any;
  onCreate?: (...args: any[]) => any;
}
export function ListScreen({ rows = AGENTS, onOpen = () => {}, onEdit = () => {}, onDelete = () => {}, onCreate = () => {} }: ListScreenProps) {
  return (
    <PageLayout title="Agents" sub="Assistants that answer from your knowledge and act through tools" icon={Bot}>
      <DataGrid rows={rows} columns={COLUMNS} entity="agent" searchKeys={['code', 'name']} placeholder="Search agents..." projectScoped={false}
        filters={[{ key: 'status', label: 'Status', options: ['ACTIVE', 'RUNNING', 'DRAFT', 'FAILED', 'INACTIVE'] }]}
        onOpen={onOpen} onEdit={onEdit} onDelete={onDelete} createLabel="Create Agent" onCreate={onCreate} pageSize={5} lockedColumns={['Agent Key', 'Actions']} />
    </PageLayout>
  );
}
