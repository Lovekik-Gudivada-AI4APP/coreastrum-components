// IconButton · CoreAstrum AI Studio, from the prototype's src/ui.jsx.
// Needs tokens.css and foundations.css once per app, plus IconButton.css.
import React from 'react';
import { cx } from './cx';
import { Icon } from './Icon';

export interface IconButtonProps {
  icon?: React.ComponentType<any>;
  label?: any;
  onClick?: (...args: any[]) => any;
  pressed?: any;
  className?: string;
  size?: number;
  [key: string]: any;
}
export function IconButton({ icon, label, onClick, pressed, className, size = 16, ...rest }: IconButtonProps) {
  return (
    <button type="button" className={cx('icon-btn tip', className)} aria-label={label} data-tip={label} aria-pressed={pressed} onClick={onClick} {...rest}>
      <Icon icon={icon} size={size} />
    </button>
  );
}
