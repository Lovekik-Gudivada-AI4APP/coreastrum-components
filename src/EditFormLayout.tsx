// EditFormLayout · CoreAstrum AI Studio, from the prototype's src/signal.jsx.
// Needs tokens.css and foundations.css once per app, plus EditFormLayout.css.
import React from 'react';
import { useApp } from './app-context';
import { REDESIGN } from './design';
import { STAGES, STAGE_BY_ID, isA, Brief, FlowMap, lineageToFlow } from './platform';
import { cx } from './cx';
import { MonoText } from './MonoText';
import { HealthIndicator } from './HealthIndicator';

/* ------------------------------------------------------------------ Lineage */
const KIND = {
  kb: ['Knowledge base', 'knowledge bases'], pipeline: ['Pipeline', 'pipelines'], pipelineRun: ['Run', 'runs'], artifact: ['Artifact', 'artifacts'], rag: ['RAG', 'RAGs'],
  agent: ['Agent', 'agents'], prompt: ['Prompt', 'prompts'], model: ['Model', 'models'], connection: ['Connection', 'connections'], evalSuite: ['Eval suite', 'eval suites'],
  evalRun: ['Eval run', 'eval runs'], conversation: ['Conversation', 'conversations'], source: ['Sources', 'sources'],
};

const kindLabel = (k?: any, n = 1) => (KIND[k] || [k, k + 's'])[n === 1 ? 0 : 1];

interface TicksProps {
  stage?: any;
}
// The stage tag's six-tick position map, small enough to sit in every node.
function Ticks({ stage }: TicksProps) {
  const st = STAGE_BY_ID[stage];
  if (!st) return null;
  return <span className="ln-ticks" title={`Stage ${st.n} of 6 · ${st.label}`} aria-label={`Stage ${st.label}`}>{STAGES.map(x => <i key={x.id} className={x.id === stage ? 'on' : undefined} />)}</span>;
}

interface LNodeProps {
  n?: any;
  onNav?: (...args: any[]) => any;
  compact?: any;
}
function LNode({ n, onNav, compact }: LNodeProps) {
  if (n.empty) return <div className={cx('ln ln-empty', compact && 'ln-c')}><span className="ln-k">{kindLabel(n.kind)}</span><span className="ln-why">{n.empty}</span></div>;
  const title = n.title || `${n.current ? 'This ' + kindLabel(n.kind).toLowerCase() : 'Open ' + kindLabel(n.kind).toLowerCase()} · ${n.label} · ${n.ident || ''}`;
  const inner = compact ? <>
    <span className="ln-top"><Ticks stage={n.stage} /><span className="ln-k">{kindLabel(n.kind)}</span><span className="ln-name">{n.label}</span><HealthIndicator h={n.health} live={n.live} /></span>
  </> : <>
    <span className="ln-top"><Ticks stage={n.stage} /><span className="ln-k">{n.current ? `This ${kindLabel(n.kind).toLowerCase()}` : kindLabel(n.kind)}</span><HealthIndicator h={n.health} live={n.live} /></span>
    <span className="ln-name">{n.label}</span>
    <span className="ln-id"><MonoText title="">{n.ident}</MonoText>{n.meta && <span className="ln-meta">{n.meta}</span>}</span>
  </>;
  const cls = cx('ln', n.current && 'ln-cur', compact && 'ln-c');
  if (n.current || !n.to) return <div className={cls} aria-current={n.current ? 'page' : undefined} title={title}>{inner}</div>;
  return <button type="button" className={cls} onClick={() => onNav(n.to)} title={title}>{inner}</button>;
}

interface ImpactListProps {
  title?: any;
  items?: any;
}
function ImpactList({ title, items }: ImpactListProps) {
  const { nav } = useApp();
  if (!items || !items.length) return null;
  return (
    <div className="cmp-imp">
      <div className="cmp-sub">{title}</div>
      <ul>{items.map((n, i) => <li key={n.id || i}>{n.empty ? <span className="cmp-none">{n.empty}</span> : <LNode n={n} onNav={nav} compact />}</li>)}</ul>
    </div>
  );
}

export function EditFormLayout(props?: any) {
  return isA ? <FusionComposer {...props} /> : <PlainComposer {...props} />;
}

