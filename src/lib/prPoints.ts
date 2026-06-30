import type { PRProfile, EnglishLevel, AgeBracket } from '../types'

// ---------------------------------------------------------------------------
// Simplified, transparent estimator of the Australian General Skilled
// Migration points test (subclasses 189 / 190 / 491) for an architect
// (ANZSCO 232111). This is an EDUCATIONAL ESTIMATE, not migration advice — the
// official rules change regularly and individual circumstances vary. Always
// confirm with a registered (MARA) migration agent and the Department of Home
// Affairs points table before relying on any number.
// ---------------------------------------------------------------------------

const AGE_POINTS: Record<AgeBracket, number> = {
  '18-24': 25,
  '25-32': 30,
  '33-39': 25,
  '40-44': 15,
  '45+': 0,
}

const ENGLISH_POINTS: Record<EnglishLevel, number> = {
  competent: 0, // IELTS 6 / PTE 50–64 — minimum to apply, but 0 points
  proficient: 10, // IELTS 7 / PTE 65–78
  superior: 20, // IELTS 8 / PTE 79+
}

export const ENGLISH_LABELS: Record<EnglishLevel, string> = {
  competent: 'Competent (IELTS 6 / PTE 50–64)',
  proficient: 'Proficient (IELTS 7 / PTE 65–78)',
  superior: 'Superior (IELTS 8 / PTE 79+)',
}

function ausWorkPoints(years: PRProfile['ausWorkYears']): number {
  if (years >= 8) return 20
  if (years >= 5) return 15
  if (years >= 3) return 10
  if (years >= 1) return 5
  return 0
}

function overseasWorkPoints(years: PRProfile['overseasWorkYears']): number {
  if (years >= 8) return 15
  if (years >= 5) return 10
  if (years >= 3) return 5
  return 0
}

function partnerPoints(status: PRProfile['partnerStatus']): { points: number; note: string } {
  switch (status) {
    case 'single':
      return { points: 10, note: 'Single applicant (or partner is an Australian citizen/PR)' }
    case 'partner-skilled':
      return { points: 10, note: 'Partner has competent English + positive skills assessment' }
    case 'partner-english':
      return { points: 5, note: 'Partner has competent English only' }
    case 'partner-australian':
      return { points: 10, note: 'Partner is an Australian citizen / permanent resident' }
  }
}

export interface PointsLine {
  label: string
  points: number
  note?: string
}

export interface PointsResult {
  lines: PointsLine[]
  base: number // 189-equivalent (no nomination)
  visa190: number // base + 5
  visa491: number // base + 15
  best: number
  meets189: boolean
  competitive: 'unlikely' | 'borderline' | 'competitive' | 'strong'
}

export function calcPoints(p: PRProfile): PointsResult {
  const lines: PointsLine[] = []

  lines.push({ label: 'Age', points: AGE_POINTS[p.age], note: p.age })
  lines.push({
    label: 'English',
    points: ENGLISH_POINTS[p.english],
    note: ENGLISH_LABELS[p.english],
  })
  lines.push({
    label: 'Education',
    points: p.hasDegree ? 15 : 0,
    note: p.hasDegree ? "Bachelor's / Master's degree" : 'No qualifying degree',
  })
  lines.push({
    label: 'Australian study requirement',
    points: p.australianStudy ? 5 : 0,
    note: p.australianStudy ? '2 years study in Australia' : 'Not met',
  })
  lines.push({
    label: 'Regional study',
    points: p.regionalStudy ? 5 : 0,
    note: p.regionalStudy ? 'Studied in a designated regional area' : 'Studied in a major city',
  })
  lines.push({
    label: 'Professional Year',
    points: p.professionalYear ? 5 : 0,
    note: p.professionalYear ? 'Completed Professional Year' : 'Not completed',
  })
  lines.push({
    label: 'NAATI community language',
    points: p.naatiLanguage ? 5 : 0,
    note: p.naatiLanguage ? 'Credentialed' : 'Not held',
  })
  lines.push({
    label: 'Australian work experience',
    points: ausWorkPoints(p.ausWorkYears),
    note: `${p.ausWorkYears} year(s)`,
  })
  lines.push({
    label: 'Overseas work experience',
    points: overseasWorkPoints(p.overseasWorkYears),
    note: `${p.overseasWorkYears} year(s)`,
  })
  const partner = partnerPoints(p.partnerStatus)
  lines.push({ label: 'Partner / single', points: partner.points, note: partner.note })

  const base = lines.reduce((sum, l) => sum + l.points, 0)
  const visa190 = base + 5
  const visa491 = base + 15
  const best =
    p.nomination === '491' ? visa491 : p.nomination === '190' ? visa190 : base

  let competitive: PointsResult['competitive'] = 'unlikely'
  const ceiling = visa491
  if (ceiling >= 90) competitive = 'strong'
  else if (ceiling >= 75) competitive = 'competitive'
  else if (ceiling >= 65) competitive = 'borderline'

  return {
    lines,
    base,
    visa190,
    visa491,
    best,
    meets189: base >= 65,
    competitive,
  }
}

