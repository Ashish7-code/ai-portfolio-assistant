'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function GithubPage() {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [githubResult, setGithubResult] = useState<any>(null);
  const [roadmap, setRoadmap] = useState<any>(null);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!username) return;
    setLoading(true);
    setError('');
    setRoadmap(null);
    try {
      const cleanUsername = username.trim().replace(/[^a-zA-Z0-9-]/g, "");
      const res = await fetch(`https://ai-portfolio-assistant-kf58.onrender.com/github/analyze/${cleanUsername}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Something went wrong');
      setGithubResult(data);

      // Auto-generate roadmap from skill gaps
      const roadmapRes = await fetch('https://ai-portfolio-assistant-kf58.onrender.com/roadmap/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skill_gaps: data.skill_gaps, target_role: 'Software Engineer' }),
      });
      const roadmapData = await roadmapRes.json();
      setRoadmap(roadmapData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="text-gray-400 hover:text-white mb-8 inline-block">← Back</Link>
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
          GitHub Analyzer
        </h1>
        <p className="text-gray-400 mb-8">Enter your GitHub username to get a skill gap analysis and 30-day roadmap.</p>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 mb-8 flex gap-4">
          <input
            type="text"
            placeholder="e.g. Ashish7-code"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="flex-1 bg-gray-800 text-white px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            onClick={handleAnalyze}
            disabled={!username || loading}
            className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            {loading ? 'Analyzing...' : 'Analyze'}
          </button>
        </div>
        {error && <p className="text-red-400 mb-6">{error}</p>}

        {githubResult && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-2">Profile Summary</h2>
              <p className="text-gray-300">{githubResult.profile_summary}</p>
              <p className="text-gray-500 mt-2 text-sm">{githubResult.total_repos} public repositories</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-3">Top Languages</h2>
              <div className="flex flex-wrap gap-2">
                {githubResult.top_languages.map((lang: string, idx: number) => (
                  <span key={idx} className="bg-purple-900 text-purple-300 px-3 py-1 rounded-full text-sm">{lang}</span>
                ))}
              </div>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-3">Skill Gaps</h2>
              <ul className="space-y-2">
                {githubResult.skill_gaps.map((gap: string) => (
                  <li key={gap} className="text-gray-300 flex items-start gap-2"><span className="text-yellow-400">⚠</span>{gap}</li>
                ))}
              </ul>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-3">Project Recommendations</h2>
              <ul className="space-y-2">
                {githubResult.recommendations.map((rec: string) => (
                  <li key={rec} className="text-gray-300 flex items-start gap-2"><span className="text-green-400">→</span>{rec}</li>
                ))}
              </ul>
            </div>

            {roadmap && (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                <h2 className="text-xl font-semibold mb-1">30-Day Learning Roadmap</h2>
                <p className="text-gray-400 text-sm mb-6">{roadmap.goal}</p>
                <div className="space-y-6">
                  {roadmap.weeks.map((week: any) => (
                    <div key={week.week} className="border-l-2 border-purple-500 pl-4">
                      <h3 className="font-semibold text-purple-300 mb-2">Week {week.week} — {week.focus}</h3>
                      <ul className="space-y-1 mb-3">
                        {week.tasks.map((task: string) => (
                          <li key={task} className="text-gray-300 text-sm flex gap-2"><span className="text-gray-500">•</span>{task}</li>
                        ))}
                      </ul>
                      <div className="flex gap-2 flex-wrap">
                        {week.resources.map((res: string) => (
                          <span key={res} className="bg-gray-800 text-gray-400 px-2 py-1 rounded text-xs">{res}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </main>
  );
}
