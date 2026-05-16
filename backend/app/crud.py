import math
from typing import Literal

from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session
from sqlalchemy.sql import ColumnElement

from app.models import Gene
from app.schemas import GeneOut, PagedResponse

SORTABLE_COLUMNS: dict[str, ColumnElement] = {
    "ensembl_id": Gene.ensembl_id,
    "gene_symbol": Gene.gene_symbol,
    "name": Gene.name,
    "biotype": Gene.biotype,
    "chromosome": Gene.chromosome,
    "seq_region_start": Gene.seq_region_start,
    "seq_region_end": Gene.seq_region_end,
}


def get_genes(
    db: Session,
    *,
    search: str | None = None,
    biotype: str | None = None,
    chromosome: str | None = None,
    sort_by: str = "gene_symbol",
    order: Literal["asc", "desc"] = "asc",
    page: int = 1,
    page_size: int = 50,
) -> PagedResponse:
    query = select(Gene)

    # --- Filters ---
    if search:
        pattern = f"%{search}%"
        query = query.where(
            or_(
                Gene.ensembl_id.ilike(pattern),
                Gene.gene_symbol.ilike(pattern),
                Gene.name.ilike(pattern),
            )
        )

    if biotype:
        query = query.where(Gene.biotype == biotype)

    if chromosome:
        query = query.where(Gene.chromosome == chromosome)

    # --- Total count (before pagination) ---
    total: int = db.execute(
        select(func.count()).select_from(query.subquery())
    ).scalar_one()

    # --- Sorting ---
    sort_col = SORTABLE_COLUMNS.get(sort_by, Gene.gene_symbol)
    sort_expr = sort_col.desc() if order == "desc" else sort_col.asc()
    query = query.order_by(sort_expr)

    # --- Pagination ---
    query = query.offset((page - 1) * page_size).limit(page_size)

    genes = db.execute(query).scalars().all()
    items = [GeneOut.model_validate(gene) for gene in genes]

    return PagedResponse(
        items=items,
        total=total,
        page=page,
        page_size=page_size,
        pages=math.ceil(total / page_size) if total else 0,
    )


def get_gene_by_ensembl(db: Session, ensembl_id: str) -> Gene | None:
    return db.execute(select(Gene).where(Gene.ensembl_id == ensembl_id)).scalar_one_or_none()


def get_distinct_biotypes(db: Session) -> list[str]:
    rows = db.execute(
        select(Gene.biotype).distinct().where(Gene.biotype.isnot(None)).order_by(Gene.biotype)
    ).scalars()
    return list(rows)


def get_distinct_chromosomes(db: Session) -> list[str]:
    rows = db.execute(
        select(Gene.chromosome).distinct().where(Gene.chromosome.isnot(None))
    ).scalars()
    def chrom_sort_key(c: str) -> tuple:
        if c.isdigit():
            return (0, int(c), "")
        return (1, 0, c)

    return sorted(rows, key=chrom_sort_key)
