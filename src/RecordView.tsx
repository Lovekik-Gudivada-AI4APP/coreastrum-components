// RecordView · CoreAstrum AI Studio, from the prototype's src/signal.jsx.
// Needs tokens.css and foundations.css once per app, plus RecordView.css.
import React, { useEffect, useRef, useState } from 'react';
import { useApp } from './app-context';
import { REDESIGN } from './design';
import { STAGES, STAGE_BY_ID, isA, Brief, FlowMap, lineageToFlow, briefFromCells } from './platform';
import { cx } from './cx';
import { MonoText } from './MonoText';
import { useSignalCtx } from './useSignalCtx';
import { HealthIndicator } from './HealthIndicator';
import { DetailsList } from './DetailsList';
import { globalInfo } from './globalInfo';

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

/* ------------------------------------------------------------------ Datasheet */
/* sections: [{ id, title, content, action, count, flush }]. focus: a section id to open at (e.g. from ?tab=). */
export function RecordView(props?: any) {
  if (isA && !props.plain) return <FusionSheet {...props} />;
  return <PlainSheet {...props} />;
}

interface FusionSheetProps {
  sections?: any;
  live?: any;
  lineage?: any;
  focus?: any;
  label?: any;
  fx?: Record<string, any>;
}
/* Design A: what is going on (sentences + numbered problems) → the record as a flow → the full record. */
function FusionSheet({ sections, live, lineage, focus, label, fx = {} }: FusionSheetProps) {
  const steps = lineage && lineage.props && Array.isArray(lineage.props.steps) ? lineage.props.steps : null;
  const flow = steps ? lineageToFlow(steps, kindLabel) : { steps: [], needs: [] };
  const cells = live && live.props && Array.isArray(live.props.cells) ? live.props.cells : [];
  const { nav } = useApp();
  const needs = (fx.needs || flow.needs).map(n => ({ ...n, action: n.action || (n.to ? <button type="button" className="btn sm" onClick={() => nav(n.to)}>Open</button> : null) }));
  const b = briefFromCells(cells, needs);
  return (
    <div className="fx-sheet">
      {fx.brief || <Brief lead={fx.lead || b.lead} body={fx.body !== undefined ? fx.body : b.body} needs={needs} facts={fx.facts || b.facts} />}
      {!fx.brief && live && !cells.length && <div className="ds-live" style={{ marginBottom: 14 }}>{live}</div>}
      {fx.map || (flow.steps.length > 1 && <FlowMap title={fx.mapTitle || 'Where it sits'} note="Click a step to open that record" steps={flow.steps} />)}
      {!steps && lineage && <div className="ds-lineage" style={{ marginBottom: 14 }}>{lineage}</div>}
      {fx.inspector}
      <div className="fx-rest-h">Full record</div>
      <PlainSheet sections={sections} focus={focus} label={label} />
    </div>
  );
}

interface PlainSheetProps {
  sections?: any;
  live?: any;
  lineage?: any;
  focus?: any;
  label?: any;
}
function PlainSheet({ sections, live, lineage, focus, label = 'Record sections' }: PlainSheetProps) {
  const gsec = useGlobalSection(lineage);
  const list = [gsec, ...sections.filter(Boolean)].filter(Boolean);
  const [active, setActive] = useState(list[0]?.id);
  const ids = list.map(s => s.id).join('|');
  useEffect(() => {
    const root = document.getElementById('main-scroll');
    if (!root) return;
    const on = () => {
      let cur = list[0]?.id;
      for (const s of list) { const el = document.getElementById('ds-' + s.id); if (el && el.getBoundingClientRect().top < 150) cur = s.id; }
      if (root.scrollTop + root.clientHeight >= root.scrollHeight - 4) cur = list[list.length - 1]?.id;
      setActive(cur);
    };
    on();
    root.addEventListener('scroll', on, { passive: true });
    return () => root.removeEventListener('scroll', on);
  }, [ids]);
  const focused = useRef<any>(null);
  useEffect(() => {
    if (!focus || focused.current === focus) return;
    focused.current = focus;
    const t = setTimeout(() => document.getElementById('ds-' + focus)?.scrollIntoView({ block: 'start' }), 60);
    return () => clearTimeout(t);
  }, [focus]);
  const go = id => { setActive(id); document.getElementById('ds-' + id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); };
  return (
    <article className="ds">
      {lineage && <div className="ds-lineage">{lineage}</div>}
      {live && <div className="ds-live">{live}</div>}
      <div className="ds-body">
        <nav className="ds-index" aria-label={label}>
          <ol>
            {list.map((s, i) => (
              <li key={s.id}><button type="button" aria-current={active === s.id ? 'true' : undefined} onClick={() => go(s.id)}>
                <span className="ds-n num">{String(i + 1).padStart(2, '0')}</span><span className="ds-t">{s.title}</span>{s.count != null && <span className="ds-c num">{s.count}</span>}
              </button></li>
            ))}
          </ol>
        </nav>
        <div className="ds-secs">
          {list.map((s, i) => (
            <section key={s.id} id={'ds-' + s.id} className={cx('ds-sec', s.flush && 'flush')} aria-labelledby={'dsh-' + s.id}>
              <header className="ds-h">
                <h2 id={'dsh-' + s.id}><span className="ds-n num">{String(i + 1).padStart(2, '0')}</span>{s.title}{s.count != null && <span className="ds-c num">{s.count}</span>}</h2>
                <span className="ds-rule" aria-hidden="true" />
                {s.action && <div className="ds-act">{s.action}</div>}
              </header>
              {s.desc && <p className="ds-desc">{s.desc}</p>}
              <div className="ds-content">{s.content}</div>
            </section>
          ))}
        </div>
      </div>
    </article>
  );
}

