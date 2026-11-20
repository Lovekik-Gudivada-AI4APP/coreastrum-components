// Tabs · CoreAstrum AI Studio, from the prototype's src/ui.jsx.
// Needs tokens.css and foundations.css once per app, plus Tabs.css.
import React from 'react';
import { cx } from './cx';

export interface TabsProps {
  tabs?: any;
  value?: any;
  onChange?: (...args: any[]) => any;
  className?: string;
}
export function Tabs({ tabs, value, onChange, className }: TabsProps) {
  return (
    <div className={cx('tabs', className)} role="tablist">
      {tabs.map(t => {
        const [id, label, count] = Array.isArray(t) ? t : [t.id, t.label, t.count];
        return (
          <button key={id} role="tab" aria-selected={value === id} onClick={() => onChange(id)}>
            {label}{count != null && <span className="count">{count}</span>}
          </button>
        );
      })}
    </div>
  );
}
