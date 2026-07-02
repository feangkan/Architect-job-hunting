import { useState } from 'react'
import { feedbackEndpoint } from '../config'

type Category = 'suggestion' | 'issue' | 'other'
type Status = 'idle' | 'sending' | 'sent' | 'error'

const CATEGORIES: { id: Category; label: string; icon: string }[] = [
  { id: 'suggestion', label: 'Suggestion', icon: '💡' },
  { id: 'issue', label: 'Report an issue', icon: '🐞' },
  { id: 'other', label: 'Other', icon: '💬' },
]

const SENT_KEY = 'career-compass-feedback-sent'

interface SentItem {
  category: Category
  message: string
  at: string
}

function loadSent(): SentItem[] {
  try {
    return JSON.parse(localStorage.getItem(SENT_KEY) || '[]') as SentItem[]
  } catch {
    return []
  }
}

interface FeedbackProps {
  profileName: string
}

export function Feedback({ profileName }: FeedbackProps) {
  const [category, setCategory] = useState<Category>('suggestion')
  const [message, setMessage] = useState('')
  const [contact, setContact] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [sent, setSent] = useState<SentItem[]>(loadSent)

  const endpoint = feedbackEndpoint()
  const canSend = message.trim().length >= 3 && status !== 'sending'

  const submit = async () => {
    if (!canSend) return
    if (honeypot) return // bot trap

    const payload = {
      category,
      message: message.trim(),
      contact: contact.trim() || 'not provided',
      profile: profileName,
      submittedAt: new Date().toISOString(),
      page: typeof location !== 'undefined' ? location.href : '',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      _subject: `Career Compass feedback: ${category}`,
    }

    if (!endpoint) {
      setStatus('error')
      setErrorMsg(
        'The feedback inbox is not connected yet. (Developer: set your email or Formspree endpoint in src/config.ts.)'
      )
      return
    }

    setStatus('sending')
    setErrorMsg('')
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error(`Server responded ${res.status}`)

      const item: SentItem = { category, message: message.trim(), at: payload.submittedAt }
      const next = [item, ...sent].slice(0, 20)
      setSent(next)
      localStorage.setItem(SENT_KEY, JSON.stringify(next))
      setMessage('')
      setContact('')
      setStatus('sent')
    } catch (e) {
      setStatus('error')
      setErrorMsg(
        e instanceof Error ? `Could not send (${e.message}). Please try again.` : 'Could not send.'
      )
    }
  }

  return (
    <div className="space-y-6">
      <header>
        <h2 className="font-serif text-3xl sm:text-4xl text-white">Feedback</h2>
        <p className="text-muted mt-2">
          Suggestions, issues, or ideas — sent privately to the developer. Thank you for helping make
          this better.
        </p>
      </header>

      {!endpoint && (
        <div className="bg-warning/10 border border-warning/30 rounded-2xl p-4 flex gap-3">
          <span className="text-warning text-lg leading-none shrink-0">⚠</span>
          <p className="text-xs text-warning/90 leading-relaxed">
            The feedback inbox isn’t connected yet. If you’re the developer, add your email or a
            Formspree endpoint in <span className="font-mono">src/config.ts</span> — then feedback
            will be delivered only to you.
          </p>
        </div>
      )}

      {status === 'sent' ? (
        <div className="bg-success/10 border border-success/30 rounded-2xl p-6 text-center">
          <div className="text-4xl mb-2">✓</div>
          <h3 className="font-semibold text-white">Thank you!</h3>
          <p className="text-sm text-muted mt-1">
            Your {category} was sent privately to the developer.
          </p>
          <button
            onClick={() => setStatus('idle')}
            className="mt-4 px-4 py-2 rounded-xl text-sm font-medium bg-accent text-white hover:opacity-90"
          >
            Send another
          </button>
        </div>
      ) : (
        <div className="bg-surface-raised rounded-2xl p-5 border border-white/5 space-y-4">
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                onClick={() => setCategory(c.id)}
                className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                  category === c.id
                    ? 'bg-accent text-white'
                    : 'bg-surface-overlay text-muted hover:text-white'
                }`}
              >
                {c.icon} {c.label}
              </button>
            ))}
          </div>

          <div>
            <label className="text-sm text-white font-medium">
              Your {category === 'issue' ? 'issue' : 'message'}
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
              placeholder={
                category === 'issue'
                  ? 'What went wrong? What were you doing when it happened?'
                  : category === 'suggestion'
                    ? 'What would make this app more useful for you?'
                    : 'Anything you want to share…'
              }
              className="mt-1.5 w-full bg-surface-overlay text-white text-sm rounded-xl px-4 py-3 border border-white/5 focus:outline-none focus:border-accent resize-y leading-relaxed"
            />
          </div>

          <div>
            <label className="text-sm text-white font-medium">
              Your contact <span className="text-muted font-normal">(optional)</span>
            </label>
            <input
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="Email or name, if you'd like a reply"
              className="mt-1.5 w-full bg-surface-overlay text-white text-sm rounded-lg px-3 py-2.5 border border-white/5 focus:outline-none focus:border-accent"
            />
          </div>

          {/* Honeypot: hidden from humans, catches bots. */}
          <input
            type="text"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="hidden"
          />

          {status === 'error' && <p className="text-sm text-accent">{errorMsg}</p>}

          <button
            disabled={!canSend}
            onClick={submit}
            className={`w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              canSend ? 'bg-accent text-white hover:opacity-90' : 'bg-surface-overlay text-muted cursor-not-allowed'
            }`}
          >
            {status === 'sending' ? 'Sending…' : 'Send feedback'}
          </button>
          <p className="text-[11px] text-muted/70 text-center">
            Sent privately to the developer. Please don’t include sensitive personal information.
          </p>
        </div>
      )}

      {sent.length > 0 && (
        <section>
          <h3 className="text-xs text-muted uppercase tracking-wider mb-2">
            Sent from this device
          </h3>
          <div className="space-y-2">
            {sent.map((s, i) => (
              <div key={i} className="bg-surface-raised rounded-xl p-3 border border-white/5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-accent capitalize">{s.category}</span>
                  <span className="text-[10px] text-muted">
                    {new Date(s.at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-muted mt-1 line-clamp-2">{s.message}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
