// JsonEditor · CoreAstrum AI Studio, from the prototype's src/test-bench.jsx.
// Needs tokens.css and foundations.css once per app, plus JsonEditor.css.
import React from 'react';
import { cx } from './cx';

export interface JsonEditorProps {
  id?: string;
  label?: any;
  value?: any;
  onChange?: (...args: any[]) => any;
  rows?: number;
  error?: any;
  hint?: any;
}
// A JSON box that says whether it parses.
export function JsonEditor({ id, label, value, onChange, rows = 8, error, hint }: JsonEditorProps) {
  let ok = true; try { JSON.parse(value); } catch { ok = false; }
  const bad = error || (!ok && 'Not valid JSON');
  return (
    <div className="field">
      <div className="spread"><label htmlFor={id}>{label}</label><span className={cx('chip', bad ? 'bad' : 'ok')}><span className="d" />{bad ? 'Fix the payload' : 'Valid JSON'}</span></div>
      <textarea id={id} className="textarea mono" rows={rows} value={value} spellCheck={false} onChange={e => onChange(e.target.value)} />
      {bad ? <span className="err">{bad}</span> : hint ? <span className="hint">{hint}</span> : null}
    </div>
  );
}
