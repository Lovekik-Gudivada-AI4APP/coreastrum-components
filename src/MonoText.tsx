// MonoText · CoreAstrum AI Studio, from the prototype's src/ui.jsx.
// Needs tokens.css and foundations.css once per app, plus MonoText.css.
import React from 'react';
import { cx } from './cx';

export interface MonoTextProps {
  children?: any;
  className?: string;
  title?: any;
}
export function MonoText({ children, className, title }: MonoTextProps) {
  const v = children == null ? '' : String(children);
  const parts = v.split(/(?<=[._/:])/);
  return <span className={cx('code-text', className)} title={title ?? (v.length > 18 ? v : undefined)}>{parts.map((p, i) => <React.Fragment key={i}>{p}{i < parts.length - 1 && <wbr />}</React.Fragment>)}</span>;
}

/* =========================================================================
   Primitives
   ========================================================================= */
