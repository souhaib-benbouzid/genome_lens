from sqlalchemy import Index, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class Gene(Base):
    __tablename__ = "genes"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    ensembl_id: Mapped[str] = mapped_column(String(20), unique=True, nullable=False, index=True)
    gene_symbol: Mapped[str | None] = mapped_column(String(64), nullable=True)
    name: Mapped[str | None] = mapped_column(String(512), nullable=True)
    biotype: Mapped[str | None] = mapped_column(String(64), nullable=True)
    chromosome: Mapped[str | None] = mapped_column(String(8), nullable=True)
    seq_region_start: Mapped[int | None] = mapped_column(Integer, nullable=True)
    seq_region_end: Mapped[int | None] = mapped_column(Integer, nullable=True)


# Composite indexes for the most common filter combinations
Index("ix_genes_biotype", Gene.biotype)
Index("ix_genes_chromosome", Gene.chromosome)
Index("ix_genes_symbol", Gene.gene_symbol)
