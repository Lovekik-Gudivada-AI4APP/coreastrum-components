// kit: AppFrame · The AI Studio frame every signed-in screen sits in: floating header, menu (folds to an icon rail),
// editor tabs, breadcrumbs, the page, and the "Powered by" footer. Markup and classes from the prototype's src/shell-c.jsx.
import React, { useState } from 'react';
import { Search, Sparkles, Bell, PanelLeft, PanelLeftClose, PanelLeftOpen, ChevronRight, ChevronDown, Home, X, Pin, Columns3,
  LayoutDashboard, ScanText, Cpu, ShieldCheck, Network, Wrench, Bot, FileText, Database, GitBranch, Workflow, FlaskConical, Activity, Upload, FolderOpen, Users, FolderKanban, Timer, Circle } from './icons';
import { Icon } from './Icon';
import { cx } from './cx';
import lockup from './assets/logo-full.png';
import poweredBy from './assets/4sightai.png';

export const MENU = [
  { id: 'docintel', label: 'Document Intelligence', icon: ScanText, items: [['Upload Document', Upload], ['Saved Documents', FolderOpen]] },
  { id: 'ai', label: 'AI', icon: Cpu, items: [['AI Models', Cpu], ['Knowledge Bases', Database], ['Prompts', FileText], ['RAGs', GitBranch], ['Agents', Bot], ['Pipelines', Workflow], ['Evals', FlaskConical], ['Observability', Activity]] },
  { id: 'admin', label: 'Administration', icon: ShieldCheck, items: [['Projects', FolderKanban], ['Users', Users], ['Access Control', ShieldCheck]] },
  { id: 'org', label: 'Org', icon: Network, items: [['Units', Network]] },
  { id: 'se', label: 'Software Engg', icon: Wrench, items: [['Background Jobs', Timer]] },
];

