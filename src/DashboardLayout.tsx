// DashboardLayout · CoreAstrum AI Studio, from the prototype's src/signal.jsx.
// Needs tokens.css and foundations.css once per app, plus DashboardLayout.css.
import React from 'react';
import { isA, Brief, briefFromCells, ListLead } from './platform';
import { cx } from './cx';

export interface DashboardLayoutProps {
  live?: any;
  sections?: any;
  lineage?: any;
}
export function DashboardLayout({ live, sections, lineage }: DashboardLayoutProps) {
  const list = sections.filter(Boolean);
  const cells = isA && live && live.props && Array.isArray(live.props.cells) ? live.props.cells : null;
  const b = cells ? briefFromCells(cells, []) : null;
  return (
    <>
    {b && <><Brief compact lead={[{ tone: b.health, text: leadWord2(b.health) }, b.healthCell && typeof b.healthCell.sub === 'string' ? ' ' + b.healthCell.sub.replace(/^./, c => c.toUpperCase()) + '.' : null]} body={b.body} /><div className="fx-sheet-lead"><ListLead cells={b.rest} /></div></>}
    <article className="ds ds-sheet">
      {lineage && <div className="ds-lineage">{lineage}</div>}
      {live && !cells && <div className="ds-live">{live}</div>}
      <div className="ds-secs">
        {list.map((s, i) => (
          <section key={s.id} id={'ds-' + s.id} className={cx('ds-sec', s.flush && 'flush')} aria-labelledby={'dsh-' + s.id}>
            <header className="ds-h">
              <h2 id={'dsh-' + s.id}><span className="ds-n num">{String(i + 1).padStart(2, '0')}</span>{s.title}{s.count != null && <span className="ds-c num">{s.count}</span>}</h2>
              <span className="ds-rule" aria-hidden="true" />
              {s.action && <div className="ds-act">{s.action}</div>}
            </header>
            {s.desc && <p className="ds-desc">{s.desc}</p>}
            <div className="ds-content">{s.content}</div>
          </section>
        ))}
      </div>
    </article>
    </>
  );
}

const leadWord2 = (h?: any) => ({ bad: 'Something is failing.', warn: 'Running, with problems.', ok: 'Everything is working.', idle: 'Quiet: no recent activity.', live: 'Work is running now.' })[h] || 'Everything is working.';
