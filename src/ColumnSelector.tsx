// ColumnSelector · CoreAstrum AI Studio, new in the CoreAstrum component library (built on the prototype's parts).
// Needs tokens.css and foundations.css once per app, plus ColumnSelector.css.
import React, { useRef, useState } from 'react';
import { Check, Lock, Columns3 } from './icons';
import { cx } from './cx';
import { Icon } from './Icon';
import { Button } from './Button';
import { FloatingLayer } from './FloatingLayer';

// Arrow keys move between the panel's options; Home/End jump.
function moveFocus(e?: any, root?: any) {
  if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key) || !root) return;
  const items = [...root.querySelectorAll('[data-opt]:not([disabled])')];
  if (!items.length) return;
  e.preventDefault();
  const i = items.indexOf(document.activeElement);
  const next = e.key === 'Home' ? 0 : e.key === 'End' ? items.length - 1 : e.key === 'ArrowDown' ? Math.min(i + 1, items.length - 1) : Math.max(i - 1, 0);
  items[next < 0 ? 0 : next].focus();
}

interface CheckBoxProps {
  on?: any;
  locked?: any;
}
function CheckBox({ on, locked }: CheckBoxProps) {
  return <span className={cx('lib-check', on && 'on', locked && 'locked')} aria-hidden="true">{on && <Icon icon={Check} size={12} />}</span>;
}

interface FloatingLayerPanelProps {
  anchor?: any;
  open?: any;
  onClose?: (...args: any[]) => any;
  label?: any;
  width?: any;
  align?: any;
  role?: string;
  children?: any;
}
// FloatingLayer with a fixed width for its panel.
function FloatingLayerPanel({ anchor, open, onClose, label, width, align = 'left', role = 'presentation', children }: FloatingLayerPanelProps) {
  return <FloatingLayer anchor={anchor} open={open} onClose={onClose} label={label} role={role} align={align} className="lib-pop"><div style={{ width }}>{children}</div></FloatingLayer>;
}

export interface ColumnSelectorProps {
  columns?: any[];
  hidden?: any[];
  onChange?: (...args: any[]) => any;
  defaultHidden?: any[];
  label?: any;
}
// Which table columns show. Locked columns stay on (with a lock); the rest tick on and off. Show all, Hide all and
// Reset to default. columns: [{ key, label, locked }]; hidden: keys that are off.
export function ColumnSelector({ columns = [], hidden = [], onChange, defaultHidden = [], label = 'Columns' }: ColumnSelectorProps) {
  const [open, setOpen] = useState(false);
  const anchor = useRef<any>(null);
  const listRef = useRef<any>(null);
  const off = new Set(hidden);
  const free = columns.filter(c => !c.locked);
  const shownCount = free.filter(c => !off.has(c.key)).length;
  const set = next => onChange && onChange(next);
  const flip = k => set(off.has(k) ? hidden.filter(x => x !== k) : [...hidden, k]);
  return (
    <>
      <span ref={anchor} style={{ display: 'inline-flex' }}>
        <Button icon={Columns3} onClick={() => setOpen(o => !o)} aria-expanded={open} aria-haspopup="menu" aria-label={`${label}, ${shownCount + columns.length - free.length} of ${columns.length} shown`}>
          {label}<span className="lib-count-pill num">{shownCount + columns.length - free.length}/{columns.length}</span>
        </Button>
      </span>
      <FloatingLayerPanel anchor={anchor} open={open} onClose={() => setOpen(false)} label={label} width={272} align="right">
        <div className="lib-panel" onKeyDown={e => moveFocus(e, listRef.current)}>
          <div className="lib-panel-h"><b>Show columns</b><span className="num">{shownCount + columns.length - free.length} of {columns.length}</span></div>
          <div className="lib-opts" role="group" aria-label="Columns" ref={listRef}>
            {columns.map(c => c.locked ? (
              <div key={c.key} className="lib-opt locked" role="menuitemcheckbox" aria-checked="true" aria-disabled="true" title="Always shown">
                <CheckBox on locked /><span className="lib-opt-t">{c.label}</span><Icon icon={Lock} size={12} className="lib-lock" />
              </div>
            ) : (
              <button key={c.key} type="button" role="menuitemcheckbox" data-opt aria-checked={!off.has(c.key)} className={cx('lib-opt', !off.has(c.key) && 'on')} onClick={() => flip(c.key)}>
                <CheckBox on={!off.has(c.key)} /><span className="lib-opt-t">{c.label}</span>
              </button>
            ))}
          </div>
          <div className="lib-panel-foot">
            <button type="button" className="lib-link" onClick={() => set(defaultHidden)}>Reset to default</button>
            <span className="lib-foot-acts">
              <button type="button" className="lib-link" disabled={!hidden.length} onClick={() => set([])}>Show all</button>
              <button type="button" className="lib-link" disabled={shownCount === 0} onClick={() => set(free.map(c => c.key))}>Hide all</button>
            </span>
          </div>
        </div>
      </FloatingLayerPanel>
    </>
  );
}
