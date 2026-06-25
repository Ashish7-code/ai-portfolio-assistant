import groq
import os
import json
from dotenv import load_dotenv

load_dotenv()

def analyze_resume(text: str) -> dict:
    client = groq.Groq(api_key=os.getenv("GROQ_API_KEY"))
    prompt = f"""
Analyze this resume and return a JSON object with exactly these fields:
- skills: list of technical skills found
- experience_years: estimated years of experience (number)
- weaknesses: list of 3 areas for improvement
- ats_score: ATS compatibility score out of 100 (number)
- summary: one sentence summary of the candidate

Resume text:
{text}

Return ONLY valid JSON, no other text. No markdown, no backticks, just raw JSON.
"""
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=1000,
    )
    result = response.choices[0].message.content.strip()
    
    # Strip markdown code blocks if model adds them
    if result.startswith("```"):
        result = result.split("```")[1]
        if result.startswith("json"):
            result = result[4:]
    
    return json.loads(result)
