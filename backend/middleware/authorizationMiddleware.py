from starlette.middleware.base import BaseHTTPMiddleware
from fastapi import HTTPException, Request
from fastapi.responses import JSONResponse
from auth.jwt_handler import verify_access_token

class AuthorizationMiddleware(BaseHTTPMiddleware):

    async def dispatch(self, request : Request, call_next):
        
        public_paths = [
            "/", 
            "/auth/login",
            "/auth/refresh"
        ]

        if request.url.path in public_paths:
            return await call_next(request)
        
        try :

            credential = request.headers.get('Authorization')
            print(credential)
            if credential is None:
                raise HTTPException(detail="Bearer authorization required", status_code=401)

            scheme, _, token = credential.partition(" ")

            if scheme.lower()  != 'bearer':
                raise HTTPException(status_code=403, detail = "Invalid or expired token.")
            
            access_payload = await verify_access_token(token)

            if access_payload is None:
                raise HTTPException(status_code=403, detail="Invalid or expired token.")
            
            return await call_next(request) 
        
        except HTTPException as e:
            return JSONResponse(status_code=e.status_code, content={"detail-123": e.detail})
        except Exception as e:
            return JSONResponse(status_code=400 , content={"detail-456": str(e)})



