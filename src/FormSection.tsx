// FormSection · CoreAstrum AI Studio, from the prototype's src/kit.jsx.
// Needs tokens.css and foundations.css once per app, plus FormSection.css.
import React from 'react';

export interface FormSectionProps {
  title?: any;
  desc?: any;
  children?: any;
}
/* Form layout: titled sections with a left description column. */
export function FormSection({ title, desc, children }: FormSectionProps) {
  return (
    <div className="form-sec">
      <div className="fs-h"><h3>{title}</h3>{desc && <p>{desc}</p>}</div>
      <div className="form-grid">{children}</div>
    </div>
  );
}
