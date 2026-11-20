// PageHeader · CoreAstrum AI Studio, from the prototype's src/ui.jsx.
// Needs tokens.css and foundations.css once per app, plus PageHeader.css.
import React from 'react';
import { useApp } from './app-context';

export interface PageHeaderProps {
  crumbs?: any;
  title?: any;
  sub?: any;
  actions?: any;
  children?: any;
}
export function PageHeader({ crumbs, title, sub, actions, children }: PageHeaderProps) {
  const { nav } = useApp();
  return (
    <div className="page-head">
      <div style={{ minWidth: 0 }}>
        {crumbs && <nav className="crumbs" aria-label="Breadcrumb">{crumbs.map((c, i) => (
          <React.Fragment key={i}>{i > 0 && <span aria-hidden="true">/</span>}
            {c.to ? <button onClick={() => typeof c.to === 'function' ? c.to() : nav(c.to)}>{c.label}</button> : <span>{c.label}</span>}
          </React.Fragment>))}</nav>}
        <div className="row wrap" style={{ gap: 10 }}><h1 className="t-h1">{title}</h1>{children}</div>
        {sub && <p className="t-meta" style={{ margin: '6px 0 0', maxWidth: '80ch' }}>{sub}</p>}
      </div>
      {actions && <div className="head-actions">{actions}</div>}
    </div>
  );
}
