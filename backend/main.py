from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from middleware.authorizationMiddleware import AuthorizationMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from middleware.loggingMiddleware import logging_middleware
import routes.auth as auth
from db import init_db
from logging_config import setup_logging

setup_logging()

app = FastAPI()

app.add_middleware(AuthorizationMiddleware)
app.add_middleware(BaseHTTPMiddleware, dispatch = logging_middleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["GET", "PUT", "POST", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)
@app.on_event("startup")
async def on_startup():
    await init_db()


app.include_router(router=auth.router)

