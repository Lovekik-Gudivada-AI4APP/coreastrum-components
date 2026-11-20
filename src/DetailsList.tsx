// DetailsList · CoreAstrum AI Studio, from the prototype's src/signal.jsx.
// Needs tokens.css and foundations.css once per app, plus DetailsList.css.
import React from 'react';
import { cx } from './cx';
import { MonoText } from './MonoText';

export interface DetailsListProps {
  items?: any;
  cols?: any;
}
/* ------------------------------------------------------------------ Spec */
/* items: [[label, value, { mono, wide, hint }]] — hairline-ruled, labels aligned. */
export function DetailsList({ items, cols }: DetailsListProps) {
  return (
    <dl className="spec" data-cols={cols}>
      {items.filter(Boolean).map(([k, v, o = {}]: any) => (
        <div key={k} className={cx('spec-i', o.wide && 'wide')}>
          <dt>{k}</dt>
          <dd className={o.mono && v != null && v !== '' ? 'mono' : undefined}>{v == null || v === '' ? <span className="spec-none">{o.none || 'Not set'}</span> : o.mono && typeof v === 'string' ? <MonoText>{v}</MonoText> : v}{o.hint && <span className="spec-hint">{o.hint}</span>}</dd>
        </div>
      ))}
    </dl>
  );
}
