// SidePanel · CoreAstrum AI Studio, from the prototype's src/ui.jsx.
// Needs tokens.css and foundations.css once per app, plus SidePanel.css.
import React from 'react';
import { cx } from './cx';
import { useSidePanel } from './useSidePanel';

export interface SidePanelProps {
  title?: any;
  action?: any;
  search?: any;
  onSearch?: (...args: any[]) => any;
  children?: any;
  footer?: any;
  placeholder?: string;
}
// Module secondary pane: title, optional action, search, then children.
export function SidePanel({ title, action, search, onSearch, children, footer, placeholder }: SidePanelProps) {
  const { paneOpen } = useSidePanel();
  return (
    <aside className={cx('pane', !paneOpen && 'collapsed')} aria-label={title + ' navigation'}>
      <div className="pane-head">
        <div className="pane-title"><h2 className="t-h2">{title}</h2>{action}</div>
        {onSearch && <div className="input-icon"><SearchGlyph /><input className="input" placeholder={placeholder || 'Filter…'} value={search} onChange={e => onSearch(e.target.value)} aria-label={`Filter ${title}`} /></div>}
      </div>
      <div className="pane-body">{children}</div>
      {footer}
    </aside>
  );
}

function SearchGlyph() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>; }
