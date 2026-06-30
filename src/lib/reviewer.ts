// ---------------------------------------------------------------------------
// Heuristic CV / cover-letter reviewer. Runs entirely in the browser on text
// you paste — nothing is uploaded. It scores structural signals that matter for
// computational-design / fabrication roles in the Australian market and for an
// international-graduate visa story. It is a checklist aid, not a guarantee.
// ---------------------------------------------------------------------------

const NICHE_KEYWORDS = [
  'computational',
  'parametric',
  'grasshopper',
  'rhino',
  'python',
  'c#',
  'dynamo',
  'revit',
  'bim',
  'robotic',
  'fabrication',
  'cnc',
  '3d print',
  'machine learning',
  'generative',
  'ai',
  'augmented reality',
  'ar',
  'vr',
  'xr',
  'sustainab',
  'parametr',
]

const AU_SIGNALS = [
  'australia',
  'melbourne',
  'sydney',
  'brisbane',
  'adelaide',
  'perth',
  'hobart',
  'tasmania',
  'rmit',
  'aia',
  'aaca',
]

const VISA_SIGNALS = ['visa', 'work right', 'work-right', 'sponsor', '485', 'graduate visa', 'pr ', 'residen']

const ACTION_VERBS = [
  'designed',
  'developed',
  'built',
  'automated',
  'led',
  'created',
  'fabricated',
  'modelled',
  'modeled',
  'optimised',
  'optimized',
  'scripted',
  'researched',
  'delivered',
  'coordinated',
  'prototyped',
]

const PORTFOLIO_SIGNALS = ['portfolio', 'behance', 'http', 'www.', '.com', 'github', 'linkedin']

export interface ReviewCheck {
  id: string
  label: string
  status: 'good' | 'warn' | 'bad'
  score: number // 0..max
  max: number
  message: string
}

export interface ReviewResult {
  checks: ReviewCheck[]
  total: number
  max: number
  percent: number
  grade: string
  jobMatch?: { percent: number; missing: string[] }
}

function countMatches(text: string, terms: string[]): { count: number; found: string[] } {
  const lower = text.toLowerCase()
  const found = terms.filter((t) => lower.includes(t))
  return { count: found.length, found }
}

function hasNumbers(text: string): boolean {
  // quantified outcomes: %, numbers with units, or standalone metrics
  return /\b\d+(\.\d+)?\s?(%|percent|m²|sqm|x faster|hours?|days?|weeks?|projects?|k\b|\$)/i.test(text) ||
    /\b\d{2,}\b/.test(text)
}