interface ImpactListProps {
  title?: any;
  items?: any;
}
/* ------------------------------------------------------------------ Composer (forms) */
/* Wraps a create/edit form: the form on the left, a sticky panel on the right with
   - Ready to save: required checks ([{ label, ok }]) and how many are done
   - Changes: what this save will change ([{ label, from, to }] — use diffFields)
   - Connected to: the records this one depends on / that depend on it ({ up: nodes, down: nodes, note })
   Section headers inside the form are numbered automatically (FormSection). */

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

interface GlobalBodyProps {
  g?: any;
}
function GlobalBody({ g }: GlobalBodyProps) {
  const { nav, db } = useApp();
  const agentName = id => db.agents.find(a => a.id === id)?.name || id;
  const when = t => new Date(t).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
  return (
    <div className="gv">
      <DetailsList items={[['Project', g.project === 'Core' ? <span className="chip info" style={{ height: 20 }}>Core</span> : g.project], ['Dependency layers', g.layers.length],
        ['Depends on', g.up.length], ['Used by', g.down.length], ['Sessions', g.sessions.length], ['Projects in these sessions', [...new Set(g.sessions.map(v => v.project || 'Core'))].join(', ') || null, { none: 'None' }]]} />
      <div className="gv-cols">
        <ImpactList title="Depends on" items={g.up.length ? g.up : [{ empty: 'Nothing; this is where the chain starts' }]} />
        <ImpactList title="Used by" items={g.down.length ? g.down : [{ empty: 'Nothing uses this yet' }]} />
      </div>
      <div className="cmp-sub">Dependency layers</div>
      <ol className="gv-layers">{g.layers.map((st, i) => { const xs = (Array.isArray(st) ? st : [st]); return (
        <li key={i} className={cx(!Array.isArray(st) && st.current && 'cur')}><span className="gv-ln num">L{i + 1}</span>
          <div className="gv-nodes">{xs.map((n, j) => <LNode key={n.id || j} n={n} onNav={nav} compact />)}</div></li>); })}</ol>
      <div className="cmp-sub">Sessions <span className="num t-meta">{g.sessions.length}</span></div>
      {g.sessions.length ? <div className="gv-sess" role="table" aria-label="Sessions">
        <div className="gv-sr gv-sh" role="row"><span>Session</span><span>Agent</span><span>Project</span><span>User</span><span>Last activity</span></div>
        {g.sessions.map(v => <button key={v.id} type="button" className="gv-sr" role="row" onClick={() => nav('/conversations/' + v.id)}>
          <span className="cell-title">{v.title}</span><span>{agentName(v.agentId)}</span><span>{v.project || 'Core'}</span><span>{v.user || '—'}</span><span className="t-meta num">{when(v.updatedAt)}</span></button>)}
      </div> : <p className="cmp-none">No session has used this yet.</p>}
    </div>
  );
}

function useGlobalSection(lineage?: any) {
  const { scope } = useApp();
  const c = useSignalCtx();
  if (!REDESIGN || !scope?.crossApp) return null;
  const steps = lineage && lineage.props && Array.isArray(lineage.props.steps) ? lineage.props.steps : null;
  const g = steps && globalInfo(steps, c);
  if (!g) return null;
  return { id: 'global', title: 'Global view: project, dependencies and sessions', count: g.sessions.length || undefined,
    desc: 'Across all projects: what this depends on, what uses it, the layers between them, and every session that ran through it.', content: <GlobalBody g={g} /> };
}
