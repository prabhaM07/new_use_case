from db import AsyncSessionLocal

async def get_db():

    async with AsyncSessionLocal()  as Session:
        yield Session

  
