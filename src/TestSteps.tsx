// TestSteps · CoreAstrum AI Studio, from the prototype's src/test-bench.jsx.
// Needs tokens.css and foundations.css once per app, plus TestSteps.css.
import React from 'react';
import { CircleCheck, TriangleAlert, CircleX, Minus } from './icons';
import { cx } from './cx';
import { Icon } from './Icon';

// A checklist of what happened (or would happen): ok, warn, bad or skip, with a line of detail.
const STEP = { ok: [CircleCheck, 'var(--ok)', 'ok'], warn: [TriangleAlert, 'var(--warn)', 'check'], bad: [CircleX, 'var(--bad)', 'blocked'], skip: [Minus, 'var(--ink-4)', 'skipped'] };

export interface TestStepsProps {
  steps?: any;
}
export function TestSteps({ steps }: TestStepsProps) {
  return (
    <ol className="tb-steps">{steps.map((s, i) => { const [ico, col, word] = STEP[s.state] || STEP.ok; return (
      <li key={i}><Icon icon={ico} size={16} style={{ color: col }} /><div><b>{s.title}</b>{s.sub && <small>{s.sub}</small>}</div><span className={cx('chip', { ok: 'ok', warn: 'warn', bad: 'bad' }[s.state])}>{s.word || word}</span></li>); })}
    </ol>
  );
}
