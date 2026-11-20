// SidePanelContext · CoreAstrum AI Studio, from the prototype's src/ui.jsx.
// Needs tokens.css and foundations.css once per app.
import { createContext } from 'react';

export const SidePanelContext = createContext<any>({ paneOpen: true, setPaneOpen: () => {} });
