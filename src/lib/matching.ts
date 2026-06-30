import type { Company, ExpertiseItem, ExpertiseTag, UserProfile } from '../types'

export const ALL_EXPERTISE_TAGS: ExpertiseTag[] = [
  'computational',
  'robotic-fab',
  'ar-xr',
  'bim',
  'parametric',
  'gen-ai-ml',
  'digital-fab',
  'sustainability',
  'project-mgmt',
  'visualization',
]

export const EXPERTISE_LABELS: Record<ExpertiseTag, string> = {
  computational: 'Computational Design',
  'robotic-fab': 'Robotic Fabrication',
  'ar-xr': 'AR / XR',
  bim: 'BIM / Revit',
  parametric: 'Parametric (Grasshopper)',
  'gen-ai-ml': 'Generative AI / ML',
  'digital-fab': 'Digital Fabrication (3D/CNC)',
  sustainability: 'Sustainability / ESD',
  'project-mgmt': 'Project Management',
  visualization: 'Visualization',
}

export const EXPERTISE_ICONS: Record<ExpertiseTag, string> = {
  computational: '◫',
  'robotic-fab': '⛭',
  'ar-xr': '◉',
  bim: '▦',
  parametric: '∿',
  'gen-ai-ml': '✦',
  'digital-fab': '⬡',
  sustainability: '♺',
  'project-mgmt': '▣',
  visualization: '◈',
}

function weightMap(expertise: ExpertiseItem[]): Record<string, number> {
  const map: Record<string, number> = {}
  for (const e of expertise) map[e.tag] = e.weight
  return map
}

// Weighted overlap of the user's expertise vector with the firm's needs vector.
// Normalised against the firm's own demand so a perfect match = 100.
export function skillFit(profile: UserProfile, company: Company): number {
  const user = weightMap(profile.expertise)
  let dot = 0
  let max = 0
  for (const tag of Object.keys(company.needs) as ExpertiseTag[]) {
    const need = company.needs[tag] ?? 0
    if (need <= 0) continue
    const have = user[tag] ?? 0
    dot += need * have
    max += need * 5
  }
  if (max === 0) return 0
  return Math.round((dot / max) * 100)
}

const COMPETITION: Record<Company['category'], number> = {
  tier1: 0.84,
  'computational-studio': 0.84,
  proptech: 0.9,
  engineering: 0.95,
  academia: 0.95,
  fabrication: 0.95,
  tier2: 1.0,
}

// Probability of actually landing a role: skill fit adjusted for firm size
// (more openings), graduate program, and competition by firm category.
export function winProbability(profile: UserProfile, company: Company): number {
  const fit = skillFit(profile, company)
  const sizeFactor = company.sizeBand === 'large' ? 1.1 : company.sizeBand === 'small' ? 0.92 : 1.0
  const gradBonus = company.gradProgram ? 6 : 0
  const regionalEase = company.isRegional ? 6 : 0 // less applicant competition in regional areas
  const raw = fit * sizeFactor * COMPETITION[company.category] + gradBonus + regionalEase
  return Math.max(0, Math.min(100, Math.round(raw)))
}

const STATE_NOMINATION_EASE: Record<Company['state'], number> = {
  SA: 10,
  TAS: 10,
  NT: 10,
  ACT: 10,
  WA: 6,
  QLD: 4,
  VIC: 0,
  NSW: 0,
}

// How much this employer helps the PR goal (regional, sponsorship, nomination
// accessibility, stability). Independent of skill fit.
export function prLeverage(profile: UserProfile, company: Company): number {
  let score = 0
  if (company.isRegional) score += profile.regionalIntent ? 38 : 30
  score += company.sponsorsVisa === 'yes' ? 25 : company.sponsorsVisa === 'sometimes' ? 12 : 0
  if (company.gradProgram) score += 10
  if (company.sizeBand === 'large') score += 10
  else if (company.sizeBand === 'medium') score += 4
  score += STATE_NOMINATION_EASE[company.state]
  return Math.max(0, Math.min(100, Math.round(score)))
}

export type SortMode = 'pr' | 'fit' | 'win' | 'leverage'

// Overall PR-weighted ranking score: balances skill fit, PR leverage, and the
// realistic chance of landing the role.
export function overallScore(profile: UserProfile, company: Company): number {
  const fit = skillFit(profile, company)
  const lev = prLeverage(profile, company)
  const win = winProbability(profile, company)
  return Math.round(fit * 0.4 + lev * 0.4 + win * 0.2)
}

export interface CompanyScore {
  company: Company
  fit: number
  win: number
  leverage: number
  overall: number
  matchedTags: ExpertiseTag[]
  gapTags: ExpertiseTag[]
  reasons: string[]
}

export function scoreCompany(profile: UserProfile, company: Company): CompanyScore {
  const user = weightMap(profile.expertise)
  const matchedTags: ExpertiseTag[] = []
  const gapTags: ExpertiseTag[] = []

  for (const tag of Object.keys(company.needs) as ExpertiseTag[]) {
    const need = company.needs[tag] ?? 0
    if (need < 3) continue
    const have = user[tag] ?? 0
    if (have >= 3) matchedTags.push(tag)
    else gapTags.push(tag)
  }
  matchedTags.sort((a, b) => (company.needs[b] ?? 0) - (company.needs[a] ?? 0))
  gapTags.sort((a, b) => (company.needs[b] ?? 0) - (company.needs[a] ?? 0))

  const reasons: string[] = []
  if (matchedTags.length) {
    const top = matchedTags
      .slice(0, 3)
      .map((t) => `${EXPERTISE_LABELS[t]} (${user[t] ?? 0}/5)`)
      .join(', ')
    reasons.push(`Direct skill overlap: ${top} — exactly what they value.`)
  }
  if (company.isRegional) {
    reasons.push(
      `Regional (${company.state}) employer → unlocks subclass 491 + regional points, a major shortcut to PR.`
    )
  }
  if (company.sponsorsVisa === 'yes') {
    reasons.push('Strong record of sponsoring / relocating international talent.')
  }
  reasons.push(...company.whyNotes)

  return {
    company,
    fit: skillFit(profile, company),
    win: winProbability(profile, company),
    leverage: prLeverage(profile, company),
    overall: overallScore(profile, company),
    matchedTags,
    gapTags,
    reasons,
  }
}

export function rankCompanies(
  profile: UserProfile,
  companies: Company[],
  sort: SortMode = 'pr'
): CompanyScore[] {
  const scored = companies.map((c) => scoreCompany(profile, c))
  const key: Record<SortMode, keyof CompanyScore> = {
    pr: 'overall',
    fit: 'fit',
    win: 'win',
    leverage: 'leverage',
  }
  const k = key[sort]
  return scored.sort((a, b) => (b[k] as number) - (a[k] as number))
}

export function band(score: number): { label: string; color: string } {
  if (score >= 75) return { label: 'High', color: 'text-success bg-success/10' }
  if (score >= 50) return { label: 'Medium', color: 'text-warning bg-warning/10' }
  return { label: 'Low', color: 'text-accent bg-accent/10' }
}
