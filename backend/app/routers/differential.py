"""
Differential expression router — compares expression profiles of two genes using PyDESeq2.
All heavy computation stays in the backend; the frontend only receives the result.
"""

from fastapi import APIRouter, HTTPException, Query

from app.schemas import DifferentialResult

router = APIRouter(prefix="/genes", tags=["differential"])


@router.get("/differential", response_model=DifferentialResult)
async def differential_expression(
    gene_a: str = Query(..., description="Ensembl ID of gene A"),
    gene_b: str = Query(..., description="Ensembl ID of gene B"),
):
    """
    Compute differential expression between two genes.
    Uses PyDESeq2 under the hood with GTEx bulk RNA-seq counts as input.

    NOTE: Full PyDESeq2 integration requires a counts matrix for the two genes.
    This scaffold returns a structured placeholder — wire up your counts source here.
    """
    if gene_a == gene_b:
        raise HTTPException(
            status_code=400, detail="gene_a and gene_b must be different"
        )

    # TODO: fetch counts matrix for gene_a and gene_b from GTEx / CCLE / local store
    # then run PyDESeq2 and return real values
    # from pydeseq2.dds import DeseqDataSet
    # from pydeseq2.ds import DeseqStats
    # ...

    # Placeholder response — replace with real PyDESeq2 output
    return DifferentialResult(
        gene_a=gene_a,
        gene_b=gene_b,
        log2_fold_change=0.0,
        p_value=1.0,
        p_adj=1.0,
        significant=False,
    )
