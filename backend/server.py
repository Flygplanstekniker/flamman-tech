from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

class ContactForm(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr
    phone: Optional[str] = Field(None, max_length=20)
    subject: str = Field(..., min_length=1, max_length=200)
    message: str = Field(..., min_length=10, max_length=2000)

class ContactResponse(BaseModel):
    success: bool
    message: str

# Email service
async def send_contact_email(form_data: ContactForm):
    try:
        smtp_host = os.environ.get('SMTP_HOST', 'smtp.gmail.com')
        smtp_port = int(os.environ.get('SMTP_PORT', '587'))
        smtp_user = os.environ.get('SMTP_USER')
        smtp_password = os.environ.get('SMTP_PASSWORD')
        email_from = os.environ.get('EMAIL_FROM', 'noreply@flammantech.se')
        email_to = os.environ.get('EMAIL_TO', 'melvin@flammantech.se')
        
        if not smtp_user or not smtp_password:
            raise ValueError("SMTP credentials not configured")
        
        # Create message
        msg = MIMEMultipart()
        msg['From'] = email_from
        msg['To'] = email_to
        msg['Subject'] = f"Nytt meddelande från {form_data.name} - {form_data.subject}"
        
        # Email body
        body = f"""
Nytt kontaktformulär från Flamman Tech webbplats:

Namn: {form_data.name}
E-post: {form_data.email}
Telefon: {form_data.phone or 'Ej angivet'}
Ämne: {form_data.subject}

Meddelande:
{form_data.message}

---
Skickat från Flamman Tech webbplats
Tid: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
"""
        
        msg.attach(MIMEText(body, 'plain', 'utf-8'))
        
        # Send email
        server = smtplib.SMTP(smtp_host, smtp_port)
        server.starttls()
        server.login(smtp_user, smtp_password)
        text = msg.as_string()
        server.sendmail(email_from, email_to, text)
        server.quit()
        
        logger.info(f"Contact email sent successfully from {form_data.email}")
        return True
        
    except Exception as e:
        logger.error(f"Failed to send contact email: {str(e)}")
        return False

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/contact", response_model=ContactResponse)
async def submit_contact_form(form_data: ContactForm):
    try:
        # Save to database first for backup
        contact_dict = form_data.dict()
        contact_dict['id'] = str(uuid.uuid4())
        contact_dict['timestamp'] = datetime.utcnow()
        await db.contact_submissions.insert_one(contact_dict)
        
        # Try to send email
        email_sent = await send_contact_email(form_data)
        
        if email_sent:
            return ContactResponse(
                success=True,
                message="Meddelande skickat framgångsrikt! Jag återkommer inom 24 timmar."
            )
        else:
            # Email failed but data is saved
            return ContactResponse(
                success=True,
                message="Ditt meddelande har sparats. Jag återkommer inom 24 timmar. Om det är brådskande, ring direkt."
            )
        
    except Exception as e:
        logger.error(f"Contact form submission error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Ett oväntat fel uppstod. Försök igen eller kontakta oss direkt."
        )

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
