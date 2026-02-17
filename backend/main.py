from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from middleware.authorizationMiddleware import AuthorizationMiddleware
import routes.auth as auth
from db import init_db

app = FastAPI()

app.add_middleware(AuthorizationMiddleware)

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

