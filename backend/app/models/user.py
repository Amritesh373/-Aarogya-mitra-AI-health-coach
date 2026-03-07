from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean 
from datetime import datetime 
from app.core.database import Base 
 
class User(Base): 
    __tablename__ = "users" 
 
    id = Column(Integer, primary_key=True, index=True) 
    email = Column(String, unique=True, index=True, nullable=False) 
    username = Column(String, unique=True, index=True, nullable=False) 
    hashed_password = Column(String, nullable=False) 
    full_name = Column(String, nullable=False) 
    age = Column(Integer, nullable=True) 
    weight = Column(Float, nullable=True) 
    height = Column(Float, nullable=True) 
    fitness_goal = Column(String, nullable=True) 
    is_active = Column(Boolean, default=True) 
    created_at = Column(DateTime, default=datetime.utcnow) 
