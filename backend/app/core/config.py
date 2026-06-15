import os
from dotenv import load_dotenv

# Load .env file from backend root or parent if exists
load_dotenv(dotenv_path=os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), '.env'))

class Settings:
    PROJECT_NAME: str = "SVET CRM API"
    API_V1_STR: str = "/api/v1"
    
    # JWT Security Settings
    SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "b3d95c478aef22e8964ccb708e1a1df6d3e467ef6310166a72336c7b8272513a")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 1 day
    
    # Database Settings
    DB_HOST: str = os.getenv("DATABASE_HOST", "localhost")
    DB_PORT: str = os.getenv("DATABASE_PORT", "3306")
    DB_USER: str = os.getenv("DATABASE_USER", "root")
    DB_PASS: str = os.getenv("DATABASE_PASSWORD", "")
    DB_NAME: str = os.getenv("DATABASE_NAME", "svet_db")
    
    @property
    def DATABASE_URL(self) -> str:
        # Standard PyMySQL connection string for MySQL
        import urllib.parse
        encoded_pass = urllib.parse.quote_plus(self.DB_PASS)
        return f"mysql+pymysql://{self.DB_USER}:{encoded_pass}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}?charset=utf8mb4"
        
    # Brevo Mail Gateway Configurations
    BREVO_API_KEY: str = os.getenv("BREVO_API_KEY", "")
    BREVO_SENDER_NAME: str = os.getenv("BREVO_SENDER_NAME", "SVET Admissions")
    BREVO_SENDER_EMAIL: str = os.getenv("BREVO_SENDER_EMAIL", "")
    BREVO_RECEIVER_EMAIL: str = os.getenv("BREVO_RECEIVER_EMAIL", "")
    
    # Upload Settings
    # Base folder path to save student files safely inside backend workspace
    UPLOAD_DIR: str = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "uploads")

settings = Settings()

# Ensure Uploads base directories exist
os.makedirs(os.path.join(settings.UPLOAD_DIR, "students"), exist_ok=True)
