from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os
from dotenv import load_dotenv

load_dotenv()

# Import routers
from app.api.routes import auth, ai_coach

# Initialize FastAPI app with docs enabled
app = FastAPI(
    title="Aarogya Mitra API",
    description="AI-driven workout planning, nutrition guidance and health coaching platform",
    version="1.0.0",
    docs_url="/docs",  # This enables docs at /docs
    redoc_url="/redoc"  # This enables redoc at /redoc
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers - Note the prefixes
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(ai_coach.router, prefix="/ai", tags=["AI Coach"])

@app.get("/")
async def root():
    return {
        "message": "Welcome to Aarogya Mitra API",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs",
        "redoc": "/redoc"
    }

@app.get("/health")
async def health():
    return {"status": "healthy"}

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=True
    )