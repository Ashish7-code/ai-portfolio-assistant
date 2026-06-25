'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-3xl"
      >
        <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          AI Portfolio Assistant
        </h1>
        <p className="text-gray-400 text-xl mb-12">
          Analyze your resume, evaluate your GitHub profile, and get a personalized learning roadmap — powered by AI.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/resume">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-8 cursor-pointer hover:border-blue-500 transition-colors"
            >
              <div className="text-4xl mb-4">📄</div>
              <h2 className="text-2xl font-semibold mb-2">Resume Analyzer</h2>
              <p className="text-gray-400">Upload your PDF resume and get an ATS score, skill extraction, and weakness analysis.</p>
            </motion.div>
          </Link>

          <Link href="/github">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-8 cursor-pointer hover:border-purple-500 transition-colors"
            >
              <div className="text-4xl mb-4">🐙</div>
              <h2 className="text-2xl font-semibold mb-2">GitHub Analyzer</h2>
              <p className="text-gray-400">Enter your GitHub username and get a skill gap analysis plus a 30-day learning roadmap.</p>
            </motion.div>
          </Link>
        </div>
      </motion.div>
    </main>
  );
}
