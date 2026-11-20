// PagePlaceholder · CoreAstrum AI Studio, from the prototype's src/kit.jsx.
// Needs tokens.css and foundations.css once per app, plus PagePlaceholder.css.
import React from 'react';
import { useApp } from './app-context';
import { findByPath } from './platform';
import { EmptyState } from './EmptyState';
import { PageLayout } from './PageLayout';

export function PagePlaceholder() {
  const { path } = useApp();
  const here = findByPath(path) || {};
  const c = here.collection || { label: 'Page' };
  return (
    <PageLayout title={here.item?.label || c.label} sub="This screen keeps its current functionality. Its redesign is in the next batch (Administration, Org, Software Engg, Document Intelligence).">
      <div className="panel"><EmptyState icon={c.icon} title="Redesign coming in the next batch">This batch covers the shell, Dashboard and the AI group. {c.items ? `Tabs here: ${c.items.map(i => i.label).join(', ')}.` : ''}</EmptyState></div>
    </PageLayout>
  );
}
