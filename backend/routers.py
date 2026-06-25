from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import User
from schemas import UserCreate, UserResponse

router = APIRouter()

@router.post("/users", response_model=UserResponse)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    new_user = User(email=user.email, name=user.name, github_username=user.github_username)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.get("/users/{user_id}", response_model=UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

from fastapi import UploadFile, File
import pdfplumber
import io
from resume_analyzer import analyze_resume
from models import Resume

@router.post("/resume/analyze")
async def upload_resume(file: UploadFile = File(...), db: Session = Depends(get_db)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are accepted")
    
    contents = await file.read()
    
    with pdfplumber.open(io.BytesIO(contents)) as pdf:
        text = ""
        for page in pdf.pages:
            text += page.extract_text() or ""
    
    if not text.strip():
        raise HTTPException(status_code=400, detail="Could not extract text from PDF")
    
    analysis = analyze_resume(text)
    
    resume = Resume(
        filename=file.filename,
        skills=", ".join(analysis.get("skills", [])),
        experience_years=analysis.get("experience_years"),
        weaknesses=", ".join(analysis.get("weaknesses", [])),
        ats_score=analysis.get("ats_score"),
        summary=analysis.get("summary"),
    )
    db.add(resume)
    db.commit()
    db.refresh(resume)
    
    return {
        "id": resume.id,
        "filename": resume.filename,
        "skills": analysis.get("skills", []),
        "experience_years": analysis.get("experience_years"),
        "weaknesses": analysis.get("weaknesses", []),
        "ats_score": analysis.get("ats_score"),
        "summary": analysis.get("summary"),
    }

from github_analyzer import analyze_github

@router.get("/github/analyze/{username}")
def analyze_github_profile(username: str):
    try:
        result = analyze_github(username)
        return result
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
