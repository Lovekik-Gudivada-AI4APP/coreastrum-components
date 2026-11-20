// MultiSelectDropdown · CoreAstrum AI Studio, new in the CoreAstrum component library (built on the prototype's parts).
// Needs tokens.css and foundations.css once per app, plus MultiSelectDropdown.css.
import React, { useEffect, useState, useRef } from 'react';
import { Check, X, ChevronDown } from './icons';
import { cx } from './cx';
import { Icon } from './Icon';
import { FloatingLayer } from './FloatingLayer';
import { SearchInput } from './SearchInput';

// The panel under a trigger: as wide as the trigger (at least minWidth), opened by FloatingLayer.
function usePanelWidth(anchor?: any, open?: any, minWidth = 240) {
  const [w, setW] = useState(minWidth);
  useEffect(() => { if (open && anchor.current) setW(Math.max(minWidth, anchor.current.getBoundingClientRect().width)); }, [open]);
  return w;
}

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

export interface MultiSelectDropdownProps {
  value?: any[];
  onChange?: (...args: any[]) => any;
  options?: any[];
  placeholder?: string;
  label?: any;
  searchable?: boolean;
  maxChips?: number;
  disabled?: any;
  id?: string;
  className?: string;
}
// Several choices from a list. The field shows the picks as chips (remove one with its ×); the panel has a search,
// a tick box per option, a count, Select all and Clear. value: array of option values.
export function MultiSelectDropdown({ value = [], onChange, options = [], placeholder = 'Select…', label = 'Select', searchable = true, maxChips = 3, disabled, id, className }: MultiSelectDropdownProps) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const anchor = useRef<any>(null);
  const listRef = useRef<any>(null);
  const width = usePanelWidth(anchor, open);
  const chosen = new Set(value);
  const ql = q.trim().toLowerCase();
  const shown = options.filter(o => !ql || o.label.toLowerCase().includes(ql));
  const set = next => onChange && onChange(next);
  const toggle = v => set(chosen.has(v) ? value.filter(x => x !== v) : [...value, v]);
  const picked = options.filter(o => chosen.has(o.value));
  const close = () => { setOpen(false); setQ(''); };
  return (
    <>
      <div ref={anchor} className={cx('lib-trigger', 'lib-multi', open && 'open', disabled && 'disabled', className)}>
        <button id={id} type="button" className="lib-trigger-hit" disabled={disabled} aria-haspopup="listbox" aria-expanded={open}
          aria-label={`${label}: ${picked.length ? picked.map(o => o.label).join(', ') : 'none selected'}`} onClick={() => setOpen(o => !o)}
          onKeyDown={e => { if (e.key === 'ArrowDown') { e.preventDefault(); setOpen(true); } }} />
        <span className="lib-chips">
          {!picked.length && <span className="lib-placeholder">{placeholder}</span>}
          {picked.slice(0, maxChips).map(o => (
            <span key={o.value} className="lib-chip">{o.label}
              {!disabled && <button type="button" className="lib-chip-x" aria-label={`Remove ${o.label}`} onClick={e => { e.stopPropagation(); toggle(o.value); }}><Icon icon={X} size={11} /></button>}
            </span>))}
          {picked.length > maxChips && <span className="lib-chip lib-chip-more">+{picked.length - maxChips} more</span>}
        </span>
        <Icon icon={ChevronDown} size={16} className="lib-chev" />
      </div>
      <FloatingLayerPanel anchor={anchor} open={open} onClose={close} label={label} width={width}>
        <div className="lib-panel" onKeyDown={e => {
          moveFocus(e, listRef.current);
          // Typing anywhere in the open panel goes into its search box.
          if (searchable && e.key.length === 1 && !e.metaKey && !e.ctrlKey && !(e.target instanceof HTMLInputElement)) { e.preventDefault(); setQ(x => x + e.key); e.currentTarget.querySelector('input')?.focus(); }
        }}>
          {searchable && <div className="lib-panel-search"><SearchInput value={q} onChange={setQ} placeholder={`Search ${String(label).toLowerCase()}`} label={`Search ${label}`} autoFocus /></div>}
          <div className="lib-opts" role="listbox" aria-multiselectable="true" aria-label={label} ref={listRef}>
            {shown.map(o => { const on = chosen.has(o.value); return (
              <button key={o.value} type="button" role="option" data-opt aria-selected={on} disabled={o.disabled} className={cx('lib-opt', on && 'on')} onClick={() => toggle(o.value)}>
                <CheckBox on={on} /><span className="lib-opt-t">{o.label}{o.hint && <small>{o.hint}</small>}</span>
              </button>); })}
            {!shown.length && <p className="lib-none">No match for “{q.trim()}”.</p>}
          </div>
          <div className="lib-panel-foot">
            <span className="lib-count num">{picked.length} of {options.length} selected</span>
            <span className="lib-foot-acts">
              <button type="button" className="lib-link" onClick={() => set(options.filter(o => !o.disabled).map(o => o.value))}>Select all</button>
              <button type="button" className="lib-link" disabled={!picked.length} onClick={() => set([])}>Clear</button>
            </span>
          </div>
        </div>
      </FloatingLayerPanel>
    </>
  );
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
