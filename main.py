from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import routes.user as user
from db import init_db

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.on_event("startup")
async def on_startup():
    await init_db()

app.include_router(router=user.router)

