# Architecture of GenomeLens

GenomeLens is a modular, scalable web application for browsing, filtering, searching, and visualizing human gene data. The backend and frontend are fully decoupled, communicating over a versioned REST API.

## Features

### Core Table

- Browse ~58k human genes in a paginated, virtualized table (`mantine-react-table` v2)
- Full-text search across Ensembl ID, gene symbol, and gene name
- Filter by biotype (e.g. "Protein Coding") and chromosome via server-side dropdowns
- Sort by any column — all sorting, filtering, and pagination handled in SQL on the backend
- Dynamic filter dropdowns populated from `/api/v1/genes/meta/*` (distinct biotypes, chromosomes)

### Detail Panel (tabbed, shown on row click)

- **Genomic tab** — Gosling.js annotation track zooming to the gene's `chromosome:start-end` locus
- **Expression tab** — ECharts violin/box plot of tissue expression values fetched from FastAPI (GTEx proxy)
- **Protein tab** — SwissBioPics subcellular location visualization for the selected gene's protein
- **Differential tab** — Volcano plot of differential expression between two selected genes via FastAPI + PyDESeq2
- **External Links tab** — Quick links to NCBI, Ensembl, UniProt, and mygene.info for the selected gene

### Architecture & Engineering

- All data fetching, enrichment, and external API proxying done exclusively in the FastAPI backend
- Frontend is a pure rendering layer — communicates only with the FastAPI backend via RTK Query
- Single RTK Query API client (`genomeLensApi`) covers all backend endpoints with automatic caching
- Redux Toolkit slice manages UI state (selected gene, active tab)
- SQLite database seeded from `genes_human.csv` via `seed.py`; swappable to PostgreSQL with one config change
- SQLite indexes on `biotype`, `chromosome`, and `gene_symbol` for fast filtering at scale

### Testing

- **Rstest** — component-level tests with mocked RTK Query responses (table rendering, sort, filter, pagination)
- **pytest + httpx** — backend integration tests against an in-memory SQLite DB
- **Playwright** — E2E tests covering table load, search, row selection, and detail panel rendering

---

## Technology Stack

### Frontend

| Concern               | Technology                                        |
| --------------------- | ------------------------------------------------- |
| Framework             | React 18 + TypeScript                             |
| Bundler               | Rspack                                            |
| UI Components         | Mantine (`@mantine/core`, `@mantine/hooks`)       |
| Table                 | `mantine-react-table` v2                          |
| Global State          | Redux Toolkit (`@reduxjs/toolkit`, `react-redux`) |
| API Data Fetching     | RTK Query (via `createApi`)                       |
| Genomic Visualization | Gosling.js                                        |
| Expression Charts     | ECharts (`echarts-for-react`)                     |
| Unit/Component Tests  | Rstest + Testing Library                          |
| E2E Tests             | Playwright                                        |

### Backend

| Concern           | Technology                                   |
| ----------------- | -------------------------------------------- |
| Framework         | FastAPI                                      |
| ORM               | SQLAlchemy                                   |
| Database          | SQLite (file-based, swappable to PostgreSQL) |
| Schema Validation | Pydantic v2 + pydantic-settings              |
| Server            | Uvicorn                                      |
| Tests             | pytest + httpx (async client)                |

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────┐
│                     Frontend                        │
│                                                     │
│  GeneTable (mantine-react-table)                    │
│       ↑ RTK Query (useGetGenesQuery)                │
│       ↓ row click                                   │
│  Redux: setSelectedGene()                           │
│       ↓                                             │
│  DetailPanel                                        │
│    ├── GoslingTrack  (chromosome:start-end zoom)    │
│    └── ExpressionChart ──→ RTK Query                │
│                                   ↓                 │
└───────────────────────────────────┼─────────────────┘
                                    │ HTTP /api/v1/
┌───────────────────────────────────┼─────────────────┐
│                  Backend          ↓                 │
│                                                     │
│  FastAPI router → crud.py → SQLAlchemy → SQLite     │
│       ↑ seed.py loads genes_human.csv on startup    │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## Layout

