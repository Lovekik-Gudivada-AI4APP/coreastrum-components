// NameWithIcon · CoreAstrum AI Studio, from the prototype's src/kit.jsx.
// Needs tokens.css and foundations.css once per app, plus NameWithIcon.css.
import React from 'react';
import { Icon } from './Icon';

export interface NameWithIconProps {
  title?: any;
  sub?: any;
  icon?: React.ComponentType<any>;
}
export const NameWithIcon = ({ title, sub, icon }: NameWithIconProps) => (
  <div className="row" style={{ gap: 10 }}>
    {icon && <span style={{ width: 30, height: 30, borderRadius: 6, display: 'grid', placeItems: 'center', background: 'var(--surface-3)', color: 'var(--ink-2)', flex: 'none' }}><Icon icon={icon} size={15} /></span>}
    <div style={{ minWidth: 0 }}><div className="cell-title">{title}</div>{sub && <div className="cell-sub mono">{sub}</div>}</div>
  </div>
);
