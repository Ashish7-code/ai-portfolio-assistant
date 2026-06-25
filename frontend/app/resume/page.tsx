'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function ResumePage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError('');
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('https://ai-portfolio-assistant-kf58.onrender.com/resume/analyze', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Something went wrong');
      setResult(data);
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
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Resume Analyzer
        </h1>
        <p className="text-gray-400 mb-8">Upload your PDF resume for AI-powered analysis.</p>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 mb-8">
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="block w-full text-gray-400 mb-4"
          />
          <button
            onClick={handleUpload}
            disabled={!file || loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            {loading ? 'Analyzing...' : 'Analyze Resume'}
          </button>
          {error && <p className="text-red-400 mt-4">{error}</p>}
        </div>

        {result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-2">ATS Score</h2>
              <div className="text-5xl font-bold text-blue-400">{result.ats_score}<span className="text-2xl text-gray-400">/100</span></div>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-3">Summary</h2>
              <p className="text-gray-300">{result.summary}</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-3">Skills Found</h2>
              <div className="flex flex-wrap gap-2">
                {result.skills.map((skill: string) => (
                  <span key={skill} className="bg-blue-900 text-blue-300 px-3 py-1 rounded-full text-sm">{skill}</span>
                ))}
              </div>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-3">Areas to Improve</h2>
              <ul className="space-y-2">
                {result.weaknesses.map((w: string) => (
                  <li key={w} className="text-gray-300 flex items-start gap-2"><span className="text-red-400">✗</span>{w}</li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
}
