// ProgressBar · CoreAstrum AI Studio, from the prototype's src/ui.jsx.
// Needs tokens.css and foundations.css once per app, plus ProgressBar.css.
import React from 'react';
import { cx } from './cx';

export interface ProgressBarProps {
  value?: any;
  kind?: any;
  indeterminate?: any;
  label?: any;
}
export function ProgressBar({ value, kind, indeterminate, label }: ProgressBarProps) {
  return (
    <div className={cx('bar', kind, indeterminate && 'indeterminate')} role="progressbar" aria-valuenow={indeterminate ? undefined : Math.round(value)} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
      <i style={{ width: `${Math.max(0, Math.min(100, value || 0))}%` }} />
    </div>
  );
}
