"""Differential expression endpoint tests."""


def test_differential_same_gene(client):
    r = client.get(
        "/api/v1/genes/differential?gene_a=ENSG00000000001&gene_b=ENSG00000000001"
    )
    assert r.status_code == 400


def test_differential_different_genes(client):
    r = client.get(
        "/api/v1/genes/differential?gene_a=ENSG00000000001&gene_b=ENSG00000000002"
    )
    assert r.status_code == 200
    body = r.json()
    assert body["gene_a"] == "ENSG00000000001"
    assert body["gene_b"] == "ENSG00000000002"
    assert "log2_fold_change" in body