export function reviewApplication(cv: string, jobDescription?: string): ReviewResult {
  const text = cv.trim()
  const words = text ? text.split(/\s+/).length : 0
  const checks: ReviewCheck[] = []

  // 1. Length / substance
  {
    let score = 0
    let status: ReviewCheck['status'] = 'bad'
    let message = 'Too short — paste your full CV or cover letter for a meaningful review.'
    if (words >= 120 && words <= 900) {
      score = 10
      status = 'good'
      message = `${words} words — a healthy length for a CV / cover letter.`
    } else if (words > 900) {
      score = 6
      status = 'warn'
      message = `${words} words — quite long. Tighten to the most relevant projects.`
    } else if (words >= 60) {
      score = 5
      status = 'warn'
      message = `${words} words — a bit thin. Add project detail and outcomes.`
    }
    checks.push({ id: 'length', label: 'Length & substance', status, score, max: 10, message })
  }

  // 2. Niche keyword density
  {
    const { count, found } = countMatches(text, NICHE_KEYWORDS)
    let score = Math.min(25, count * 3)
    const status: ReviewCheck['status'] = count >= 6 ? 'good' : count >= 3 ? 'warn' : 'bad'
    const message =
      count >= 6
        ? `Strong niche signalling (${count} terms): ${found.slice(0, 6).join(', ')}…`
        : count >= 3
          ? `Some niche terms (${found.join(', ')}). Add more of: computational, parametric, robotic fabrication, generative AI.`
          : 'Your specialisation is nearly invisible. Lead with computational design / fabrication / AI keywords.'
    checks.push({ id: 'niche', label: 'Specialisation keywords', status, score, max: 25, message })
  }

  // 3. Quantified outcomes
  {
    const ok = hasNumbers(text)
    checks.push({
      id: 'quantified',
      label: 'Quantified outcomes',
      status: ok ? 'good' : 'warn',
      score: ok ? 15 : 4,
      max: 15,
      message: ok
        ? 'Good — includes concrete numbers / metrics.'
        : 'Add measurable results (e.g. “cut documentation time 40%”, “3 fabricated prototypes”).',
    })
  }

  // 4. Action verbs
  {
    const { count } = countMatches(text, ACTION_VERBS)
    const score = Math.min(15, count * 3)
    const status: ReviewCheck['status'] = count >= 4 ? 'good' : count >= 2 ? 'warn' : 'bad'
    checks.push({
      id: 'verbs',
      label: 'Strong action verbs',
      status,
      score,
      max: 15,
      message:
        count >= 4
          ? `Good use of action verbs (${count}).`
          : 'Start bullet points with verbs: designed, automated, fabricated, led, scripted.',
    })
  }

  // 5. Australian market fit
  {
    const { count, found } = countMatches(text, AU_SIGNALS)
    const status: ReviewCheck['status'] = count >= 2 ? 'good' : count >= 1 ? 'warn' : 'bad'
    checks.push({
      id: 'au',
      label: 'Australian market context',
      status,
      score: count >= 2 ? 10 : count >= 1 ? 6 : 0,
      max: 10,
      message:
        count >= 1
          ? `References AU context (${found.join(', ')}).`
          : 'Mention Australian context — RMIT, the city you target, AIA, local projects.',
    })
  }

  // 6. Visa / work-rights clarity
  {
    const { count } = countMatches(text, VISA_SIGNALS)
    checks.push({
      id: 'visa',
      label: 'Work-rights / visa statement',
      status: count >= 1 ? 'good' : 'warn',
      score: count >= 1 ? 10 : 3,
      max: 10,
      message:
        count >= 1
          ? 'Good — addresses work rights / visa, which employers want to know upfront.'
          : 'Add one clear line on your work rights (e.g. “full work rights on a post-study 485 visa”).',
    })
  }

  // 7. Portfolio / contactability
  {
    const { count, found } = countMatches(text, PORTFOLIO_SIGNALS)
    checks.push({
      id: 'portfolio',
      label: 'Portfolio & contact links',
      status: count >= 2 ? 'good' : count >= 1 ? 'warn' : 'bad',
      score: count >= 2 ? 5 : count >= 1 ? 3 : 0,
      max: 5,
      message:
        count >= 1
          ? `Links present (${found.slice(0, 3).join(', ')}).`
          : 'Add your portfolio URL, LinkedIn, and email — architecture hiring is portfolio-first.',
    })
  }

  const total = checks.reduce((s, c) => s + c.score, 0)
  const max = checks.reduce((s, c) => s + c.max, 0)
  const percent = Math.round((total / max) * 100)
  const grade =
    percent >= 85 ? 'Excellent' : percent >= 70 ? 'Strong' : percent >= 50 ? 'Needs work' : 'Weak'

  let jobMatch: ReviewResult['jobMatch'] | undefined
  if (jobDescription && jobDescription.trim().length > 30) {
    const jd = jobDescription.toLowerCase()
    const cvLower = text.toLowerCase()
    // Pull notable keywords from the JD (the niche set + any capitalised tools).
    const jdTerms = NICHE_KEYWORDS.filter((t) => jd.includes(t))
    const matched = jdTerms.filter((t) => cvLower.includes(t))
    const missing = jdTerms.filter((t) => !cvLower.includes(t))
    const pct = jdTerms.length ? Math.round((matched.length / jdTerms.length) * 100) : 0
    jobMatch = { percent: pct, missing }
  }

  return { checks, total, max, percent, grade, jobMatch }
}
