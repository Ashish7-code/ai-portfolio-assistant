from fastapi import FastAPI
from database import engine

app = FastAPI()

@app.get("/status")
def status():
    try:
        with engine.connect() as conn:
            return {"status": "ok", "database": "connected"}
    except Exception as e:
        return {"status": "ok", "database": str(e)}
