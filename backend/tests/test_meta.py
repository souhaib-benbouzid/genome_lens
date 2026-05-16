"""Metadata endpoint tests for filter dropdown values."""


def test_meta_biotypes(client):
    r = client.get("/api/v1/genes/meta/biotypes")
    assert r.status_code == 200
    biotypes = r.json()
    assert "Protein Coding" in biotypes
    assert "Linc RNA" in biotypes


def test_meta_chromosomes(client):
    r = client.get("/api/v1/genes/meta/chromosomes")
    assert r.status_code == 200
    chromosomes = r.json()
    assert "17" in chromosomes
    assert "X" in chromosomes
    assert chromosomes.index("17") < chromosomes.index("X")
