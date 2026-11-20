// EmptyState · CoreAstrum AI Studio, from the prototype's src/ui.jsx.
// Needs tokens.css and foundations.css once per app, plus EmptyState.css.
import React from 'react';
import { Icon } from './Icon';

export interface EmptyStateProps {
  icon?: React.ComponentType<any>;
  title?: any;
  children?: any;
  action?: any;
}
export function EmptyState({ icon, title, children, action }: EmptyStateProps) {
  return (
    <div className="empty">
      {icon && <div className="em-ico"><Icon icon={icon} size={22} /></div>}
      <h3>{title}</h3>
      {children && <p>{children}</p>}
      {action}
    </div>
  );
}
