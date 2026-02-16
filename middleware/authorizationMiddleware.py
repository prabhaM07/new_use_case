from starlette.middleware.base import BaseHTTPMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import Depends
from fastapi import HTTPException, Request
from fastapi.responses import JSONResponse
from auth.jwt_handler import verify_access_token, verify_refresh_token
from dependency import get_db
from services.blackList import get_blacklist
from db import AsyncSessionLocal

class AuthorizationMiddleware(BaseHTTPMiddleware):

    async def dispatch(self, request : Request, call_next):
        
        public_paths = [
            "/", 
            "/users/login"
        ]

        if request.url.path in public_paths:
            return await call_next(request)
        
        async with AsyncSessionLocal() as db:

            try :

                credential = request.headers.get('access_token')

                if credential is None:
                    raise HTTPException(detail="Bearer authorization required", status_code=401)

                credential = credential.split(' ')

                if credential[0] != 'Bearer':
                    raise HTTPException(status_code=403, detail = "Invalid or expired token.")
                
                access_payload = verify_access_token(credential[1])

                if access_payload is None:
                    raise HTTPException(status_code=403, detail="Invalid or expired token.")
                
                return await call_next(request) 
            
            except HTTPException as e:
                return JSONResponse(status_code=e.status_code, content={"detail-123": e.detail})
            except Exception as e:
                return JSONResponse(status_code=400 , content={"detail-456": str(e)})



