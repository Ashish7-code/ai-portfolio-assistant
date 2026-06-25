from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine
from routers import router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://ai-portfolio-assistant-three.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

@app.get("/status")
def status():
    try:
        with engine.connect() as conn:
            return {"status": "ok", "database": "connected"}
    except Exception as e:
        return {"status": "ok", "database": str(e)}
