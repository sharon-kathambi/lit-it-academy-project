import os
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from database import create_db
from routes.feedback import router as feedback_router
#from routes.insights import router as insights_router
#from routes.qr import router as qr_router

load_dotenv()

app = FastAPI(title="Restaurant Feedback API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", os.getenv("FRONTEND_URL", "")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Simple token-based admin guard for insights + stats
ADMIN_TOKEN = os.getenv("ADMIN_PASSWORD", "changeme")

@app.middleware("http")
async def admin_guard(request: Request, call_next):
    protected = ["/api/insights", "/api/feedback/stats"]
    if any(request.url.path.startswith(p) for p in protected):
        token = request.query_params.get("token") or request.headers.get("x-admin-token")
        if token != ADMIN_TOKEN:
            raise HTTPException(status_code=401, detail="Unauthorized")
    return await call_next(request)


app.include_router(feedback_router)
#app.include_router(insights_router)
#app.include_router(qr_router)


@app.on_event("startup")
def on_startup():
    create_db()


@app.get("/")
def root():
    return {"status": "ok", "message": "Restaurant Feedback API is running"}


