import logging
import sys
from pythonjsonlogger import jsonlogger


def setup_logging():
    logger = logging.getLogger()
    logger.setLevel(logging.INFO)

    # Clear default handlers 
    logger.handlers.clear()

    # -------- Console Handler --------
    console_handler = logging.StreamHandler(sys.stdout)
    console_formatter = logging.Formatter(
        "%(asctime)s - %(levelname)s - %(message)s"
    )
    console_handler.setFormatter(console_formatter)

    # -------- File Handle --------
    file_handler = logging.FileHandler("app.log")
    json_formatter = jsonlogger.JsonFormatter(
        "%(asctime)s %(levelname)s %(message)s %(url)s %(method)s %(process_time)s"
    )

    file_handler.setFormatter(json_formatter)

    logger.addHandler(console_handler)
    logger.addHandler(file_handler)
