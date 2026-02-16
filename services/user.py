from datetime import datetime,timezone
from sqlalchemy import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from auth.hashing import get_password_hash
from models.refresh_token import RefreshToken
from repositories.common_commit import commit_transaction
from repositories.generic_crud import get_instance_by_any, insert_instance
from models.user import User

def is_email(value: str) -> bool:
    return "@" in value


async def create_user(db : AsyncSession,user_data):

    hashed_password = get_password_hash(user_data.password)

    user_dict = user_data.model_dump()
    user_dict["password"] = hashed_password
    
    await insert_instance(db=db , model=User , **user_dict)
        

async def get_user_by_email(email : str , db : AsyncSession):
    user = await get_instance_by_any(db = db , model = User,data = {"email" : email})
    return user

async def get_user_by_phone(phone_no : str , db : AsyncSession):
    user = await get_instance_by_any(db = db , model = User,data = {"phone_no" : phone_no})
    return user
    

async def get_user(identifier : str , db : AsyncSession):
    if is_email(identifier):
        user = await get_user_by_email(identifier, db)
    else:
        user = await get_user_by_phone(identifier, db)
    
    return user

async def is_revoked(jti: str ,db : AsyncSession):

    refresh_token = get_instance_by_any(model = RefreshToken , db = db , **{"token_id " :jti})

    if not refresh_token:
        return True
    
    if refresh_token.expire_at < datetime.now(timezone.utc):
        refresh_token.is_revoked = True

        await commit_transaction(db=db)
        return True
    
    return refresh_token.is_revoked
    
async def insert_refresh_token(db : AsyncSession,jti : UUID):
    
    await insert_instance(model = RefreshToken , db=db , **{"token_id" :jti})
    return True