"""
Logging configuration for the application.
"""

import sys
import logging
from typing import Any, Dict
from pathlib import Path

import structlog
from structlog.types import FilteringBoundLogger

from app.core.config import settings


def configure_logging() -> FilteringBoundLogger:
    """Configure structured logging with structlog."""
    
    # Create logs directory if it doesn't exist
    log_dir = Path("logs")
    log_dir.mkdir(exist_ok=True)
    
    # Configure structlog
    structlog.configure(
        processors=[
            structlog.contextvars.merge_contextvars,
            structlog.processors.add_log_level,
            structlog.processors.StackInfoRenderer(),
            structlog.dev.set_exc_info,
            structlog.processors.TimeStamper(fmt="ISO"),
            structlog.dev.ConsoleRenderer() if settings.debug else structlog.processors.JSONRenderer(),
        ],
        wrapper_class=structlog.make_filtering_bound_logger(
            getattr(logging, settings.log_level.upper())
        ),
        logger_factory=structlog.WriteLoggerFactory(
            file=sys.stdout if settings.debug else open(log_dir / "app.log", "a")
        ),
        cache_logger_on_first_use=True,
    )
    
    # Get logger
    logger = structlog.get_logger("portman")
    
    return logger


# Global logger instance
logger = configure_logging()


def get_logger(name: str = "portman") -> FilteringBoundLogger:
    """Get a logger instance with the given name."""
    return structlog.get_logger(name)
