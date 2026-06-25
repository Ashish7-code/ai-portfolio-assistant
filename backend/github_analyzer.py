import os
import json
import httpx
import groq
from dotenv import load_dotenv

load_dotenv()

def analyze_github(username: str) -> dict:
    # Fetch repos from GitHub public API
    response = httpx.get(f"https://api.github.com/users/{username}/repos?per_page=50")
    
    if response.status_code == 404:
        raise ValueError(f"GitHub user '{username}' not found")
    
    repos = response.json()
    
    # Extract languages and repo names
    languages = {}
    repo_names = []
    
    for repo in repos:
        repo_names.append(repo["name"])
        lang = repo.get("language")
        if lang:
            languages[lang] = languages.get(lang, 0) + 1
    
    # Sort languages by frequency
    sorted_languages = sorted(languages.items(), key=lambda x: x[1], reverse=True)
    top_languages = [lang for lang, count in sorted_languages]
    
    # Send to Groq for gap analysis
    client = groq.Groq(api_key=os.getenv("GROQ_API_KEY"))
    
    prompt = f"""
A developer has the following GitHub profile:
- Username: {username}
- Repositories: {', '.join(repo_names[:10])}
- Languages used: {', '.join(top_languages)}

Return a JSON object with exactly these fields:
- top_languages: list of top 5 languages they use
- skill_gaps: list of 3 skills they should learn for a software engineering role
- profile_summary: one sentence summary of their GitHub profile
- recommendations: list of 3 specific project ideas to strengthen their portfolio

Return ONLY valid JSON, no markdown, no backticks.
"""
    
    ai_response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=1000,
    )
    
    result = ai_response.choices[0].message.content.strip()
    
    if result.startswith("```"):
        result = result.split("```")[1]
        if result.startswith("json"):
            result = result[4:]
    
    analysis = json.loads(result)
    analysis["username"] = username
    analysis["total_repos"] = len(repos)
    
    return analysis
