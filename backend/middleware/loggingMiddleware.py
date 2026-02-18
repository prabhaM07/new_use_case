import logging
import time
from fastapi import Request

logger = logging.getLogger(__name__)

async def logging_middleware(request: Request, call_next):
    start = time.time()
    response = await call_next(request)
    end = time.time()

    process_time = round(end - start, 4)

    logger.info(
        "Request processed",
        extra={
            "url": request.url.path,
            "method": request.method,
            "process_time": process_time
        }
    )

    return response
