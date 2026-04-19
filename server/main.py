from fastapi import FastAPI

app = FastAPI(title="Restaurant Feedback API")

@app.get("/")
def root():
    return {"status": "ok", "message": "Restaurant Feedback API Running"}

