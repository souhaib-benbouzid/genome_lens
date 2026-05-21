# GenomeLens Frontend

React + TypeScript frontend for the GenomeLens application — a virtualized, infinite-scroll table for browsing, filtering, and visualizing ~58 000 human genes.

---

## Tech Stack

| Concern                | Technology                                          |
| ---------------------- | --------------------------------------------------- |
| Framework              | React 18 + TypeScript                               |
| Bundler                | Rspack                                              |
| UI Components          | Mantine (`@mantine/core`, `@mantine/hooks`)         |
| Table                  | `mantine-react-table` v2 (virtualized, server-side) |
| Global State           | Redux Toolkit (`@reduxjs/toolkit`, `react-redux`)   |
| API / Caching          | RTK Query (`createApi`)                             |
| Genomic Visualization  | Gosling.js                                          |
| Expression Charts      | ECharts (`echarts-for-react`)                       |
| Unit / Component Tests | Rstest + Testing Library                            |
| E2E Tests              | Playwright                                          |

---

## Project Layout

```text
frontend/src/
├── App.tsx                          # MantineProvider + Redux Provider + Layout
├── main.tsx
├── store/
│   ├── index.ts                     # Redux configureStore (genes + RTK Query reducers)
│   ├── genesSlice.ts                # selectedGene, activeTab, filters, sorting, offset/limit
│   ├── hook.ts                      # Typed useAppDispatch / useAppSelector
│   └── api/
│       ├── genomelens.ts            # RTK Query createApi — all /api/v1/* endpoints
│       └── mygene.ts                # RTK Query createApi — mygene.info enrichment
├── components/
│   ├── Layout/
│   │   ├── Layout.tsx               # Responsive shell: split-panel (desktop) / Drawer (mobile)
│   │   └── Layout.module.css
│   ├── Navbar/
│   │   ├── Navbar.tsx               # App bar — logo, version badge, dark/light toggle
│   │   └── Navbar.module.css
│   ├── GeneTable/
│   │   ├── GeneTable.tsx            # mantine-react-table with row virtualisation
│   │   ├── GeneTableToolbar.tsx     # Search input + biotype/chromosome filter selects
│   │   ├── columns.tsx              # MRT column definitions (BiotypeTag, ChromosomeTag cells)
│   │   ├── GeneTable.module.css
│   │   └── hooks/
│   │       ├── useGeneTable.ts      # Composes sub-hooks; returns all table state
│   │       ├── useGeneRows.ts       # Infinite-scroll windowing via RTK Query
│   │       ├── useGeneSearch.ts     # Debounced search → Redux setFilters
│   │       └── useGeneSorting.ts    # Sorting state → Redux setSorting
│   ├── DetailPanel/
│   │   ├── DetailPanel.tsx          # Gene header + Mantine Tabs (lazy-loaded tab content)
│   │   └── tabs/
│   │       ├── GenomicTab.tsx       # Gosling.js track zooming to chr:start-end locus
│   │       ├── ExpressionTab.tsx    # Tissue expression chart (placeholder)
│   │       ├── ProteinTab.tsx       # Protein info via mygene.info RTK Query
│   │       ├── DifferentialTab.tsx  # Differential expression (placeholder)
│   │       ├── ExternalLinksTab.tsx # Static links to Ensembl, NCBI, UniProt, GTEx, …
│   │       └── GoslingErrorBoundary.tsx
│   └── ui/
│       ├── BiotypeTag.tsx           # Colour-coded badge per biotype
│       └── ChromosomeTag.tsx        # Coloured swatch + chr label
├── types/
│   └── gene.ts                      # Gene, FilterParams, SortingState, ActiveTab, …
└── assets/
```

---

## Responsive Layout

| Viewport                  | Behaviour                                                                                                                 |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `> sm` (> 48 em / 768 px) | Split-panel: resizable left panel (gene table) + right panel (detail panel) separated by a draggable divider              |
| `≤ sm` (≤ 48 em / 768 px) | Full-width gene table only; selecting a gene opens a bottom **Drawer** (85 % viewport height) containing the detail panel |

The breakpoint is read from `theme.breakpoints.sm` via `useMantineTheme()` — no hard-coded pixel values.

---

## Setup

```bash
cd frontend
pnpm install
```

---

## Development Server

```bash
pnpm run dev
```

App is available at **<http://localhost:8080>**. The Rspack dev server proxies `/api/*` and `/health` to the FastAPI backend at `http://localhost:8000`.

---

## Production Build

```bash
pnpm run build
```

Output is written to `dist/`. The Docker image serves this via nginx, which also proxies `/api/*` to the backend container.

---

## Running Tests

```bash
# Component / unit tests (Rstest)
pnpm run test

# E2E tests (Playwright) — requires both servers running
pnpm run test:e2e
```

---

## API Contract — Virtualized Table

The table fetches rows via `GET /api/v1/genes` using `offset` + `limit` windowing:

```http
GET /api/v1/genes?offset=0&limit=50&sort_by=gene_symbol&order=asc

Response:
{
  "items":    Gene[],       // rows for this window
  "total":    number,       // total matching rows (used for scrollbar sizing)
  "offset":   number,
  "limit":    number,
  "has_more": boolean       // true when more rows exist beyond this window
}
```

The `has_more` flag eliminates the need for any client-side arithmetic — the table calls the next window only when `has_more` is `true`.
