"""Gene list endpoint tests."""


def test_list_genes_default(client):
    r = client.get("/api/v1/genes")
    assert r.status_code == 200
    body = r.json()
    assert body["total"] == 5
    assert len(body["items"]) == 5
    assert body["page"] == 1
    assert body["pages"] == 1


def test_list_genes_pagination(client):
    r = client.get("/api/v1/genes?page=1&page_size=2")
    assert r.status_code == 200
    body = r.json()
    assert len(body["items"]) == 2
    assert body["total"] == 5
    assert body["pages"] == 3


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


def test_list_genes_sort_desc(client):
    r = client.get("/api/v1/genes?sort_by=gene_symbol&order=desc")
    assert r.status_code == 200
    symbols = [g["gene_symbol"] for g in r.json()["items"] if g["gene_symbol"]]
    assert symbols == sorted(symbols, reverse=True)


def test_list_genes_empty_result(client):
    r = client.get("/api/v1/genes?search=DOESNOTEXIST")
    assert r.status_code == 200
    body = r.json()
    assert body["total"] == 0
    assert body["items"] == []
    assert body["pages"] == 0
