// kit: DashboardScreen · A module dashboard: the live strip of headline figures, then numbered sections with a chart,
// a share breakdown and a table. Built from the prototype's DashboardLayout and StatStrip (src/signal.jsx) and charts (src/ui.jsx).
import React from 'react';
import { Activity } from './icons';
import { PageLayout } from './PageLayout';
import { DashboardLayout } from './DashboardLayout';
import { StatStrip } from './StatStrip';
import { pulseCell } from './pulseCell';
import { healthCell } from './healthCell';
import { ColumnChart } from './ColumnChart';
import { ShareBarChart } from './ShareBarChart';
import { Table } from './Table';
import { StatusBadge } from './StatusBadge';
import { AGENTS, SERIES } from './sample-data';

export function DashboardScreen() {
  return (
    <PageLayout title="AI Observability" sub="Every AI call: what it cost, how long it took and what went off" icon={Activity}>
      <DashboardLayout live={<StatStrip cells={[pulseCell(SERIES, { k: 'Latest calls', noun: 'calls' }), healthCell(SERIES), { k: 'Calls · 7 d', v: <span className="num">12,480</span> }, { k: 'Spend · 7 d', v: <span className="num">$41.20</span> }]} />}
        sections={[
          { id: 'calls', title: 'Calls per day', content: <ColumnChart data={[1520, 1810, 1640, 2210, 1980, 1460, 1860]} labels={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']} h={180} /> },
          { id: 'models', title: 'Which models answered', content: <ShareBarChart items={[['Claude Sonnet 5', 46], ['GPT-4o mini', 31], ['Gemini 2.0 Flash', 23]]} /> },
          { id: 'agents', title: 'Busiest agents', flush: true, content: <Table columns={[{ key: 'name', label: 'Agent', render: r => <span className="cell-title">{r.name}</span> }, { key: 'status', label: 'Status', render: r => <StatusBadge s={r.status} /> }, { key: 'runs', label: 'Runs (7d)', align: 'r', sort: true, render: r => <span className="num">{r.runs.toLocaleString()}</span> }]} rows={AGENTS.slice(0, 5)} /> },
        ]} />
    </PageLayout>
  );
}
