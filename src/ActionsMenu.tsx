// ActionsMenu · CoreAstrum AI Studio, from the prototype's src/ui.jsx.
// Needs tokens.css and foundations.css once per app, plus ActionsMenu.css.
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { MoreHorizontal } from './icons';
import { cx } from './cx';
import { Icon } from './Icon';
import { FloatingLayer } from './FloatingLayer';

export interface ActionsMenuProps {
  items?: any;
  label?: any;
  size?: number;
}
export function ActionsMenu({ items, label = 'More actions', size = 15 }: ActionsMenuProps) {
  const [open, setOpen] = useState(false);
  const btn = useRef<any>(null), list = useRef<any>(null);
  const list_ = items.filter(Boolean);
  const close = useCallback(() => setOpen(false), []);
  useEffect(() => { if (open) setTimeout(() => list.current?.querySelector('button:not([disabled])')?.focus(), 0); }, [open]);
  if (!list_.length) return null;
  const onKey = e => {
    const els = [...(list.current?.querySelectorAll('button:not([disabled])') || [])];
    const i = els.indexOf(document.activeElement);
    if (e.key === 'ArrowDown') { e.preventDefault(); els[(i + 1) % els.length]?.focus(); }
    if (e.key === 'ArrowUp') { e.preventDefault(); els[(i - 1 + els.length) % els.length]?.focus(); }
    if (e.key === 'Tab') close();
  };
  return (
    <>
      <button ref={btn} type="button" className="icon-btn tip row-menu-btn" aria-label={label} data-tip="More actions" aria-haspopup="menu" aria-expanded={open}
        onClick={e => { e.stopPropagation(); setOpen(o => !o); }}><Icon icon={MoreHorizontal} size={size} /></button>
      <FloatingLayer anchor={btn} open={open} onClose={close} align="right" role="presentation">
        <div className="menu" role="menu" aria-label={label} ref={list} onKeyDown={onKey} onClick={e => e.stopPropagation()}>
          {list_.map((it, i) => it.sep ? <div key={'s' + i} className="menu-sep" role="separator" /> : (
            <button key={it.label + i} type="button" role="menuitem" className={cx('menu-item', it.danger && 'danger')} disabled={it.disabled} title={it.title}
              onClick={() => { close(); it.onClick?.(); }}>{it.icon && <Icon icon={it.icon} size={14} />}{it.label}</button>
          ))}
        </div>
      </FloatingLayer>
    </>
  );
}
