# GenomeLens Backend

FastAPI backend for the GenomeLens application — browse, filter, search, and visualize ~58 000 human genes. All data fetching, filtering, sorting, aggregation, and external API proxying happens here; the frontend is a pure rendering layer.

---

## Tech Stack

| Layer                   | Library / Tool                  |
| ----------------------- | ------------------------------- |
| Web framework           | FastAPI 0.115+                  |
| ASGI server             | Uvicorn                         |
| ORM                     | SQLAlchemy 2.x                  |
| Validation              | Pydantic v2 + pydantic-settings |
| Database                | SQLite (`genome_lens.db`)       |
| External API proxy      | httpx                           |
| Differential expression | PyDESeq2 (scaffold)             |
| Testing                 | pytest + pytest-asyncio         |
| Python                  | ≥ 3.11                          |

---

## Project Layout

```
backend/
├── app/
│   ├── main.py             # FastAPI app factory, middleware, router registration
│   ├── config.py           # pydantic-settings — reads .env
│   ├── database.py         # SQLAlchemy engine, SessionLocal, Base, get_db
│   ├── models.py           # Gene ORM model
│   ├── schemas.py          # Pydantic schemas (GeneOut, VirtualizedResponse, …)
│   ├── crud.py             # All database queries (filter / sort / paginate)
│   ├── seed.py             # CSV → SQLite loader (idempotent)
│   ├── logging_config.py   # Structured logging setup
│   └── routers/
│       ├── genes.py        # /api/v1/genes  +  /api/v1/genes/meta/*
│       ├── expression.py   # /api/v1/genes/{id}/expression  (GTEx proxy)
│       └── differential.py # /api/v1/genes/differential     (PyDESeq2 scaffold)
├── tests/
│   ├── conftest.py         # Fixtures: db_engine (session), db_session (SAVEPOINT), client
│   ├── test_health.py
│   ├── test_gene_list.py
│   ├── test_gene_detail.py
│   ├── test_meta.py
│   └── test_differential.py
├── pyproject.toml
├── .env                    # Local overrides (not committed)
└── genome_lens.db          # SQLite file (not committed)
```

---

## Setup

### 1. Create a virtual environment

```bash
cd backend
python -m venv .venv
```

### 2. Activate it

```bash
# Windows (Git Bash / PowerShell)
source .venv/Scripts/activate
# macOS / Linux
source .venv/bin/activate
```

### 3. Install dependencies

```bash
pip install -e ".[dev]"
```

---

## Seed the Database

The seed script loads `genes_human.csv` (semicolon-delimited, ~58 000 rows) from the project root into SQLite. It is **idempotent** — safe to run multiple times.

```bash
cd backend
python -m app.seed
```

---

## Run the Development Server

```bash
cd backend
uvicorn app.main:app --reload --port 8000
```

Interactive API docs are available at:

- **Swagger UI** → http://localhost:8000/docs
- **ReDoc** → http://localhost:8000/redoc

---

## Environment Variables

Create a `.env` file in the `backend/` directory to override defaults:

```env
DATABASE_URL=sqlite:///./genome_lens.db
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
CSV_PATH=../genes_human.csv
HOST=0.0.0.0
PORT=8000
GTEX_API_BASE=https://gtexportal.org/api/v2
MYGENE_API_BASE=https://mygene.info/v3
```

All fields are optional — sensible defaults are built into `config.py`.

---

## Running Tests

```bash
cd backend
.venv/Scripts/python -m pytest tests/ -v      # Windows
# or
python -m pytest tests/ -v                    # macOS / Linux (venv activated)
```

All tests across all focused modules — all use SAVEPOINT-based transaction isolation (each test always rolls back, no data leaks between tests).

---

## Key Design Decisions

- **Router registration order matters**: the `differential` router is registered _before_ the `genes` router in `main.py` to prevent `/genes/differential` being matched as `/{ensembl_id}`.
- **Fixed-path routes before path parameters**: `/meta/biotypes`, `/meta/chromosomes`, and `/differential` are declared before `/{ensembl_id}` within `genes.py` for the same reason.
- **All filtering in SQL**: `crud.get_genes()` builds the `WHERE` / `ORDER BY` / `LIMIT OFFSET` query server-side — the frontend never receives unfiltered data.
- **`sort_by` validation**: the router validates `sort_by` against the `SORTABLE_COLUMNS` dict in `crud.py` and returns a structured `422` (including a `valid_values` list) for unknown column names — no silent fallback.
- **`has_more` flag**: `VirtualizedResponse` includes `has_more: bool` computed as `(offset + len(items)) < total`. The virtualized table uses this instead of computing it client-side.
- **`name` search index**: `ix_genes_name` is defined on `Gene.name` to speed up the ILIKE search path that covers all three text columns.
- **Idempotent seed**: `seed.py` checks row count before inserting, so re-running is safe.
