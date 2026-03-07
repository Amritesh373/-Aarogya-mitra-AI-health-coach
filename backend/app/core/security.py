from datetime import datetime, timedelta 
from jose import jwt 
from passlib.context import CryptContext 
 
SECRET_KEY = "my-super-secret-key-123" 
ALGORITHM = "HS256" 
ACCESS_TOKEN_EXPIRE_MINUTES = 30 
 
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto") 
 
def create_access_token(data: dict): 
    to_encode = data.copy() 
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES) 
    to_encode.update({"exp": expire}) 
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM) 
