// kit: FormScreen · A create / edit page: numbered form sections with compact headings, required fields, dropdowns,
// a toggle, and the sticky Cancel / Save bar. On edit, the side card lists the changes and what the record touches.
// Built from the prototype's EditFormLayout (src/signal.jsx), FormSection (src/kit.jsx) and FormField (src/ui.jsx).
import React, { useState } from 'react';
import { ArrowLeft, Bot } from './icons';
import { Icon } from './Icon';
import { Button } from './Button';
import { FormField } from './FormField';
import { Switch } from './Switch';
import { FormSection } from './FormSection';
import { EditFormLayout } from './EditFormLayout';
import { LINEAGE } from './sample-data';

export interface FormScreenProps {
  editing?: boolean;
  onCancel?: (...args: any[]) => any;
  onSave?: (...args: any[]) => any;
}
export function FormScreen({ editing = false, onCancel = () => {}, onSave = () => {} }: FormScreenProps) {
  const [f, setF] = useState({ key: editing ? 'fir_desk_triage' : '', name: editing ? 'FIR desk triage' : '', status: 'Active', project: 'Legal Assistant', active: true, desc: '' });
  const up = (k, v) => setF(x => ({ ...x, [k]: v }));
  const err = !f.key ? 'Enter an agent key.' : !/^[a-z0-9_]+$/.test(f.key) ? 'Use lowercase letters, digits and underscores.' : null;
  const changes = editing ? (f.name !== 'FIR desk triage' ? [{ label: 'Name', from: 'FIR desk triage', to: f.name || '—' }] : []) : null;
  return (
    <div className="pg">
      <div className="page-head"><div className="row" style={{ gap: 12 }}><button className="icon-btn" aria-label="Back" onClick={onCancel}><Icon icon={ArrowLeft} size={16} /></button><span className="id-ico"><Icon icon={Bot} size={19} /></span><h1 className="t-h1">{editing ? 'Edit FIR desk triage' : 'Create Agent'}</h1></div></div>
      <EditFormLayout changes={changes} impact={editing ? { up: LINEAGE[0], down: LINEAGE[2], note: 'Saving creates v5.' } : undefined}>
        <div className="panel"><div className="form-panel">
          <FormSection title="Identity" desc="The agent key is what a suite stores. Renaming it is refused while a suite targets it.">
            <FormField label="Agent Key *" htmlFor="fk" error={f.key ? err : null}><input id="fk" className="input mono" placeholder="fir_desk_triage" value={f.key} onChange={e => up('key', e.target.value)} aria-invalid={!!(f.key && err)} /></FormField>
            <FormField label="Name *" htmlFor="fn"><input id="fn" className="input" placeholder="FIR desk triage" value={f.name} onChange={e => up('name', e.target.value)} /></FormField>
            <FormField label="Status" htmlFor="fs"><select id="fs" className="select" value={f.status} onChange={e => up('status', e.target.value)}><option>Active</option><option>Inactive</option></select></FormField>
            <FormField label="Project" htmlFor="fp" hint="Locked after creation."><select id="fp" className="select" value={f.project} onChange={e => up('project', e.target.value)} disabled={editing}><option>Core (global)</option><option>Legal Assistant</option><option>Tallman Catalog</option></select></FormField>
            <div className="span2"><FormField label="Description" htmlFor="fd"><textarea id="fd" className="textarea" rows={3} placeholder="What this agent is for" value={f.desc} onChange={e => up('desc', e.target.value)} /></FormField></div>
          </FormSection>
          <FormSection title="Behaviour" desc="How the agent answers.">
            <FormField label="Model" htmlFor="fm" hint="Leave blank to use the run's model."><select id="fm" className="select"><option>Any model</option><option>Claude Sonnet 5</option><option>GPT-4o mini</option></select></FormField>
            <FormField label="Streaming"><label className="check"><Switch checked={f.active} onChange={v => up('active', v)} label="Stream responses" />Stream responses</label></FormField>
          </FormSection>
        </div>
        <div className="sticky-bar"><Button kind="ghost" onClick={onCancel}>Cancel</Button><Button kind="primary" disabled={!!err || !f.name} onClick={() => onSave(f)}>{editing ? 'Update Agent' : 'Create Agent'}</Button></div></div>
      </EditFormLayout>
    </div>
  );
}
