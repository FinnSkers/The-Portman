import React from 'react'
import { motion } from 'framer-motion'
import { Sparkles, BarChart2, Star, CheckCircle2 } from 'lucide-react'

function SectionCard({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/5 dark:bg-gray-900/80 rounded-2xl shadow-lg p-6 mb-8 border border-blue-900/20"
    >
      <h2 className="text-xl font-bold mb-4 text-blue-500 flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-blue-400 animate-pulse" /> {title}
      </h2>
      {children}
    </motion.div>
  )
}

function ScoreRing({ score }: { score: number }) {
  // Animated circular progress
  const radius = 48
  const stroke = 8
  const normalizedRadius = radius - stroke * 2
  const circumference = normalizedRadius * 2 * Math.PI
  const progress = Math.min(Math.max(score, 0), 100)
  const offset = circumference - (progress / 100) * circumference
  return (
    <svg height={radius * 2} width={radius * 2} className="mx-auto block mb-2">
      <circle
        stroke="#22223b"
        fill="transparent"
        strokeWidth={stroke}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      <motion.circle
        stroke="#3b82f6"
        fill="transparent"
        strokeWidth={stroke}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1 }}
        style={{ filter: 'drop-shadow(0 0 8px #3b82f6)' }}
      />
      <text
        x={radius}
        y={radius + 8}
        textAnchor="middle"
        fontSize="2rem"
        fill="#3b82f6"
        fontWeight="bold"
      >
        {score}%
      </text>
    </svg>
  )
}

function SkillBar({ name, score }: { name: string, score: number }) {
  return (
    <div className="mb-2">
      <div className="flex justify-between text-sm mb-1">
        <span className="text-blue-200 font-medium">{name}</span>
        <span className="text-blue-400 font-bold">{score}%</span>
      </div>
      <div className="w-full bg-blue-900/30 rounded-full h-2">
        <motion.div
          className="h-2 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 shadow-lg"
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1 }}
        />
      </div>
    </div>
  )
}

function Recommendation({ text }: { text: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-center gap-3 p-3 rounded-lg bg-blue-900/30 mb-2"
    >
      <BarChart2 className="h-5 w-5 text-blue-400" />
      <span className="text-blue-100">{text}</span>
    </motion.div>
  )
}

function StarRating({ value }: { value: number }) {
  const stars = Math.round(value / 20)
  return (
    <div className="flex gap-1">
      {[...Array(stars)].map((_, i) => (
        <Star key={i} className="h-4 w-4 text-amber-400 fill-amber-400" />
      ))}
      {[...Array(5 - stars)].map((_, i) => (
        <Star key={i} className="h-4 w-4 text-muted" />
      ))}
    </div>
  )
}

export default function ResultsPage() {
  let parsed = null
  if (typeof window !== 'undefined') {
    try {
      const raw = sessionStorage.getItem('parsedCV')
      if (raw) parsed = JSON.parse(raw)
    } catch {}
  }
  if (!parsed) {
    return <div className="p-8 text-center">No parsed CV data found.</div>
  }
  return (
    <div className="max-w-3xl mx-auto p-8">
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-4xl font-extrabold mb-2 text-center gradient-text"
      >
        <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-8 w-8 text-green-400 animate-bounce" /> CV Analysis Results</span>
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="text-lg text-center text-blue-200 mb-8"
      >
        Your AI-powered insights, benchmarks, and recommendations are ready!
      </motion.p>
      <div className="flex flex-col items-center mb-8">
        <ScoreRing score={parsed.score || 0} />
        <div className="text-blue-400 font-semibold text-lg mb-2">Overall Score</div>
        <div className="text-gray-300 text-sm mb-4">{parsed.name} &bull; {parsed.email}</div>
      </div>
      <SectionCard title="Summary">
        <div className="text-base text-gray-100 mb-2">{parsed.summary || 'No summary available.'}</div>
      </SectionCard>
      {parsed.skills && (
        <SectionCard title="Skills">
          <div className="space-y-2">
            {parsed.skills.map((skill: any, i: number) => (
              <SkillBar key={i} name={skill.name} score={skill.score || 0} />
            ))}
          </div>
        </SectionCard>
      )}
      {parsed.recommendations && (
        <SectionCard title="AI Recommendations">
          <div className="space-y-2">
            {parsed.recommendations.map((rec: string, i: number) => (
              <Recommendation key={i} text={rec} />
            ))}
          </div>
        </SectionCard>
      )}
      {parsed.jobMatches && (
        <SectionCard title="Top Job Matches">
          <div className="space-y-2">
            {parsed.jobMatches.map((job: any, i: number) => (
              <div key={i} className="flex items-center gap-4 bg-blue-900/20 rounded-lg px-4 py-2">
                <div className="flex-1">
                  <div className="font-semibold text-blue-200">{job.title}</div>
                  <div className="text-xs text-blue-300">{job.company}</div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-blue-400 font-bold">{job.match}%</span>
                  <StarRating value={job.match} />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      )}
      <SectionCard title="Raw Data">
        <pre className="bg-gray-900 text-green-200 rounded-lg p-4 overflow-x-auto text-xs">
          {JSON.stringify(parsed, null, 2)}
        </pre>
      </SectionCard>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="text-center text-blue-300 mt-8 text-lg font-semibold"
      >
        Thank you for using PORTMAN! <span className="animate-pulse">🚀</span>
      </motion.div>
    </div>
  )
}
