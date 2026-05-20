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


class VirtualizedResponse(BaseModel):
    """Paginated response envelope for virtualized / infinite-scroll tables.

    Fields
    ------
    items     : rows for the requested window
    total     : total rows matching the current filters (for scrollbar sizing)
    offset    : first row index of this window
    limit     : requested window size
    has_more  : True when there are rows beyond the current window
    """

    items: list[GeneOut]
    total: int
    limit: int
    offset: int
    has_more: bool


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
