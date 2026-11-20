// FormField · CoreAstrum AI Studio, from the prototype's src/ui.jsx.
// Needs tokens.css and foundations.css once per app, plus FormField.css.
import React from 'react';

export interface FormFieldProps {
  label?: any;
  hint?: any;
  error?: any;
  children?: any;
  htmlFor?: string;
  extra?: any;
}
export function FormField({ label, hint, error, children, htmlFor, extra }: FormFieldProps) {
  return (
    <div className="field">
      {label && <div className="spread"><label htmlFor={htmlFor}>{label}</label>{extra}</div>}
      {children}
      {error ? <span className="err">{error}</span> : hint ? <span className="hint">{hint}</span> : null}
    </div>
  );
}
