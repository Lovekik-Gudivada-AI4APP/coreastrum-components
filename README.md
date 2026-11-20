# CoreAstrum Components

React 18 + TypeScript components, screen kits and assets from the CoreAstrum AI Studio design.

**Browse them with live previews:** https://claude.ai/artifact/CF3JZgVRFMYrUwpFHiXAu4

## Download

Every component and screen kit is a separate .zip on the [latest release](../../releases/latest), together with its CSS and the files it depends on.

- Everything: [coreastrum-components.zip](../../releases/latest/download/coreastrum-components.zip)
- Foundations (tokens, base styles, icons): [foundations.zip](../../releases/latest/download/foundations.zip)
- Assets (logos, fonts, icons): [coreastrum-assets.zip](../../releases/latest/download/coreastrum-assets.zip)
- One component, for example: [Button.zip](../../releases/latest/download/Button.zip), [DataGrid.zip](../../releases/latest/download/DataGrid.zip), [SearchableDropdown.zip](../../releases/latest/download/SearchableDropdown.zip)

The same files are in [`src/`](src) if you prefer to copy them directly.

## Use

```bash
npm i react@18 react-dom@18 @phosphor-icons/react@2.1.7
npm i -D @types/react@18 @types/react-dom@18
```

1. Copy the files into one folder, for example `src/components/coreastrum/`.
2. Once per app: put `data-c2 data-design="C"` on `<html>` (add `data-app-theme="dark"` for dark), import `tokens.css` and `foundations.css`, and wrap the app in `AppProvider` from `app-context`.
3. Import each component's CSS where you use it, then the component: `import { Button } from './Button';`

Each .zip has a README with the exact imports for that component.

TypeScript: the files type-check with `"jsx": "react-jsx"`, `"strict": false` and `"skipLibCheck": true`. Keep `assets.d.ts` in the folder (it types the .png and .css imports).
