from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict, List
from app.services.ai_service import AIService
from app.api.routes.auth import get_current_user

router = APIRouter()

# Request/Response models
class WorkoutRequest(BaseModel):
    age: int
    weight: float
    height: float
    fitness_goal: str
    experience_level: str = "beginner"
    equipment: List[str] = ["bodyweight"]
    days_per_week: int = 5

class NutritionRequest(BaseModel):
    age: int
    weight: float
    height: float
    fitness_goal: str
    dietary_restrictions: List[str] = []
    activity_level: str = "moderate"

class ChatRequest(BaseModel):
    query: str
    context: Optional[Dict] = None

@router.post("/generate-workout")
async def generate_workout(
    request: WorkoutRequest,
    current_user = Depends(get_current_user)
):
    """Generate a personalized workout plan"""
    ai_service = AIService()
    plan = ai_service.generate_workout_plan(request.dict())
    return plan

@router.post("/generate-nutrition")
async def generate_nutrition(
    request: NutritionRequest,
    current_user = Depends(get_current_user)
):
    """Generate a personalized nutrition plan"""
    ai_service = AIService()
    plan = ai_service.generate_nutrition_plan(request.dict())
    return plan

@router.post("/chat")
async def chat(
    request: ChatRequest,
    current_user = Depends(get_current_user)
):
    """Chat with AROMI AI coach"""
    ai_service = AIService()
    response = ai_service.get_coaching_response(
        request.query,
        request.context or {}
    )
    return {"response": response}

@router.get("/test")
async def test():
    """Test endpoint to verify router is working"""
    return {"message": "AI Coach router is working!"}
class HealthData(BaseModel):
    weight: Optional[float] = None
    body_fat: Optional[float] = None
    water_intake: Optional[int] = None
    sleep_hours: Optional[float] = None
    sleep_quality: Optional[int] = None
    mood: Optional[int] = None
    energy_level: Optional[int] = None
    steps: Optional[int] = None
    notes: Optional[str] = None

@router.post("/health/log")
async def log_health(
    data: HealthData,
    current_user = Depends(get_current_user)
):
    """Log daily health metrics"""
    try:
        # Print received data for debugging
        print(f"Received health data: {data}")
        
        # Here you would save to database
        # For now, return success
        return {
            "message": "Health data saved successfully",
            "data": data
        }
    except Exception as e:
        print(f"Error saving health data: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/health/history")
async def get_health_history(
    current_user = Depends(get_current_user)
):
    """Get health history"""
    # Return empty list for now
    return []