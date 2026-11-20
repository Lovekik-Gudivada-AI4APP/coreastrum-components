// DependencyChain · CoreAstrum AI Studio, from the prototype's src/signal.jsx.
// Needs tokens.css and foundations.css once per app, plus DependencyChain.css.
import React, { useState } from 'react';
import { ChevronDown, ArrowRight } from './icons';
import { useApp } from './app-context';
import { STAGES, STAGE_BY_ID } from './platform';
import { cx } from './cx';
import { MonoText } from './MonoText';
import { Icon } from './Icon';
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

interface LGroupProps {
  kind?: any;
  items?: any;
  onNav?: (...args: any[]) => any;
  compact?: any;
}
// A same-kind branch of several records: collapsed to "3 agents" with the worst health, expandable.
function LGroup({ kind, items, onNav, compact }: LGroupProps) {
  const [open, setOpen] = useState(false);
  const hs = items.map(x => x.health);
  const h = ['bad', 'warn', 'ok', 'idle'].find(x => hs.includes(x));
  const live = items.some(x => x.live);
  const off = items.filter(x => x.health === 'bad' || x.health === 'warn').length;
  const sum = off ? `${off} need${off === 1 ? 's' : ''} attention` : items.slice(0, 2).map(x => x.label).join(', ') + (items.length > 2 ? ` +${items.length - 2}` : '');
  return (
    <div className={cx('lg', open && 'open')}>
      <button type="button" className={cx('ln ln-group', compact && 'ln-c')} aria-expanded={open} onClick={() => setOpen(o => !o)} title={`${items.length} ${kindLabel(kind, 2)} · ${sum}`}>
        {compact
          ? <span className="ln-top"><Ticks stage={items[0].stage} /><span className="ln-k">{kindLabel(kind, 2)}</span><span className="ln-name"><span className="num">{items.length}</span><Icon icon={ChevronDown} size={13} className="lg-chev" /></span><HealthIndicator h={h} live={live} /></span>
          : <>
            <span className="ln-top"><Ticks stage={items[0].stage} /><span className="ln-k">{kindLabel(kind, 2)}</span><HealthIndicator h={h} live={live} /></span>
            <span className="ln-name"><span className="num">{items.length}</span> {kindLabel(kind, 2)}<Icon icon={ChevronDown} size={14} className="lg-chev" /></span>
            <span className="ln-id ln-sum">{sum}</span></>}
      </button>
      {open && <ul className="lg-list">{items.map(x => <li key={x.id}><LNode n={x} onNav={onNav} compact /></li>)}</ul>}
    </div>
  );
}

interface LStepProps {
  step?: any;
  onNav?: (...args: any[]) => any;
}
function LStep({ step, onNav }: LStepProps) {
  const xs = Array.isArray(step) ? step : [step];
  const kinds = [...new Set(xs.map(x => x.kind))];
  const fan = kinds.length > 1;
  const parts = kinds.map(k => {
    const items = xs.filter(x => x.kind === k);
    if (items.length === 1 || items.some(x => x.empty)) return items.map((x, i) => <LNode key={k + i} n={x} onNav={onNav} compact={fan} />);
    return <LGroup key={k} kind={k} items={items} onNav={onNav} compact={fan} />;
  });
  return <div className={cx('lstep', fan && 'fan')}>{parts}</div>;
}

const stagesOf = (step?: any) => [...new Set((Array.isArray(step) ? step : [step]).map(x => x.stage || (x.empty ? null : null)).filter(Boolean))].sort((a, b) => STAGE_BY_ID[a].n - STAGE_BY_ID[b].n);

export interface DependencyChainProps {
  steps?: any[];
  label?: any;
}
/* steps: [node | node[]] — arrays are parallel branches (fanned when they mix kinds).
   The chain is captioned with lifecycle stages where the stage changes. */

export function DependencyChain({ steps = [], label = 'Lineage' }: DependencyChainProps) {
  const { nav } = useApp();
  const list = steps.filter(s => s && (!Array.isArray(s) || s.length));
  if (!list.length) return null;
  const cur = list.findIndex(s => !Array.isArray(s) && s.current);
  let prev = '';
  return (
    <nav className="lineage" aria-label={label}>
      <ol>
        {list.map((s, i) => {
          const st = stagesOf(s); const sig = st.join();
          const cap = sig && sig !== prev ? st : null; if (sig) prev = sig;
          return (
            <li key={i} className={cx('lineage-li', Array.isArray(s) && new Set(s.map(x => x.kind)).size > 1 && 'has-fan', i === cur && 'is-cur', cur >= 0 && i < cur && 'is-up', cur >= 0 && i > cur && 'is-down')}>
              <span className="ln-stage" aria-hidden={!cap}>{cap && cap.map(x => <span key={x}><b className="num">{String(STAGE_BY_ID[x].n).padStart(2, '0')}</b>{STAGE_BY_ID[x].label}</span>)}</span>
              <span className="lineage-row">
                {i > 0 && <span className="lineage-arrow" aria-hidden="true"><Icon icon={ArrowRight} size={13} /></span>}
                <LStep step={s} onNav={nav} />
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
