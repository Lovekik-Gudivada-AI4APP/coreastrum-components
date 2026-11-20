// Alert · CoreAstrum AI Studio, from the prototype's src/ui.jsx.
// Needs tokens.css and foundations.css once per app, plus Alert.css.
import React from 'react';
import { CircleCheck, CircleAlert, TriangleAlert, Info, Sparkles } from './icons';
import { cx } from './cx';
import { Icon } from './Icon';

export interface AlertProps {
  kind?: any;
  icon?: React.ComponentType<any>;
  title?: any;
  children?: any;
  action?: any;
}
export function Alert({ kind = 'info', icon, title, children, action }: AlertProps) {
  const ico = icon || { info: Info, warn: TriangleAlert, bad: CircleAlert, ok: CircleCheck, proposed: Sparkles }[kind];
  return (
    <div className={cx('callout', kind)} role={kind === 'bad' ? 'alert' : undefined}>
      <Icon icon={ico} size={16} className="c-ico" style={{ color: kind === 'proposed' ? 'var(--prov-proposed)' : `var(--${kind === 'bad' ? 'bad' : kind === 'warn' ? 'warn' : kind === 'ok' ? 'ok' : 'info'})` }} />
      <div style={{ flex: 1, minWidth: 0 }}>{title && <b>{title} </b>}{children}</div>
      {action}
    </div>
  );
}
