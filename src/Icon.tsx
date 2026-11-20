// Icon · CoreAstrum AI Studio, from the prototype's src/ui.jsx.
// Needs tokens.css and foundations.css once per app.
import React from 'react';

export interface IconProps {
  icon?: React.ComponentType<any>;
  size?: number;
  stroke?: number;
  className?: string;
  style?: React.CSSProperties;
}
export function Icon({ icon: Ico, size = 16, stroke = 1.75, className, style }: IconProps) {
  if (!Ico) return null;
  return <Ico size={size} strokeWidth={stroke} className={className} style={style} aria-hidden="true" />;
}
