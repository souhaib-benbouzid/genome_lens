"""
Centralized logging configuration for GenomeLens backend.
Call setup_logging() once at application startup (in main.py).

All modules should use:
    import logging
    logger = logging.getLogger(__name__)

Log levels:
    DEBUG   — verbose, dev only
    INFO    — normal operation
    WARNING — unexpected but recoverable
    ERROR   — failures that need attention
"""

import logging
import sys


def setup_logging(level: str = "INFO") -> None:
    """Configure the root logger with a consistent format."""
    log_level = getattr(logging, level.upper(), logging.INFO)

    formatter = logging.Formatter(
        fmt="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )

    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(formatter)

    root_logger = logging.getLogger()
    root_logger.setLevel(log_level)

    # Avoid adding duplicate handlers on reload
    if not root_logger.handlers:
        root_logger.addHandler(handler)

    # Suppress noisy third-party loggers
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)
    logging.getLogger("sqlalchemy.engine").setLevel(logging.WARNING)
