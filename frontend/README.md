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

```
frontend/src/
├── App.tsx                        # MantineProvider + Redux Provider + layout
├── main.tsx
├── store/
│   ├── index.ts                   # Redux configureStore
│   ├── genesSlice.ts              # selectedGene, active tab UI state
│   └── api/
│       └── genomeLensApi.ts       # RTK Query createApi — all /api/v1/* endpoints
├── components/
│   ├── GeneTable/
│   │   └── GeneTable.tsx          # Virtualized table — offset/limit windowing via RTK Query
│   └── DetailPanel/
│       ├── DetailPanel.tsx        # Mantine Tabs wrapper + gene metadata header
│       └── tabs/
│           ├── GenomicTab.tsx     # Gosling.js — zooms to chromosome:start-end locus
│           ├── ExpressionTab.tsx  # ECharts violin/box — FastAPI → GTEx proxy
│           ├── ProteinTab.tsx     # SwissBioPics subcellular location embed
│           ├── DifferentialTab.tsx# Volcano plot — FastAPI → PyDESeq2
│           └── ExternalLinksTab.tsx
├── types/
│   └── gene.ts                    # Gene, GeneQueryParams, VirtualizedResponse, …
└── assets/
```

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

App is available at **http://localhost:8080**. The Rspack dev server proxies `/api/*` to the FastAPI backend at `http://localhost:8000`.

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

```
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
