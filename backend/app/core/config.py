import os
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY", "k7#N@p9vR2$mZw!LqX9&bY5@cV8#jN2m")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60
