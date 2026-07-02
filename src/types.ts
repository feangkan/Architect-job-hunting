export type ApplicationStatus =
  | 'saved'
  | 'applied'
  | 'interview'
  | 'offer'
  | 'rejected'
  | 'withdrawn'

export interface JobApplication {
  id: string
  company: string
  role: string
  location: string
  url: string
  status: ApplicationStatus
  dateApplied: string
  notes: string
  salary?: string
  tags: string[]
}

export interface DailyTask {
  id: string
  label: string
  completed: boolean
  category: 'search' | 'apply' | 'network' | 'portfolio' | 'learn'
}

export interface CareerGoal {
  id: string
  title: string
  description: string
  timeframe: 'short' | 'medium' | 'long'
  completed: boolean
  targetDate?: string
}

export interface SkillItem {
  id: string
  name: string
  category: 'ai' | 'fabrication' | 'architecture' | 'soft'
  level: 1 | 2 | 3 | 4 | 5
  target: 1 | 2 | 3 | 4 | 5
}

export interface DailyLog {
  date: string
  tasksCompleted: string[]
  applicationsSubmitted: number
  notes: string
}

// ---------------------------------------------------------------------------
// Expertise / matching model
// ---------------------------------------------------------------------------

// Canonical skill dimensions used by the company-matching engine. The user's
// profile weights each of these 0–5, and every company expresses how much it
// values each dimension. Matching is a weighted overlap of the two vectors.
export type ExpertiseTag =
  | 'computational'
  | 'robotic-fab'
  | 'ar-xr'
  | 'bim'
  | 'parametric'
  | 'gen-ai-ml'
  | 'digital-fab'
  | 'sustainability'
  | 'project-mgmt'
  | 'visualization'

export interface ExpertiseItem {
  tag: ExpertiseTag
  label: string
  icon: string
  // How strong the user is in this dimension (0 = none, 5 = expert). This is
  // the input the user "loops" — every change re-runs the analysis live.
  weight: 0 | 1 | 2 | 3 | 4 | 5
}

export type AusState = 'VIC' | 'NSW' | 'QLD' | 'SA' | 'WA' | 'TAS' | 'ACT' | 'NT'

export type CompanyCategory =
  | 'tier1'
  | 'tier2'
  | 'engineering'
  | 'computational-studio'
  | 'proptech'
  | 'academia'
  | 'fabrication'

export type VisaSponsorship = 'yes' | 'sometimes' | 'unlikely'

export interface Company {
  id: string
  name: string
  city: string
  state: AusState
  isRegional: boolean
  category: CompanyCategory
  // 1–5: how mature the firm is in computation / fabrication / R&D.
  techMaturity: 1 | 2 | 3 | 4 | 5
  // How much the firm values each expertise dimension (0–5). Sparse map.
  needs: Partial<Record<ExpertiseTag, number>>
  sponsorsVisa: VisaSponsorship
  gradProgram: boolean
  sizeBand: 'small' | 'medium' | 'large'
  futureOutlook: string
  whyNotes: string[]
  url: string
}

// English level mapped to migration points (Competent = 0, Proficient = 10,
// Superior = 20). The user is currently PTE 59 / IELTS 6.0 = Competent.
export type EnglishLevel = 'competent' | 'proficient' | 'superior'

export type AgeBracket = '18-24' | '25-32' | '33-39' | '40-44' | '45+'

// Toggleable points-test factors the user can simulate ("the PR loop").
export interface PRProfile {
  age: AgeBracket
  english: EnglishLevel
  hasDegree: boolean
  australianStudy: boolean // 2-year Australian study requirement (+5)
  regionalStudy: boolean // studied in a regional area (+5)
  professionalYear: boolean // Professional Year program (+5)
  naatiLanguage: boolean // NAATI credentialed community language (+5)
  ausWorkYears: 0 | 1 | 3 | 5 | 8 // years of skilled work in Australia
  overseasWorkYears: 0 | 3 | 5 | 8 // years of skilled work overseas
  partnerStatus: 'single' | 'partner-skilled' | 'partner-english' | 'partner-australian'
  nomination: 'none' | '190' | '491'
}

export interface UserProfile {
  expertise: ExpertiseItem[]
  regionalIntent: boolean
  pr: PRProfile
}

export interface AppState {
  applications: JobApplication[]
  dailyTasks: DailyTask[]
  careerGoals: CareerGoal[]
  skills: SkillItem[]
  dailyLogs: DailyLog[]
  streak: number
  lastActiveDate: string
  profile: UserProfile
}

// One person's account. Everything they track lives in `state`, fully isolated
// from other people using the same browser/device.
export interface ProfileRecord {
  id: string
  name: string
  createdAt: string
  state: AppState
}

export interface ProfilesStore {
  activeId: string | null
  profiles: ProfileRecord[]
}

export type TabId =
  | 'dashboard'
  | 'matcher'
  | 'pr'
  | 'review'
  | 'applications'
  | 'daily'
  | 'guidelines'
  | 'career'
