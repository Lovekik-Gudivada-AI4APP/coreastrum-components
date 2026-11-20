// Badge · CoreAstrum AI Studio, from the prototype's src/ui.jsx.
// Needs tokens.css and foundations.css once per app, plus Badge.css.
import React from 'react';
import { cx } from './cx';
import { Icon } from './Icon';

export interface BadgeProps {
  kind?: any;
  children?: any;
  icon?: React.ComponentType<any>;
}
export function Badge({ kind, children, icon }: BadgeProps) { return <span className={cx('chip', kind)}>{icon && <Icon icon={icon} size={12} />}{children}</span>; }
