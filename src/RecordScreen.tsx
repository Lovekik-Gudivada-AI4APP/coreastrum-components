// kit: RecordScreen · A record's view page: head with actions, then the RecordView: lineage (what it depends on and
// what uses it), the live strip, and numbered sections with an index. Built from the prototype's src/signal.jsx.
import React from 'react';
import { Pencil, Play } from './icons';
import { PageHeader } from './PageHeader';
import { Button } from './Button';
import { StatusBadge } from './StatusBadge';
import { RecordView } from './RecordView';
import { DependencyChain } from './DependencyChain';
import { StatStrip } from './StatStrip';
import { pulseCell } from './pulseCell';
import { healthCell } from './healthCell';
import { DetailsList } from './DetailsList';
import { SERIES, LINEAGE } from './sample-data';

export interface RecordScreenProps {
  series?: any;
  lineage?: any;
}
export function RecordScreen({ series = SERIES, lineage = LINEAGE }: RecordScreenProps) {
  return (
    <div className="pg">
      <PageHeader title="FIR desk triage" sub="Triage incoming complaints at the FIR desk." actions={<><Button icon={Play}>Test</Button><Button kind="primary" icon={Pencil}>Edit</Button></>}><StatusBadge s="ACTIVE" /></PageHeader>
      <RecordView lineage={<DependencyChain steps={lineage} />}
        live={<StatStrip cells={[pulseCell(series, { k: 'Last 22 calls', noun: 'calls' }), healthCell(series), { k: 'p50 latency', v: <span className="num">1.2 s</span> }, { k: 'Cost · 7 d', v: <span className="num">$4.12</span> }]} />}
        sections={[
          { id: 'overview', title: 'Overview', content: <DetailsList items={[['Project', 'Legal Assistant'], ['Model', 'Claude Sonnet 5'], ['Agent key', 'fir_desk_triage', { mono: true }], ['Status', <StatusBadge s="ACTIVE" />], ['Created at', '11 Oct 2026'], ['Version', 'v4']]} /> },
          { id: 'prompt', title: 'System prompt', content: <pre className="ds-pre mono">You are the FIR desk assistant at a police station.{'\n'}Read the complainant's account and decide whether to register a Zero FIR.</pre> },
          { id: 'tools', title: 'Tools', count: 2, content: <DetailsList items={[['register_zero_fir', 'Registers a Zero FIR and transfers it'], ['lookup_bns_section', 'Finds the BNS section for an offence']]} /> },
        ]} />
    </div>
  );
}
