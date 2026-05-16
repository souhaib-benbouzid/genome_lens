"""
Expression router — proxies GTEx tissue expression data for a given gene.
The frontend never calls GTEx directly; all external API calls go through here.
"""
import logging

from fastapi import APIRouter, HTTPException
import httpx

from app.config import settings
from app.schemas import ExpressionPoint

router = APIRouter(prefix="/genes", tags=["expression"])
logger = logging.getLogger(__name__)


@router.get("/{ensembl_id}/expression", response_model=list[ExpressionPoint])
async def get_expression(ensembl_id: str):
    """
    Fetch median TPM expression values per tissue from GTEx for the given Ensembl gene ID.
    Returns a list of { tissue, median_tpm } objects ready for the ECharts violin/box plot.
    """
    url = f"{settings.gtex_api_base}/expression/geneExpression"
    params = {"gencodeId": ensembl_id, "datasetId": "gtex_v8"}

    async with httpx.AsyncClient(timeout=15.0) as client:
        try:
            response = await client.get(url, params=params)
            response.raise_for_status()
        except httpx.HTTPStatusError as exc:
            logger.error(
                "GTEx API returned %s for gene %s: %s",
                exc.response.status_code,
                ensembl_id,
                exc.response.text,
            )
            raise HTTPException(
                status_code=exc.response.status_code,
                detail="GTEx API returned an error",
            ) from exc
        except httpx.RequestError as exc:
            logger.error("GTEx API request failed for gene %s: %s", ensembl_id, exc)
            raise HTTPException(status_code=503, detail="GTEx API unreachable") from exc

    data = response.json()

    # GTEx returns a list of gene expression objects; we extract tissue + median TPM
    results: list[ExpressionPoint] = []
    for entry in data.get("geneExpression", []):
        tissue = entry.get("tissueSiteDetailId", "")
        median = entry.get("median", None)
        if tissue and median is not None:
            results.append(ExpressionPoint(tissue=tissue, median_tpm=float(median)))

    return sorted(results, key=lambda x: x.tissue)
