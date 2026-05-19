# syntax=docker/dockerfile:1

# ── Builder: compile native extensions inside a throwaway layer ────────────────
FROM python:3.11-slim AS builder

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /build

RUN apt-get update \
    && apt-get install -y --no-install-recommends build-essential \
    && rm -rf /var/lib/apt/lists/*

# Create venv first so dependency layer is cached independently from app code
RUN python -m venv /venv
ENV PATH="/venv/bin:$PATH"

COPY backend/pyproject.toml ./
RUN pip install --upgrade pip setuptools wheel \
    && pip install --no-cache-dir .

# ── Runtime: minimal image with no build toolchain ────────────────────────────
FROM python:3.11-slim AS runtime

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PATH="/venv/bin:$PATH" \
    # Server
    HOST=0.0.0.0 \
    PORT=8000 \
    WORKERS=1 \
    ENVIRONMENT=production \
    DEBUG=False \
    # Database
    DATABASE_URL=sqlite:////app/data/genome_lens.db \
    # Seed data
    CSV_PATH=/app/genes_human.csv \
    # External APIs
    GTEX_API_BASE=https://gtexportal.org/api/v2 \
    MYGENE_API_BASE=https://mygene.info/v3

# Least-privilege: dedicated system user/group
RUN addgroup --system appgroup \
    && adduser --system --ingroup appgroup --no-create-home appuser

WORKDIR /app

# Persistent data directory owned by appuser (SQLite db lives here)
RUN mkdir -p /app/data && chown appuser:appgroup /app/data

# Copy venv from builder — no compiler toolchain in the final image
COPY --from=builder /venv /venv

# Copy application source and seed data
# genes_human.csv lives in backend/ — build context is project root ('.')
COPY backend/app ./app
COPY backend/genes_human.csv ./genes_human.csv
COPY backend/entrypoint.sh ./entrypoint.sh
RUN chmod +x entrypoint.sh && chown -R appuser:appgroup /app

USER appuser

EXPOSE 8000

# Liveness probe: tiny stdlib HTTP call, no extra deps required
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/health')" || exit 1

CMD ["./entrypoint.sh"]
