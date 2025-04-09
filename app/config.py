import os
import logging.config

print(">>> Caricamento config.py")

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
LOGS_DIR = os.path.abspath(os.path.join(BASE_DIR, "..", "logs"))
os.makedirs(LOGS_DIR, exist_ok=True)

LOG_FILE = os.path.abspath(os.path.join(LOGS_DIR, "app.log"))

LOGGING_CONFIG = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "standard": {
            "format": "%(asctime)s [%(levelname)s] %(name)s: %(message)s"
        },
    },
    "handlers": {
        "file_handler": {
            "class": "logging.handlers.RotatingFileHandler",  # ✅
            "formatter": "standard",
            "filename": LOG_FILE,
            "level": "INFO",
            "maxBytes": 5 * 1024 * 1024,  # ✅ 5MB per file
            "backupCount": 5,             # ✅ mantieni fino a 5 file di backup
            "encoding": "utf-8",          # ✅ supporta caratteri speciali
        },
        "console": {
            "class": "logging.StreamHandler",
            "formatter": "standard",
            "level": "DEBUG",
        },
    },
    "root": {
        "handlers": ["file_handler", "console"],
        "level": "DEBUG",
    },
}
    
def setup_logging():
    logging.config.dictConfig(LOGGING_CONFIG)
