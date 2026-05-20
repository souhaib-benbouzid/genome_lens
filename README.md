<p align="center">
    <img src="./frontend/src/assets/banner.png" alt="GenomeLens Logo" width="345" />
</p>

<p align="center">
Browse, filter, search, and visualize ~58 000 human genes in a virtualized infinite-scroll table.
</p>

<p align="center">
<a href="https://github.com/souhaib-benbouzid/genome_lens"><img src="https://img.shields.io/github/stars/souhaib-benbouzid/genome_lens?style=social" alt="GitHub Stars"></a>
<a href="https://github.com/souhaib-benbouzid/genome_lens/issues"><img src="https://img.shields.io/github/issues/souhaib-benbouzid/genome_lens" alt="GitHub Issues"></a>
<a href="https://github.com/souhaib-benbouzid/genome_lens/commits/master"><img src="https://img.shields.io/github/last-commit/souhaib-benbouzid/genome_lens" alt="Last Commit"></a>
<a href="https://github.com/souhaib-benbouzid/genome_lens/pulls"><img src="https://img.shields.io/github/issues-pr/souhaib-benbouzid/genome_lens" alt="Pull Requests"></a>
<a href="https://github.com/souhaib-benbouzid/genome_lens/blob/master/LICENSE"><img src="https://img.shields.io/npm/l/tailwindcss.svg" alt="License"></a>
</p>

---

## Highlights

- **Virtualized table** — only the visible row window is fetched; the API drives scrollbar sizing via a `total` count and signals further pages with `has_more`
- **Server-side everything** — all filtering, sorting, and windowing happens in SQL; the frontend is a pure rendering layer
- **Full-text search** — searches across Ensembl ID, gene symbol, and gene name with indexed ILIKE queries
- **Detail panel** — tabbed view per gene: genomic track (Gosling.js), expression chart (ECharts + GTEx proxy), differential expression (PyDESeq2 scaffold), and external links
- **Type-safe end-to-end** — Pydantic v2 schemas on the backend, TypeScript interfaces on the frontend, RTK Query for data fetching

---

## Documentation

| Document                                   | Description                                                               |
| ------------------------------------------ | ------------------------------------------------------------------------- |
| [ARCHITECTURE.md](./ARCHITECTURE.md)       | Full system design, API contract, data-flow diagrams, deployment topology |
| [backend/README.md](./backend/README.md)   | Backend setup, environment variables, seeding, running tests              |
| [frontend/README.md](./frontend/README.md) | Frontend setup, dev server, build                                         |

---

## Quick Start

### Production (Docker Compose)

1. Clone the repository:

   ```bash
   git clone https://github.com/souhaib-benbouzid/genome_lens.git
   cd genome_lens
   ```

2. Copy and configure environment files:

   ```bash
   cp frontend/.env.example frontend/.env.prod
   cp backend/.env.example backend/.env.prod
   ```

3. Build and start:

   ```bash
   docker-compose -f docker-compose.prod.yml up --build
   ```

   The app is available at `http://localhost:80`. The backend API is **not** exposed to the host — it is only reachable from inside the Docker network by the nginx frontend container.

### Development (hot-reload)

1. Copy dev environment files:

   ```bash
   cp frontend/.env.example frontend/.env
   cp backend/.env.example backend/.env
   ```

2. Start with hot-reloading:

   ```bash
   docker-compose -f docker-compose.dev.yml up --build
   ```

   | Service                      | URL                         |
   | ---------------------------- | --------------------------- |
   | Frontend (Rspack dev server) | http://localhost:8080       |
   | Backend API (Uvicorn)        | http://localhost:8000       |
   | Swagger UI                   | http://localhost:8000/docs  |
   | ReDoc                        | http://localhost:8000/redoc |

---

## Contributing

Contributions are welcome! If you have any ideas, suggestions, or bug fixes, please feel free to open an issue or submit a pull request.
