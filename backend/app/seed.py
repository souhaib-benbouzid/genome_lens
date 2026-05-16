"""
Seed script — loads genes_human.csv into the SQLite database.
Run once before starting the server:  python -m app.seed

The CSV is semicolon-delimited with these columns:
  Ensembl;Gene symbol;Name;Biotype;Chromosome;Seq region start;Seq region end
"""

import csv
import sys
from pathlib import Path

from sqlalchemy import text
from sqlalchemy.orm import Session

from app.config import settings
from app.database import Base, SessionLocal, engine
from app.models import Gene


def seed(csv_path: str | None = None) -> None:
    path = Path(csv_path or settings.csv_path)

    if not path.exists():
        print(f"[seed] CSV not found at '{path}'. Aborting.", file=sys.stderr)
        sys.exit(1)

    print("[seed] Creating tables...")
    Base.metadata.create_all(bind=engine)

    db: Session = SessionLocal()
    try:
        existing = db.execute(text("SELECT COUNT(*) FROM genes")).scalar()
        if existing and existing > 0:
            print(f"[seed] Database already contains {existing} genes. Skipping seed.")
            return

        print(f"[seed] Reading {path}...")
        genes: list[Gene] = []

        with open(path, newline="", encoding="utf-8") as f:
            reader = csv.DictReader(f, delimiter=";")
            for row in reader:
                genes.append(
                    Gene(
                        ensembl_id=row["Ensembl"].strip(),
                        gene_symbol=row["Gene symbol"].strip() or None,
                        name=row["Name"].strip() or None,
                        biotype=row["Biotype"].strip() or None,
                        chromosome=row["Chromosome"].strip() or None,
                        seq_region_start=int(row["Seq region start"]) if row["Seq region start"].strip() else None,
                        seq_region_end=int(row["Seq region end"]) if row["Seq region end"].strip() else None,
                    )
                )

        # Bulk insert in batches for performance
        BATCH = 1000
        for i in range(0, len(genes), BATCH):
            db.add_all(genes[i : i + BATCH])
            db.commit()
            print(f"[seed] Inserted {min(i + BATCH, len(genes))}/{len(genes)} genes...", end="\r")

        print(f"\n[seed] Done — {len(genes)} genes loaded.")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
