# Portfolio V2 Architecture

This document captures the architecture-level changes made during the safe V2 rebuild. The original root portfolio is intentionally preserved as a fallback while the modern Vite React version lives inside `portfolio-v2/`.

![Portfolio UI evolution](assets/portfolio-v2-before-after.png)

## Application Architecture

```mermaid
flowchart LR
    subgraph Before["Before: root static portfolio"]
        A1["index.html"]
        A2["style.css + utility.css"]
        A3["readmore.js + inline jQuery"]
        A4["Images/"]
        A1 --> A2
        A1 --> A3
        A1 --> A4
    end

    subgraph After["After: isolated portfolio-v2"]
        B1["src/App.jsx"]
        B2["src/portfolioData.js"]
        B3["src/styles.css"]
        B4["public/images"]
        B5["public/resume"]
        B6["Vite build output: dist/"]
        B2 --> B1
        B3 --> B1
        B4 --> B1
        B5 --> B1
        B1 --> B6
    end

    Before -. preserved as fallback .-> After
```

## Deployment Architecture

```mermaid
flowchart TD
    C["Push to main"] --> D["GitHub Actions workflow"]
    D --> E["Checkout repo"]
    E --> F["Install portfolio-v2 dependencies"]
    F --> G{"V2 build succeeds?"}
    G -- "Yes" --> H["Deploy portfolio-v2/dist"]
    G -- "No" --> I["Package old root static site"]
    H --> J["GitHub Pages"]
    I --> J
    J --> K["Public portfolio URL"]
```

## Key Changes

- Preserved the old root portfolio as a working rollback/fallback path.
- Built the modern portfolio in `portfolio-v2/` so the migration is isolated and reversible.
- Moved content into structured React data in `src/portfolioData.js` instead of maintaining one large HTML file.
- Replaced inline jQuery behavior with React state and reusable components.
- Updated GitHub Pages deployment to build Vite output from `portfolio-v2/dist`.
- Added workflow fallback logic: if the V2 build fails, deploy the old root static portfolio automatically.
- Updated UI positioning toward Python backend engineering, AWS serverless systems, REST APIs, and production reliability.
