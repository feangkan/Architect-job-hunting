import { useMemo, useState } from 'react'
import { reviewApplication } from '../lib/reviewer'

export function Reviewer() {
  const [cv, setCv] = useState('')
  const [jd, setJd] = useState('')
  const [showJd, setShowJd] = useState(false)

  const result = useMemo(() => (cv.trim() ? reviewApplication(cv, showJd ? jd : undefined) : null), [
    cv,
    jd,
    showJd,
  ])

  return (
    <div className="space-y-6">
      <header>
        <h2 className="font-serif text-3xl sm:text-4xl text-white">Application Review</h2>
        <p className="text-muted mt-2">
          Paste your CV or cover letter — it’s scored instantly in your browser. Nothing is uploaded.
        </p>
      </header>

      <div className="bg-surface-raised rounded-2xl p-5 border border-white/5 space-y-4">
        <div>
          <label className="text-xs text-muted">Your CV / cover letter text</label>
          <textarea
            value={cv}
            onChange={(e) => setCv(e.target.value)}
            rows={10}
            placeholder="Paste your CV or cover letter here…"
            className="mt-1 w-full bg-surface-overlay text-white text-sm rounded-xl px-4 py-3 border border-white/5 focus:outline-none focus:border-accent resize-y leading-relaxed"
          />
        </div>

        <label className="flex items-center gap-2 text-xs text-muted cursor-pointer">
          <input
            type="checkbox"
            checked={showJd}
            onChange={(e) => setShowJd(e.target.checked)}
            className="w-3.5 h-3.5 accent-accent"
          />
          Compare against a specific job description
        </label>

        {showJd && (
          <textarea
            value={jd}
            onChange={(e) => setJd(e.target.value)}
            rows={6}
            placeholder="Paste the job description to check keyword coverage…"
            className="w-full bg-surface-overlay text-white text-sm rounded-xl px-4 py-3 border border-white/5 focus:outline-none focus:border-accent resize-y leading-relaxed"
          />
        )}
      </div>

      {!result && (
        <p className="text-sm text-muted text-center py-8">
          Your score and tailored fixes will appear here as soon as you paste some text.
        </p>
      )}

      {result && (
        <>
          <div className="bg-surface-raised rounded-2xl p-6 border border-white/5 flex items-center gap-6">
            <div className="relative w-24 h-24 shrink-0">
              <svg viewBox="0 0 36 36" className="w-24 h-24 -rotate-90">
                <path
                  className="text-surface-overlay"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  d="M18 2.5 a 15.5 15.5 0 0 1 0 31 a 15.5 15.5 0 0 1 0 -31"
                />
                <path
                  className="text-accent"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  fill="none"
                  strokeDasharray={`${result.percent}, 100`}
                  d="M18 2.5 a 15.5 15.5 0 0 1 0 31 a 15.5 15.5 0 0 1 0 -31"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-white">{result.percent}</span>
                <span className="text-[10px] text-muted">/ 100</span>
              </div>
            </div>
            <div>
              <div className="text-xs text-muted uppercase tracking-wider">Overall</div>
              <div className="text-2xl font-bold text-white">{result.grade}</div>
              <p className="text-xs text-muted mt-1">
                {result.total} / {result.max} points across {result.checks.length} checks
              </p>
            </div>
          </div>

          {result.jobMatch && (
            <div className="bg-surface-raised rounded-2xl p-5 border border-white/5">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-white">Job-description keyword match</h3>
                <span className="text-2xl font-bold text-accent">{result.jobMatch.percent}%</span>
              </div>
              {result.jobMatch.missing.length > 0 ? (
                <p className="text-xs text-muted mt-2">
                  Missing keywords from the role:{' '}
                  <span className="text-warning">{result.jobMatch.missing.join(', ')}</span> — weave
                  these in where genuinely true.
                </p>
              ) : (
                <p className="text-xs text-success mt-2">
                  You cover all the key terms detected in this job description.
                </p>
              )}
            </div>
          )}

          <div className="space-y-2">
            {result.checks.map((c) => (
              <div key={c.id} className="bg-surface-raised rounded-xl p-4 border border-white/5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-white flex items-center gap-2">
                    <span className={statusColor(c.status)}>{statusIcon(c.status)}</span>
                    {c.label}
                  </span>
                  <span className="text-xs text-muted tabular-nums">
                    {c.score}/{c.max}
                  </span>
                </div>
                <p className="text-xs text-muted mt-1.5 ml-6 leading-relaxed">{c.message}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function statusIcon(status: 'good' | 'warn' | 'bad'): string {
  return status === 'good' ? '✓' : status === 'warn' ? '!' : '✕'
}

function statusColor(status: 'good' | 'warn' | 'bad'): string {
  return status === 'good' ? 'text-success' : status === 'warn' ? 'text-warning' : 'text-accent'
}