```
┌─────────────────────────┬──────────────────────────────────────┐
│                         │  Selected gene header + metadata      │
│   GeneTable             ├──────────────────────────────────────┤
│   (mantine-react-table) │  [Genomic][Expression][Protein]       │
│                         │  [Differential][External Links]       │
│   Filters / Search bar  ├──────────────────────────────────────┤
│   (Mantine inputs)      │                                      │
│                         │  <Active tab content renders here>   │
│                         │                                      │
└─────────────────────────┴──────────────────────────────────────┘
```

- Clicking a table row dispatches `setSelectedGene` to the Redux store
- The right panel shows the selected gene's metadata and a **Mantine Tabs** panel
- Adding a new visualization = adding one new tab file, zero layout changes
- Every tab gets its data exclusively from the FastAPI backend via RTK Query

---

## API Endpoint Structure

The frontend communicates **only** with the FastAPI backend. All data fetching, filtering, sorting, aggregation, and enrichment happens server-side.

```
# Gene list — paginated, filtered, sorted
GET /api/v1/genes
  ?search=       # full-text search across symbol, name, ensembl id
  ?biotype=      # filter by biotype (e.g. "Protein Coding")
  ?chromosome=   # filter by chromosome (e.g. "X", "7")
  ?sort_by=      # column to sort by (e.g. "symbol", "chromosome")
  ?order=        # asc | desc
  ?page=         # page number (1-based)
  ?page_size=    # results per page (default 50)
Response: { items: Gene[], total: number, page: number, page_size: number, pages: number }

# Single gene detail
GET /api/v1/genes/{ensembl_id}
Response: Gene (full record)

# Filter metadata — distinct values for dropdowns
GET /api/v1/genes/meta/biotypes
Response: string[]

GET /api/v1/genes/meta/chromosomes
Response: string[]

# Expression data for a gene (proxied from GTEx)
GET /api/v1/genes/{ensembl_id}/expression
  ?source=gtex|ccle|tcga   # optional dataset selector
Response: { tissue: string, median_tpm: number }[]

# Differential expression between two genes
GET /api/v1/genes/differential
  ?gene_a=ENSG...&gene_b=ENSG...
Response: { log2fc: number, pvalue: number, padj: number, ... }
```

All filtering, sorting, aggregation, and external API proxying is handled **in the backend** — the frontend only renders what it receives.

---

## File Structure

