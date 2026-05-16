"""
pytest fixtures — shared across all backend tests.
Uses an in-memory SQLite DB so tests never touch the real database.

Strategy:
- `db_engine` is session-scoped — created once, tables set up once
- `db_session` wraps each test in a SAVEPOINT transaction that is always
  rolled back in teardown, keeping tests fully isolated without re-seeding
"""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker

from app.database import Base, get_db
from app.main import app
from app.models import Gene

TEST_DATABASE_URL = "sqlite:///:memory:"

FIXTURE_GENES = [
    Gene(ensembl_id="ENSG00000000001", gene_symbol="BRCA1", name="Breast cancer 1", biotype="Protein Coding", chromosome="17", seq_region_start=43044295, seq_region_end=43125483),
    Gene(ensembl_id="ENSG00000000002", gene_symbol="TP53", name="Tumour protein p53", biotype="Protein Coding", chromosome="17", seq_region_start=7661779, seq_region_end=7687538),
    Gene(ensembl_id="ENSG00000000003", gene_symbol="XIST", name="X inactive specific transcript", biotype="Linc RNA", chromosome="X", seq_region_start=73820651, seq_region_end=73852723),
    Gene(ensembl_id="ENSG00000000004", gene_symbol="EGFR", name="Epidermal growth factor receptor", biotype="Protein Coding", chromosome="7", seq_region_start=55019021, seq_region_end=55211628),
    Gene(ensembl_id="ENSG00000000005", gene_symbol=None, name=None, biotype="Linc RNA", chromosome="4", seq_region_start=100000, seq_region_end=200000),
]


@pytest.fixture(scope="session")
def db_engine():
    """One engine + schema for the entire test session. Seeded once."""
    engine = create_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})
    Base.metadata.create_all(bind=engine)

    # Seed fixture data once for the whole session
    SessionSeed = sessionmaker(bind=engine)
    with SessionSeed() as s:
        s.add_all(FIXTURE_GENES)
        s.commit()

    yield engine

    Base.metadata.drop_all(bind=engine)


@pytest.fixture
def db_session(db_engine):
    """
    Per-test session wrapped in a nested transaction (SAVEPOINT).
    Always rolled back on teardown — the base seeded data is never mutated.
    """
    connection = db_engine.connect()
    transaction = connection.begin()
    SessionTest = sessionmaker(bind=connection)
    session = SessionTest()

    # Ensure SQLAlchemy's own BEGIN doesn't interfere with our outer transaction
    @event.listens_for(session, "after_transaction_end")
    def restart_savepoint(session, trans):
        if trans.nested and not trans._parent.nested:
            session.begin_nested()

    session.begin_nested()  # SAVEPOINT

    yield session

    session.close()
    transaction.rollback()
    connection.close()


@pytest.fixture
def client(db_session):
    """Test client with the real DB dependency overridden by the per-test session."""
    def override_get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()
