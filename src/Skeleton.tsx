// Skeleton · CoreAstrum AI Studio, from the prototype's src/ui.jsx.
// Needs tokens.css and foundations.css once per app, plus Skeleton.css.
import React from 'react';

export interface SkeletonProps {
  w?: any;
  h?: number;
  r?: any;
  style?: React.CSSProperties;
}
export function Skeleton({ w = '100%', h = 12, r, style }: SkeletonProps) { return <div className="skel" style={{ width: w, height: h, borderRadius: r, ...style }} />; }