export interface Lever {
  id: string
  title: string
  gain: string
  detail: string
  active: boolean // already achieved
  inWindow: 'study' | 'post-grad' | 'either'
}

// Highest-impact actions to raise the score, ranked by points gain.
export function suggestLevers(p: PRProfile): Lever[] {
  const levers: Lever[] = []

  if (p.english !== 'superior') {
    levers.push({
      id: 'english-superior',
      title: 'Reach Superior English (IELTS 8 / PTE 79+)',
      gain: p.english === 'competent' ? '+20' : '+10',
      detail:
        'The single biggest lever. You are currently at Competent (0 pts). Superior English alone can add up to 20 points — usually faster than gaining work experience.',
      active: false,
      inWindow: 'study',
    })
  }
  if (p.nomination === 'none') {
    levers.push({
      id: 'nomination',
      title: 'Secure state/regional nomination',
      gain: '+5 to +15',
      detail:
        '190 state nomination adds 5; 491 regional adds 15. Working in a regional area (Tasmania, Adelaide, regional VIC/NSW, NT) is often the most reliable route to an invitation.',
      active: false,
      inWindow: 'post-grad',
    })
  }
  if (!p.naatiLanguage) {
    levers.push({
      id: 'naati',
      title: 'NAATI credentialed community language test',
      gain: '+5',
      detail: 'If you speak another community language, the NAATI CCL test adds 5 points.',
      active: false,
      inWindow: 'either',
    })
  }
  if (!p.professionalYear) {
    levers.push({
      id: 'professional-year',
      title: 'Complete a Professional Year',
      gain: '+5',
      detail:
        'A Professional Year (skilled graduate program) adds 5 points and counts toward Australian work experience signalling.',
      active: false,
      inWindow: 'post-grad',
    })
  }
  if (p.ausWorkYears < 3) {
    levers.push({
      id: 'aus-work',
      title: 'Gain skilled work experience in Australia',
      gain: p.ausWorkYears < 1 ? '+5 (then +10 at 3 yrs)' : '+10 at 3 yrs',
      detail:
        '1–2 years of skilled Australian work = 5 points; 3+ years = 10. This is where the post-graduation 485 visa window is critical.',
      active: false,
      inWindow: 'post-grad',
    })
  }

  // Already-achieved factors, shown as "locked in".
  if (p.australianStudy)
    levers.push({
      id: 'aus-study-done',
      title: 'Australian study requirement met',
      gain: '+5',
      detail: 'Your Australian master’s satisfies the 2-year study requirement.',
      active: true,
      inWindow: 'study',
    })

  return levers
}

export interface VisaPathway {
  code: string
  name: string
  type: 'provisional' | 'permanent' | 'temporary'
  summary: string
  fit: 'shortest' | 'strong' | 'backup'
}

// Recommended pathway sequence for an international architecture graduate.
export function recommendPathways(_p: PRProfile, regionalIntent: boolean): VisaPathway[] {
  const paths: VisaPathway[] = [
    {
      code: '485',
      name: 'Temporary Graduate visa',
      type: 'temporary',
      summary:
        'Apply right after finishing your degree. Gives full work rights for ~2 years — the runway to build points, English, and Australian work experience before applying for PR.',
      fit: 'shortest',
    },
  ]

  if (regionalIntent) {
    paths.push({
      code: '491',
      name: 'Skilled Work Regional (Provisional)',
      type: 'provisional',
      summary:
        'Live/work in a designated regional area (incl. Tasmania, Adelaide, regional VIC/NSW, NT). Adds 15 points and is often the most achievable invitation. Leads to the permanent 191 after 3 years.',
      fit: 'shortest',
    })
    paths.push({
      code: '191',
      name: 'Permanent Residence (Skilled Regional)',
      type: 'permanent',
      summary:
        'The PR endpoint of the 491. Requires ~3 years on a 491 meeting income/residence conditions. This is the clearest "regional → PR" track.',
      fit: 'strong',
    })
  }

  paths.push({
    code: '190',
    name: 'Skilled Nominated (Permanent)',
    type: 'permanent',
    summary:
      'Direct PR with state/territory nomination (+5 points). Achievable in states with friendlier architecture demand (SA, TAS, ACT). Requires meeting that state’s current criteria.',
    fit: regionalIntent ? 'strong' : 'shortest',
  })
  paths.push({
    code: '189',
    name: 'Skilled Independent (Permanent)',
    type: 'permanent',
    summary:
      'Direct PR with no nomination, purely points-ranked. Hardest route for architects right now — treat as a bonus if your score climbs high (90+), not the primary plan.',
    fit: 'backup',
  })
  paths.push({
    code: '482/186',
    name: 'Employer-sponsored (SID / ENS)',
    type: 'permanent',
    summary:
      'If a larger firm sponsors you (482 Skills in Demand → 186 ENS for PR), this bypasses the points test. Target firms flagged "sponsors visa: yes".',
    fit: 'backup',
  })

  return paths
}