export interface AppFrameProps {
  project?: any;
  initials?: any;
  active?: any;
  tabs?: any[];
  crumbs?: any[];
  menu?: any;
  logo?: any;
  footerLogo?: any;
  unread?: boolean;
  children?: any;
}
export function AppFrame({ project = 'Core Admin', initials = 'KI', active = 'Agents', tabs = ['Agents'], crumbs = ['Home', 'AI', 'Agents'], menu = MENU, logo = lockup, footerLogo = poweredBy, unread = true, children }: AppFrameProps) {
  const [sideOn, setSideOn] = useState(true);
  const [open, setOpen] = useState(() => new Set(menu.filter(g => g.items.some(([l]: any) => l === active)).map(g => g.id)));
  const toggle = id => setOpen(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const groupOfActive = menu.find(g => g.items.some(([l]: any) => l === active))?.id;
  return (
    <div className={cx('st', !sideOn && 'side-off')}>
      <header className="st-title">
        <button className="st-logo" aria-label="4S CoreAstrum, go to dashboard"><img src={logo} alt="4S CoreAstrum" /></button>
        <button className="st-brand" aria-label={`Project ${project}`}><span className="st-brand-t">{project}</span></button>
        <button className="st-cmd" aria-label="Search screens and commands"><Icon icon={Search} size={14} /><span>Search screens and commands</span><kbd>⌘K</kbd></button>
        <div className="st-title-r">
          <button className="st-tb-btn" aria-pressed={sideOn} onClick={() => setSideOn(s => !s)} aria-label="Toggle side bar (⌘B)" title="Side bar · ⌘B"><Icon icon={PanelLeft} size={16} /></button>
          <button className="st-tb-btn ai" aria-label="Toggle Co-pilot (⌘I)" title="Co-pilot · ⌘I"><Icon icon={Sparkles} size={16} /></button>
          <button className="st-tb-btn st-bell" aria-label="Notifications" title="Notifications"><Icon icon={Bell} size={16} />{unread && <span className="st-bell-d" aria-hidden="true" />}</button>
          <button className="st-avatar" aria-label="Account menu">{initials}</button>
        </div>
      </header>
      <nav className="st-act" aria-label="Activity bar">
        <button className="st-act-b" aria-label="Explorer" aria-pressed={sideOn}><Icon icon={FileText} size={20} /></button>
        <button className="st-act-b" aria-label="Search"><Icon icon={Search} size={20} /></button>
        <span className="st-act-fill" />
      </nav>
      <aside className="st-side" aria-label="Side bar">
        {sideOn ? (
          <div className="st-side-in">
            <div className="st-side-h"><span>Menu</span><span className="row" style={{ gap: 2 }}><button className="icon-btn tip" aria-label="Hide menu (⌘B)" data-tip="Hide menu (⌘B)" onClick={() => setSideOn(false)}><Icon icon={PanelLeftClose} size={14} /></button></span></div>
            <div className="st-side-filter"><Icon icon={Search} size={13} /><input placeholder="Search menu..." aria-label="Search menu" /></div>
            <nav className="st-tree" role="tree" aria-label="Main menu">
              <div className="st-row" style={{ paddingLeft: 6 }} role="treeitem"><span className="st-caret" /><button className="st-row-b"><Icon icon={LayoutDashboard} size={14} className="st-row-i" /><span className="st-row-l">Dashboard</span></button></div>
              {menu.map(g => (
                <React.Fragment key={g.id}>
                  <div className="st-row" style={{ paddingLeft: 6 }} role="treeitem" aria-expanded={open.has(g.id)}>
                    <button className="st-caret" aria-label={(open.has(g.id) ? 'Collapse ' : 'Expand ') + g.label} onClick={() => toggle(g.id)}><Icon icon={open.has(g.id) ? ChevronDown : ChevronRight} size={13} /></button>
                    <button className="st-row-b" onClick={() => toggle(g.id)}><Icon icon={g.icon} size={14} className="st-row-i" /><span className="st-row-l">{g.label}</span></button>
                  </div>
                  {open.has(g.id) && g.items.map(([label, icon]: any) => (
                    <div key={label} className={cx('st-row', label === active && 'on')} style={{ paddingLeft: 18 }} role="treeitem" aria-selected={label === active}>
                      <span className="st-caret" /><button className="st-row-b" aria-current={label === active ? 'page' : undefined}><Icon icon={icon} size={14} className="st-row-i" /><span className="st-row-l">{label}</span></button>
                    </div>
                  ))}
                </React.Fragment>
              ))}
            </nav>
          </div>
        ) : (
          <nav className="st-peek" aria-label="Menu (hidden)">
            <button type="button" className="st-peek-open" onClick={() => setSideOn(true)} aria-label="Show menu (⌘B)" data-tip="Show menu · ⌘B"><Icon icon={PanelLeftOpen} size={16} /></button>
            <span className="st-peek-sep" aria-hidden="true" />
            <button type="button" className="st-peek-b" aria-label="Dashboard" data-tip="Dashboard"><Icon icon={LayoutDashboard} size={18} /></button>
            {menu.map(g => <button key={g.id} type="button" className={cx('st-peek-b', g.id === groupOfActive && 'on')} aria-label={g.label} data-tip={g.label} onClick={() => { setOpen(s => new Set(s).add(g.id)); setSideOn(true); }}><Icon icon={g.icon} size={18} /></button>)}
          </nav>
        )}
      </aside>
      <main className="st-ed">
        <div className="st-tabbar">
          <div className="st-tabs" role="tablist" aria-label="Open editors">
            <div className="st-tab pinned" role="tab" aria-selected="false"><button className="st-tab-b"><Icon icon={LayoutDashboard} size={13} /><span>Workspace home</span></button><span className="st-tab-pin" aria-label="Pinned"><Icon icon={Pin} size={11} /></span></div>
            {tabs.map((t, i) => (
              <div key={t} className={cx('st-tab', i === tabs.length - 1 && 'on')} role="tab" aria-selected={i === tabs.length - 1}>
                <button className="st-tab-b"><Icon icon={Circle} size={13} /><span>{t}</span></button>
                <button className="st-tab-x" aria-label={`Close ${t}`}><Icon icon={X} size={12} /></button>
              </div>
            ))}
          </div>
          <div className="st-tabs-tools">
            <button className="st-tabs-act" title="Split"><Icon icon={Columns3} size={14} /><span>Split</span></button>
            <button className="st-tabs-act st-tabs-count" aria-haspopup="menu"><b className="num">{tabs.length + 1}</b> tabs<Icon icon={ChevronDown} size={13} /></button>
          </div>
        </div>
        <div className="st-panes">
          <div className="st-doc">
            <nav className="ca-crumbs" aria-label="Breadcrumb"><ol>{crumbs.map((c, i) => (
              <li key={i}>{i > 0 && <Icon icon={ChevronRight} size={13} className="sep" />}
                {i < crumbs.length - 1 ? <button type="button">{i === 0 && <Icon icon={Home} size={13} />}{c}</button> : <span aria-current="page">{i === 0 && <Icon icon={Home} size={13} />}{c}</span>}</li>))}</ol></nav>
            {children}
          </div>
        </div>
      </main>
      <footer className="st-status st-powered" aria-label="Footer"><span className="st-pw">Powered by</span><img className="st-pw-logo" src={footerLogo} alt="4SightAI" /></footer>
    </div>
  );
}
