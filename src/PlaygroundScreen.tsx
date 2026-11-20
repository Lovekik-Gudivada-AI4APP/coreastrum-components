// kit: PlaygroundScreen · A "try it before it goes live" test: the Test bench dialog with a payload on the left and a
// live, timed run with its log on the right. Built from the prototype's src/test-bench.jsx.
import React, { useState } from 'react';
import { FlaskConical, Play } from './icons';
import { Button } from './Button';
import { TestDialog } from './TestDialog';
import { JsonEditor } from './JsonEditor';
import { useRun } from './useRun';
import { RunTimeline } from './RunTimeline';

export function PlaygroundScreen() {
  const [open, setOpen] = useState(true);
  const [payload, setPayload] = useState('{\n  "case": "CR-0412",\n  "date": "2026-11-21",\n  "court": "Hall 3"\n}');
  const run = useRun();
  const go = () => run.start([
    { key: 'payload', label: 'Check the payload', run: async c => { await c.wait(350); try { JSON.parse(payload); return { detail: 'Valid JSON' }; } catch { return { state: 'bad', detail: 'The payload is not valid JSON', stop: true }; } } },
    { key: 'recipients', label: 'Resolve recipients', run: async c => { c.log('2 parties from LEGAL_DESK'); await c.wait(500); return { detail: '2 recipients' }; } },
    { key: 'render', label: 'Render email and in-app', run: async c => { await c.wait(450); return { state: 'warn', detail: 'WhatsApp template has no {{advocate}}' }; } },
    { key: 'policy', label: 'Check quiet hours', run: async c => { await c.wait(300); return { detail: 'Outside quiet hours' }; } },
  ]);
  if (!open) return <div className="pg"><Button kind="primary" icon={FlaskConical} onClick={() => setOpen(true)}>Test</Button></div>;
  return (
    <TestDialog title="Notification test" subject="HEARING_REMINDER" promise="Nothing is sent to real people." onClose={() => setOpen(false)}
      setup={<><JsonEditor id="pg-payload" label="Payload" value={payload} onChange={setPayload} rows={8} hint="Values fill the template variables." /><Button kind="primary" icon={Play} onClick={go} disabled={run.status === 'running'}>Run dry run</Button></>}>
      {run.status === 'idle' ? <p className="muted" style={{ margin: 0 }}>Run the dry run to see each step, timed, with its log.</p> : <RunTimeline run={run} title="Dry run" onCancel={run.cancel} />}
    </TestDialog>
  );
}
