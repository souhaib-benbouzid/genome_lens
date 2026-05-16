from pathlib import Path

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


BASE_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = BASE_DIR.parent
DEFAULT_DATABASE_URL = f"sqlite:///{PROJECT_ROOT / 'genome_lens.db'}"
DEFAULT_CSV_PATH = str(PROJECT_ROOT / "genes_human.csv")


class Settings(BaseSettings):
    database_url: str = Field(
        default=DEFAULT_DATABASE_URL,
        description="SQLAlchemy connection string (DATABASE_URL)",
    )

    # Plain string — avoids pydantic-settings trying json.loads() on a list field.
    # Use the .cors_origins_list property wherever a list is needed.
    cors_origins: str = Field(
        default="http://localhost:3000,http://localhost:8080",
        description="Comma-separated CORS origins (CORS_ORIGINS)",
    )

    csv_path: str = Field(
        default=DEFAULT_CSV_PATH,
        description="Path to the genes CSV seed file (CSV_PATH)",
    )

    host: str = Field(
        default="0.0.0.0",
        description="Uvicorn bind host (HOST)",
    )
    port: int = Field(
        default=8000,
        description="Uvicorn bind port (PORT)",
    )

    gtex_api_base: str = Field(
        default="https://gtexportal.org/api/v2",
        description="GTEx REST API base URL (GTEX_API_BASE)",
    )
    mygene_api_base: str = Field(
        default="https://mygene.info/v3",
        description="MyGene.info REST API base URL (MYGENE_API_BASE)",
    )

    model_config = SettingsConfigDict(
        env_file=BASE_DIR.parent / ".env",
        env_file_encoding="utf-8",
    )

    @property
    def cors_origins_list(self) -> list[str]:
        """Returns cors_origins as a parsed list for use in CORSMiddleware."""
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]


settings = Settings()
