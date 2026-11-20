// SidePanelItem · CoreAstrum AI Studio, from the prototype's src/ui.jsx.
// Needs tokens.css and foundations.css once per app, plus SidePanelItem.css.
import React from 'react';
import { Icon } from './Icon';
import { useSidePanel } from './useSidePanel';

export interface SidePanelItemProps {
  active?: any;
  onClick?: (...args: any[]) => any;
  icon?: React.ComponentType<any>;
  title?: any;
  sub?: any;
  right?: any;
  iconStyle?: any;
}
export function SidePanelItem({ active, onClick, icon, title, sub, right, iconStyle }: SidePanelItemProps) {
  const { setPaneOpen } = useSidePanel();
  return (
    <button className="pane-item" aria-current={active || undefined} onClick={() => { onClick(); if (window.innerWidth <= 860) setPaneOpen(false); }}>
      {icon && <span style={{ width: 28, height: 28, borderRadius: 7, display: 'grid', placeItems: 'center', background: 'var(--surface-3)', color: 'var(--ink-2)', flex: 'none', ...iconStyle }}><Icon icon={icon} size={15} /></span>}
      <span className="pi-main"><span className="pi-title">{title}</span>{sub && <span className="pi-sub">{sub}</span>}</span>
      {right}
    </button>
  );
}
