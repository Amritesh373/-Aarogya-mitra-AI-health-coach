from fastapi import APIRouter, Depends, HTTPException, Form
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr
from datetime import datetime, timedelta
from jose import jwt
from passlib.context import CryptContext
from typing import Optional

# ============ CONFIGURATION ============
SECRET_KEY = "my-super-secret-key-123456789"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# ============ PASSWORD HASHING ============
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

# ============ JWT TOKENS ============
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# ============ FAKE DATABASE ============
fake_users_db = {}

# ============ PYDANTIC MODELS ============
class UserCreate(BaseModel):
    email: EmailStr
    username: str
    password: str
    full_name: str
    age: Optional[int] = None
    weight: Optional[float] = None
    height: Optional[float] = None

class UserLogin(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

# ============ ROUTER ============
router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")

# ============ DEPENDENCY ============
async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    user = fake_users_db.get(username)
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    return user

# ============ ROUTES ============
@router.post("/register", response_model=Token)
async def register(user_data: UserCreate):
    # Check if user exists
    if user_data.username in fake_users_db:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    # Check if email exists
    for user in fake_users_db.values():
        if user["email"] == user_data.email:
            raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create new user
    hashed_password = get_password_hash(user_data.password)
    fake_users_db[user_data.username] = {
        "username": user_data.username,
        "email": user_data.email,
        "full_name": user_data.full_name,
        "hashed_password": hashed_password,
        "age": user_data.age,
        "weight": user_data.weight,
        "height": user_data.height
    }
    
    # Create access token
    access_token = create_access_token(data={"sub": user_data.username})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    # Get user from fake db
    user = fake_users_db.get(form_data.username)
    if not user or not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Incorrect username or password")
    
    # Create access token
    access_token = create_access_token(data={"sub": form_data.username})
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me")
async def read_users_me(current_user = Depends(get_current_user)):
    return current_user