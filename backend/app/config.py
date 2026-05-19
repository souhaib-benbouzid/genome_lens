from pathlib import Path

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parent


class Settings(BaseSettings):
    # ── Server ────────────────────────────────────────────────────────────────
    host: str = Field(default="0.0.0.0", description="Uvicorn bind host (HOST)")
    port: int = Field(default=8000, description="Uvicorn bind port (PORT)")
    workers: int = Field(default=1, description="Uvicorn worker count (WORKERS)")
    environment: str = Field(
        default="production", description="App environment (ENVIRONMENT)"
    )
    debug: bool = Field(default=False, description="Debug mode (DEBUG)")

    # ── Database ──────────────────────────────────────────────────────────────
    database_url: str = Field(description="SQLAlchemy connection string (DATABASE_URL)")

    # ── Seed data ─────────────────────────────────────────────────────────────
    csv_path: str = Field(description="Path to the genes CSV seed file (CSV_PATH)")

    # ── CORS ──────────────────────────────────────────────────────────────────
    # Plain string — avoids pydantic-settings trying json.loads() on a list field.
    # Use the .cors_origins_list property wherever a list is needed.
    cors_origins: str = Field(description="Comma-separated CORS origins (CORS_ORIGINS)")

    # ── External APIs ─────────────────────────────────────────────────────────
    gtex_api_base: str = Field(description="GTEx REST API base URL (GTEX_API_BASE)")
    mygene_api_base: str = Field(
        description="MyGene.info REST API base URL (MYGENE_API_BASE)"
    )

    model_config = SettingsConfigDict(
        # Reads backend/.env (one level above backend/app/)
        # In production the container gets vars injected via docker compose env_file,
        # so this file path is primarily useful for running outside Docker (tests, local).
        env_file=BASE_DIR.parent / ".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )

    @property
    def cors_origins_list(self) -> list[str]:
        """Returns cors_origins as a parsed list for use in CORSMiddleware."""
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]

    @property
    def is_development(self) -> bool:
        return self.environment.lower() == "development"


settings = Settings()
