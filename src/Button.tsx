// Button · CoreAstrum AI Studio, from the prototype's src/ui.jsx.
// Needs tokens.css and foundations.css once per app, plus Button.css.
import React from 'react';
import { useApp } from './app-context';
import { cx } from './cx';
import { Icon } from './Icon';

export interface ButtonProps {
  kind?: any;
  size?: any;
  icon?: React.ComponentType<any>;
  children?: any;
  perm?: any;
  loading?: any;
  disabled?: any;
  className?: string;
  onClick?: (...args: any[]) => any;
  type?: any;
  title?: any;
  [key: string]: any;
}
export function Button({ kind, size, icon, children, perm, loading, disabled, className, onClick, type = 'button', title, ...rest }: ButtonProps) {
  const { can } = useApp();
  const blocked = perm && !can(perm);
  const cls = cx('btn', kind, size, className, blocked && 'tip');
  return (
    <button type={type} className={cls} disabled={disabled || loading || blocked} onClick={onClick}
      data-tip={blocked ? `Requires ${perm}` : undefined} title={title} aria-busy={loading || undefined} {...rest}>
      {loading ? <span className="spin" /> : icon ? <Icon icon={icon} size={size === 'sm' ? 13 : 15} /> : null}
      {children}
    </button>
  );
}
