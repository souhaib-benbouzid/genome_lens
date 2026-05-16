from pydantic import BaseModel, ConfigDict


class GeneOut(BaseModel):
    """Serialized gene returned by the API."""

    id: int
    ensembl_id: str
    gene_symbol: str | None
    name: str | None
    biotype: str | None
    chromosome: str | None
    seq_region_start: int | None
    seq_region_end: int | None

    model_config = ConfigDict(from_attributes=True)


class PagedResponse(BaseModel):
    """Generic paginated response envelope."""

    items: list[GeneOut]
    total: int
    page: int
    page_size: int
    pages: int


class ExpressionPoint(BaseModel):
    """Single tissue expression value."""

    tissue: str
    median_tpm: float


class DifferentialResult(BaseModel):
    """Differential expression result between two genes."""

    gene_a: str
    gene_b: str
    log2_fold_change: float
    p_value: float
    p_adj: float
    significant: bool
