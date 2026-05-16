"""Single gene detail endpoint tests."""


def test_get_gene_found(client):
    r = client.get("/api/v1/genes/ENSG00000000002")
    assert r.status_code == 200
    body = r.json()
    assert body["ensembl_id"] == "ENSG00000000002"
    assert body["gene_symbol"] == "TP53"


def test_get_gene_not_found(client):
    r = client.get("/api/v1/genes/ENSG_FAKE")
    assert r.status_code == 404