```
genome_lens/
├── genes_human.csv              # Source data (semicolon-delimited, ~58k rows)
├── ARCHITECTURE.md
├── README.md
│
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py              # FastAPI app, CORS, router registration
│   │   ├── config.py            # pydantic-settings: DB URL, CORS origins, env vars
│   │   ├── database.py          # SQLAlchemy engine, SessionLocal, Base
│   │   ├── models.py            # ORM model: Gene table (SQLAlchemy)
│   │   ├── schemas.py           # Pydantic schemas: GeneOut, PagedResponse (NOT ORM)
│   │   ├── crud.py              # DB queries: filter, sort, paginate — all in SQL
│   │   ├── routers/
│   │   │   ├── genes.py         # /api/v1/genes — list + detail + meta dropdowns
│   │   │   ├── expression.py    # /api/v1/genes/{id}/expression — proxies GTEx/CCLE
│   │   │   └── differential.py  # /api/v1/genes/differential — DESeq2 via PyDESeq2
│   │   └── seed.py              # One-time CSV → SQLite loader script
│   ├── tests/
│   │   ├── conftest.py          # pytest fixtures, in-memory test DB
│   │   └── test_genes.py        # Integration tests (httpx AsyncClient)
│   ├── pyproject.toml           # deps: fastapi, uvicorn, sqlalchemy, pydantic-settings
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── store/
│   │   │   ├── index.ts                  # Redux configureStore
│   │   │   ├── genesSlice.ts             # selectedGene, UI state (active tab, etc.)
│   │   │   └── api/
│   │   │       └── genomeLensApi.ts      # RTK Query createApi — all /api/v1/* endpoints
│   │   ├── components/
│   │   │   ├── GeneTable/
│   │   │   │   ├── GeneTable.tsx         # mantine-react-table, data via RTK Query
│   │   │   │   └── GeneTable.test.tsx
│   │   │   └── DetailPanel/
│   │   │       ├── DetailPanel.tsx       # Mantine Tabs wrapper + gene metadata header
│   │   │       └── tabs/
│   │   │           ├── GenomicTab.tsx        # Gosling.js — zooms to chromosome locus
│   │   │           ├── ExpressionTab.tsx     # ECharts violin/box — RTK Query → FastAPI
│   │   │           ├── ProteinTab.tsx        # SwissBioPics subcellular location embed
│   │   │           ├── DifferentialTab.tsx   # Volcano plot — RTK Query → FastAPI/PyDESeq2
│   │   │           └── ExternalLinksTab.tsx  # Links to NCBI, Ensembl, UniProt, mygene.info
│   │   ├── types/
│   │   │   └── gene.ts                   # Gene interface, FilterParams, PagedResponse
│   │   ├── App.tsx                       # MantineProvider + Redux Provider + layout
│   │   └── main.tsx
│   ├── tests/
│   │   └── e2e/                          # Playwright E2E specs
│   │       ├── gene-table.spec.ts
│   │       ├── gene-filter.spec.ts
│   │       └── gene-detail.spec.ts
│   ├── playwright.config.ts
│   ├── package.json
│   └── README.md
```

---

## Testing Strategy

### Unit / Component — Rstest

- Render `GeneTable` with mocked RTK Query responses, assert rows appear
- Test sort, filter, and pagination interactions
- Test `DetailPanel` renders correct gene info on selection
- Mock RTK Query endpoints for expression chart tests

### Backend Integration — pytest + httpx

- `conftest.py` spins up an in-memory SQLite DB seeded with fixture data
- Tests cover: list, search, filter by biotype, filter by chromosome, sort, pagination, edge cases (empty results, invalid params)

### E2E — Playwright

- Launches both frontend (Rspack dev server) and backend (Uvicorn) before test run
- Specs: table loads, search filters rows, clicking a row opens detail panel, Gosling track renders, expression chart loads

---

## Performance

### Backend

- SQLite indexes on `biotype`, `chromosome`, `gene_symbol` for fast filtering
- All filtering/sorting/pagination done in SQL — zero in-memory row processing

### Frontend

- RTK Query caches API responses per cache key — no redundant network calls for identical filter/sort/page combinations
- `React.memo` and `useCallback` on heavy components (`GeneTable`, `ExpressionChart`)
- `mantine-react-table` uses virtualization for large row counts

---

## Data Flow Summary

```
RTK Query → FastAPI /api/v1/genes → SQLAlchemy → SQLite
    → GeneTable (filter / sort / paginate — all server-side)
    → row click → Redux setSelectedGene()
                    ↓
              DetailPanel (Mantine Tabs)
                    ├── GenomicTab       → gene record (chr:start-end) from Redux
                    ├── ExpressionTab    → RTK Query → FastAPI /expression  → GTEx proxy
                    ├── ProteinTab       → RTK Query → FastAPI /genes/{id}  → SwissBioPics
                    ├── DifferentialTab  → RTK Query → FastAPI /differential → PyDESeq2
                    └── ExternalLinksTab → static URLs built from gene record
```

**The frontend is a pure rendering layer.** It holds no data logic — every piece of data, aggregation, enrichment, and external API call is the backend's responsibility. The frontend only:

1. Dispatches user actions to Redux (selection, filters, sort)
2. Fires RTK Query hooks that map to FastAPI endpoints
3. Renders the JSON responses using Mantine + Gosling.js + ECharts
