// SearchInput · CoreAstrum AI Studio, new in the CoreAstrum component library (built on the prototype's parts).
// Needs tokens.css and foundations.css once per app, plus SearchInput.css.
import React from 'react';
import { Search, X } from './icons';
import { cx } from './cx';
import { Icon } from './Icon';
import { IconButton } from './IconButton';

export interface SearchInputProps {
  value?: any;
  onChange?: (...args: any[]) => any;
  placeholder?: string;
  label?: any;
  id?: string;
  autoFocus?: any;
  className?: string;
}
// Search box with a magnifier and a clear button. Calls onChange with the text; Escape clears it.
export function SearchInput({ value = '', onChange, placeholder = 'Search…', label = 'Search', id, autoFocus, className }: SearchInputProps) {
  return (
    <div className={cx('input-icon', 'lib-search', className)}>
      <Icon icon={Search} size={14} />
      <input id={id} className="input" type="search" placeholder={placeholder} aria-label={label} value={value} autoFocus={autoFocus}
        onChange={e => onChange && onChange(e.target.value)} onKeyDown={e => { if (e.key === 'Escape' && value) { e.preventDefault(); onChange && onChange(''); } }} />
      {value ? <IconButton icon={X} size={13} label="Clear search" className="lib-search-x" onClick={() => onChange && onChange('')} /> : null}
    </div>
  );
}
