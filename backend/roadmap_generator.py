import os
import json
import groq
from dotenv import load_dotenv

load_dotenv()

def generate_roadmap(skill_gaps: list, target_role: str = "Software Engineer") -> dict:
    client = groq.Groq(api_key=os.getenv("GROQ_API_KEY"))
    
    prompt = f"""
A developer wants to become a {target_role}.
Their current skill gaps are: {', '.join(skill_gaps)}

Generate a 30-day learning roadmap and return a JSON object with exactly these fields:
- goal: one sentence describing the overall goal
- weeks: a list of 4 objects, each with:
  - week: week number (1, 2, 3, or 4)
  - focus: the main topic for that week
  - tasks: list of 3 specific daily tasks for that week
  - resources: list of 2 free online resources (name only, no URLs)

Return ONLY valid JSON, no markdown, no backticks.
"""
    
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=1500,
    )
    
    result = response.choices[0].message.content.strip()
    
    if result.startswith("```"):
        result = result.split("```")[1]
        if result.startswith("json"):
            result = result[4:]
    
    return json.loads(result)
