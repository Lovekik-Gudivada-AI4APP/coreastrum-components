// ProjectBadge · CoreAstrum AI Studio, from the prototype's src/kit.jsx.
// Needs tokens.css and foundations.css once per app, plus ProjectBadge.css.
import React from 'react';

export interface ProjectBadgeProps {
  r?: any;
}
export const ProjectBadge = ({ r }: ProjectBadgeProps) => r.project === 'Core' ? <span className="chip info" style={{ height: 20 }}>Core</span> : <span className="t-meta">{r.project}</span>;