interface FusionComposerProps {
  children?: any;
  checks?: any[];
  changes?: any;
  impact?: any;
}
function FusionComposer({ children, checks = [], changes, impact }: FusionComposerProps) {
  const todo = checks.filter(c => !c.ok);
  const lead = !checks.length ? [{ tone: 'ok', text: changes && changes.length ? 'Ready to save.' : 'Fill in the form below.' }]
    : todo.length ? [{ tone: 'warn', text: `${todo.length} thing${todo.length === 1 ? '' : 's'} to fix before you can save.` }, ` ${checks.length - todo.length} of ${checks.length} checks pass.`]
    : [{ tone: 'ok', text: 'Ready to save.' }, ` All ${checks.length} checks pass.`];
  const needs = todo.map((c, i) => ({ n: i + 1, tone: 'warn', text: c.label }));
  const body = changes ? (changes.length ? <>You changed {changes.length} field{changes.length === 1 ? '' : 's'}: {changes.map((c, i) => <React.Fragment key={c.label}>{i > 0 && ', '}<b>{c.label}</b> <span className="cmp-from">{c.from}</span> → <span className="cmp-to">{c.to}</span></React.Fragment>)}.</> : 'Nothing changed yet.') : null;
  const steps = impact ? [impact.up && impact.up.length ? impact.up : null, impact.down && impact.down.length ? impact.down : null].filter(Boolean) : [];
  const flow = steps.length ? lineageToFlow(steps, kindLabel) : null;
  return (
    <div className="fx-composer">
      <Brief compact lead={lead} body={body} needs={needs} />
      {flow && flow.steps.length > 0 && <FlowMap title="What this save touches" note={impact.note || 'Depends on → used by'} steps={flow.steps} />}
      <div className="cmp-form">{children}</div>
    </div>
  );
}

interface PlainComposerProps {
  children?: any;
  checks?: any[];
  changes?: any;
  impact?: any;
  title?: any;
}
function PlainComposer({ children, checks: checks0 = [], changes, impact, title = 'Before you save' }: PlainComposerProps) {
  // Redesign: no read-only "Ready to save" checklist; the form's own errors and the Save button say it.
  const checks = REDESIGN ? [] : checks0;
  const done = checks.filter(c => c.ok).length;
  if (REDESIGN && !changes) return <div className="cmp-wrap cmp-solo"><div className="cmp-form">{children}</div></div>;
  const all = checks.length && done === checks.length;
  return (
    <div className="cmp-wrap">
      <div className="cmp">
        <div className="cmp-form">{children}</div>
        <aside className="cmp-side" aria-label={title}>
          <div className="cmp-card">
            {checks.length > 0 && <div className="cmp-blk">
              <div className="cmp-h"><span>Ready to save</span><b className={cx('num', all ? 'ok' : 'todo')}>{done}/{checks.length}</b></div>
              <div className="cmp-bar" aria-hidden="true"><i style={{ width: `${checks.length ? (done / checks.length) * 100 : 0}%` }} /></div>
              <ul className="cmp-checks">{checks.map(c => <li key={c.label} data-ok={c.ok ? 'y' : 'n'}><span className="cmp-tick" aria-hidden="true" />{c.label}<span className="sr">{c.ok ? ' — done' : ' — to do'}</span></li>)}</ul>
            </div>}
            {changes && <div className="cmp-blk">
              <div className="cmp-h"><span>Changes</span><b className="num">{changes.length || 'None'}</b></div>
              {changes.length ? <ul className="cmp-diff">{changes.map(c => <li key={c.label}><span className="cmp-dk">{c.label}</span><span className="cmp-from">{c.from}</span><span className="cmp-to">{c.to}</span></li>)}</ul>
                : <p className="cmp-none">Nothing changed yet.</p>}
            </div>}
            {impact && (impact.up?.length || impact.down?.length || impact.note) ? <div className="cmp-blk">
              <div className="cmp-h"><span>Connected to</span></div>
              <ImpactList title="Depends on" items={impact.up} />
              <ImpactList title="Used by — affected when you save" items={impact.down} />
              {impact.note && <p className="cmp-note">{impact.note}</p>}
            </div> : null}
          </div>
        </aside>
      </div>
    </div>
  );
}
