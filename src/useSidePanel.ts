// usePaneState · CoreAstrum AI Studio, from the prototype's src/ui.jsx.
// Needs tokens.css and foundations.css once per app.
import { useContext } from 'react';
import { SidePanelContext } from './SidePanelContext';

export const useSidePanel = () => useContext(SidePanelContext);
