from typing import Annotated, Literal

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app import crud
from app.crud import SORTABLE_COLUMNS
from app.database import get_db
from app.schemas import GeneOut, VirtualizedResponse

router = APIRouter(prefix="/genes", tags=["genes"])

_VALID_SORT_COLUMNS = sorted(SORTABLE_COLUMNS.keys())


@router.get("", response_model=VirtualizedResponse)
def list_genes(
    db: Annotated[Session, Depends(get_db)],
    search: str | None = Query(
        None, description="Search across Ensembl ID, symbol, name"
    ),
    biotype: str | None = Query(None),
    chromosome: str | None = Query(None),
    sort_by: str = Query(
        "gene_symbol",
        description=f"Column to sort by. Valid values: {_VALID_SORT_COLUMNS}",
    ),
    order: Literal["asc", "desc"] = Query("asc"),
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
):
    if sort_by not in SORTABLE_COLUMNS:
        raise HTTPException(
            status_code=422,
            detail={
                "msg": f"Invalid sort_by value '{sort_by}'.",
                "valid_values": _VALID_SORT_COLUMNS,
            },
        )
    return crud.get_genes(
        db,
        search=search,
        biotype=biotype,
        chromosome=chromosome,
        sort_by=sort_by,
        order=order,
        offset=offset,
        limit=limit,
    )


# NOTE: Fixed-path routes MUST be declared before /{ensembl_id} to avoid
# FastAPI matching "meta" or "differential" as an Ensembl ID.


@router.get("/meta/biotypes", response_model=list[str])
def list_biotypes(db: Annotated[Session, Depends(get_db)]):
    """Distinct biotype values — used to populate the filter dropdown."""
    return crud.get_distinct_biotypes(db)


@router.get("/meta/chromosomes", response_model=list[str])
def list_chromosomes(db: Annotated[Session, Depends(get_db)]):
    """Distinct chromosome values — used to populate the filter dropdown."""
    return crud.get_distinct_chromosomes(db)


@router.get("/{ensembl_id}", response_model=GeneOut)
def get_gene(ensembl_id: str, db: Annotated[Session, Depends(get_db)]):
    gene = crud.get_gene_by_ensembl(db, ensembl_id)
    if not gene:
        raise HTTPException(status_code=404, detail=f"Gene '{ensembl_id}' not found")
    return gene
