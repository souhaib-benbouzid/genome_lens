"""Gene list endpoint tests — offset/limit (virtualized-table) API."""


# ---------------------------------------------------------------------------
# Response shape
# ---------------------------------------------------------------------------

def test_list_genes_response_shape(client):
    """All VirtualizedResponse fields must be present."""
    r = client.get("/api/v1/genes")
    assert r.status_code == 200
    body = r.json()
    assert "items" in body
    assert "total" in body
    assert "offset" in body
    assert "limit" in body
    assert "has_more" in body


def test_list_genes_default(client):
    """Default request returns all 5 fixture genes in one window."""
    r = client.get("/api/v1/genes")
    assert r.status_code == 200
    body = r.json()
    assert body["total"] == 5
    assert len(body["items"]) == 5
    assert body["offset"] == 0
    assert body["has_more"] is False


# ---------------------------------------------------------------------------
# Offset / limit windowing (core virtual-scroll behaviour)
# ---------------------------------------------------------------------------

def test_list_genes_first_window(client):
    """First window of 2 rows — has_more must be True."""
    r = client.get("/api/v1/genes?offset=0&limit=2")
    assert r.status_code == 200
    body = r.json()
    assert len(body["items"]) == 2
    assert body["total"] == 5
    assert body["offset"] == 0
    assert body["limit"] == 2
    assert body["has_more"] is True


def test_list_genes_middle_window(client):
    """Middle window — has_more still True."""
    r = client.get("/api/v1/genes?offset=2&limit=2")
    assert r.status_code == 200
    body = r.json()
    assert len(body["items"]) == 2
    assert body["has_more"] is True


def test_list_genes_last_window(client):
    """Last partial window — has_more must be False."""
    r = client.get("/api/v1/genes?offset=4&limit=2")
    assert r.status_code == 200
    body = r.json()
    assert len(body["items"]) == 1
    assert body["has_more"] is False


def test_list_genes_offset_beyond_total(client):
    """Offset past the end — empty items and has_more=False."""
    r = client.get("/api/v1/genes?offset=100&limit=10")
    assert r.status_code == 200
    body = r.json()
    assert body["items"] == []
    assert body["has_more"] is False


# ---------------------------------------------------------------------------
# Search
# ---------------------------------------------------------------------------

def test_list_genes_search_by_symbol(client):
    r = client.get("/api/v1/genes?search=BRCA")
    assert r.status_code == 200
    items = r.json()["items"]
    assert len(items) == 1
    assert items[0]["gene_symbol"] == "BRCA1"


def test_list_genes_search_by_ensembl(client):
    r = client.get("/api/v1/genes?search=ENSG00000000003")
    assert r.status_code == 200
    items = r.json()["items"]
    assert len(items) == 1
    assert items[0]["ensembl_id"] == "ENSG00000000003"


def test_list_genes_empty_result(client):
    r = client.get("/api/v1/genes?search=DOESNOTEXIST")
    assert r.status_code == 200
    body = r.json()
    assert body["total"] == 0
    assert body["items"] == []
    assert body["has_more"] is False


# ---------------------------------------------------------------------------
# Filters
# ---------------------------------------------------------------------------

def test_list_genes_filter_biotype(client):
    r = client.get("/api/v1/genes?biotype=Protein Coding")
    assert r.status_code == 200
    items = r.json()["items"]
    assert all(g["biotype"] == "Protein Coding" for g in items)
    assert len(items) == 3


def test_list_genes_filter_chromosome(client):
    r = client.get("/api/v1/genes?chromosome=17")
    assert r.status_code == 200
    items = r.json()["items"]
    assert all(g["chromosome"] == "17" for g in items)
    assert len(items) == 2


# ---------------------------------------------------------------------------
# Sorting
# ---------------------------------------------------------------------------

def test_list_genes_sort_asc(client):
    r = client.get("/api/v1/genes?sort_by=gene_symbol&order=asc")
    assert r.status_code == 200
    symbols = [g["gene_symbol"] for g in r.json()["items"] if g["gene_symbol"]]
    assert symbols == sorted(symbols)


def test_list_genes_sort_desc(client):
    r = client.get("/api/v1/genes?sort_by=gene_symbol&order=desc")
    assert r.status_code == 200
    symbols = [g["gene_symbol"] for g in r.json()["items"] if g["gene_symbol"]]
    assert symbols == sorted(symbols, reverse=True)


def test_list_genes_invalid_sort_by_returns_422(client):
    """Unknown sort column must be rejected, not silently ignored."""
    r = client.get("/api/v1/genes?sort_by=not_a_column")
    assert r.status_code == 422
    detail = r.json()["detail"]
    assert "valid_values" in detail


# ---------------------------------------------------------------------------
# Query-parameter validation (FastAPI built-in)
# ---------------------------------------------------------------------------

def test_list_genes_limit_too_large_returns_422(client):
    r = client.get("/api/v1/genes?limit=999")
    assert r.status_code == 422


def test_list_genes_negative_offset_returns_422(client):
    r = client.get("/api/v1/genes?offset=-1")
    assert r.status_code == 422
