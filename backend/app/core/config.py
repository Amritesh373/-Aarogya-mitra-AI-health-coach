from typing import Optional 
import os 
 
class Settings: 
    DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:password123@localhost:5432/aarogya") 
    SECRET_KEY = os.getenv("SECRET_KEY", "secret") 
    ALGORITHM = "HS256" 
    ACCESS_TOKEN_EXPIRE_MINUTES = 30 
 
settings = Settings() 
