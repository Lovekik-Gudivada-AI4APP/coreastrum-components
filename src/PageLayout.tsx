// PageLayout · CoreAstrum AI Studio, from the prototype's src/kit.jsx.
// Needs tokens.css and foundations.css once per app, plus PageLayout.css.
import React from 'react';
import { ArrowLeft } from './icons';
import { useApp } from './app-context';
import { findByPath } from './platform';
import { Icon } from './Icon';
import { IconButton } from './IconButton';
import { Tabs } from './Tabs';

export interface PageLayoutProps {
  title?: any;
  sub?: any;
  actions?: any;
  tabs?: any;
  tab?: any;
  onTab?: (...args: any[]) => any;
  children?: any;
  crumbs?: any;
  back?: any;
  icon?: React.ComponentType<any>;
}
/* Page frame: breadcrumb from the real nav taxonomy, title, subtitle, actions, optional tabs. */
export function PageLayout({ title, sub, actions, tabs, tab, onTab, children, crumbs, back, icon }: PageLayoutProps) {
  const { path, nav } = useApp();
  const here = findByPath(path) || {};
  const trail = crumbs || [here.group && { label: here.group.label }, here.collection && here.collection.id !== 'dashboard' && { label: here.collection.label, to: here.item ? undefined : undefined }].filter(Boolean);
  return (
    <div className="pg">
      <div className="page-head" style={{ marginBottom: tabs ? 12 : 18 }}>
        <div style={{ minWidth: 0 }}>
          {trail.length > 0 && <nav className="crumbs" aria-label="Breadcrumb">{trail.map((c, i) => (
            <React.Fragment key={i}>{i > 0 && <span aria-hidden="true">/</span>}{c.to ? <button onClick={() => nav(c.to)}>{c.label}</button> : <span>{c.label}</span>}</React.Fragment>))}</nav>}
          <div className="row" style={{ gap: 12 }}>
            {back && <IconButton icon={ArrowLeft} label="Back" onClick={() => nav(back)} />}
            {icon && <span className="id-ico"><Icon icon={icon} size={19} /></span>}
            <div style={{ minWidth: 0 }}><h1 className="t-h1">{title}</h1>{sub && <p className="t-meta page-sub">{sub}</p>}</div>
          </div>
        </div>
        {actions && <div className="head-actions">{actions}</div>}
      </div>
      {tabs && <Tabs className="pg-tabs" tabs={tabs} value={tab} onChange={onTab} />}
      {children}
    </div>
  );
}

/* Table system (§9 T1–T5): toolbar (search · filters · spacer · count · Columns · refresh · primary),
   sortable one-line columns, row click = View, hover/focus-revealed Edit + "…" (Delete only in "…"),
   pinned actions column that never covers data (low-priority columns auto-hide to fit), density,
   paging, loading / empty / no-results states, and summary cards on phones.
   Column options: { key, label, render, sort, align, width, wrap, max, tip, hidden, keep, priority,
   card: 'title' | 'id' | 'status' | 'metric' | 'meta' | false }. */
