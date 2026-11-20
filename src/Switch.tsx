// Switch · CoreAstrum AI Studio, from the prototype's src/ui.jsx.
// Needs tokens.css and foundations.css once per app, plus Switch.css.
import React from 'react';

export interface SwitchProps {
  checked?: any;
  onChange?: (...args: any[]) => any;
  label?: any;
  disabled?: any;
  id?: string;
}
export function Switch({ checked, onChange, label, disabled, id }: SwitchProps) {
  return <button type="button" id={id} role="switch" className="toggle" aria-checked={!!checked} aria-label={label} disabled={disabled} onClick={() => onChange(!checked)} />;
}
