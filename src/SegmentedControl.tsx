// SegmentedControl · CoreAstrum AI Studio, from the prototype's src/ui.jsx.
// Needs tokens.css and foundations.css once per app, plus SegmentedControl.css.
import React from 'react';

export interface SegmentedControlProps {
  options?: any;
  value?: any;
  onChange?: (...args: any[]) => any;
  label?: any;
}
export function SegmentedControl({ options, value, onChange, label }: SegmentedControlProps) {
  return (
    <div className="segmented" role="group" aria-label={label}>
      {options.map(o => {
        const [id, l] = Array.isArray(o) ? o : [o, o];
        return <button key={id} type="button" aria-pressed={value === id} onClick={() => onChange(id)}>{l}</button>;
      })}
    </div>
  );
}
