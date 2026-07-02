import type {
  AppState,
  DailyTask,
  CareerGoal,
  SkillItem,
  UserProfile,
  ExpertiseItem,
  EnglishLevel,
  AgeBracket,
  ProfilesStore,
  ProfileRecord,
} from './types'

const STORAGE_KEY = 'career-compass-state' // legacy single-profile key
const PROFILES_KEY = 'career-compass-profiles' // new multi-profile key

// Canonical expertise dimensions (label + icon). New profiles start every skill
// at a neutral 3 and the person tunes them during onboarding / in the app.
export const EXPERTISE_META: Omit<ExpertiseItem, 'weight'>[] = [
  { tag: 'computational', label: 'Computational Design', icon: '◫' },
  { tag: 'robotic-fab', label: 'Robotic Fabrication', icon: '⛭' },
  { tag: 'ar-xr', label: 'AR / XR', icon: '◉' },
  { tag: 'bim', label: 'BIM / Revit', icon: '▦' },
  { tag: 'parametric', label: 'Parametric (Grasshopper)', icon: '∿' },
  { tag: 'gen-ai-ml', label: 'Generative AI / ML', icon: '✦' },
  { tag: 'digital-fab', label: 'Digital Fabrication (3D/CNC)', icon: '⬡' },
  { tag: 'sustainability', label: 'Sustainability / ESD', icon: '♺' },
  { tag: 'project-mgmt', label: 'Project Management', icon: '▣' },
  { tag: 'visualization', label: 'Visualization', icon: '◈' },
]

export function defaultExpertise(weight: ExpertiseItem['weight'] = 3): ExpertiseItem[] {
  return EXPERTISE_META.map((m) => ({ ...m, weight }))
}

// Neutral profile template for a brand-new person (not tuned to anyone).
const NEUTRAL_PROFILE: UserProfile = {
  regionalIntent: true,
  expertise: defaultExpertise(3),
  pr: {
    age: '25-32',
    english: 'competent',
    hasDegree: true,
    australianStudy: true,
    regionalStudy: false,
    professionalYear: false,
    naatiLanguage: false,
    ausWorkYears: 0,
    overseasWorkYears: 0,
    partnerStatus: 'single',
    nomination: 'none',
  },
}

const DEFAULT_DAILY_TASKS: DailyTask[] = [
  { id: '1', label: 'Search 5 new roles on LinkedIn / Seek / ArchDaily Jobs', completed: false, category: 'search' },
  { id: '2', label: 'Apply to at least 1 targeted position', completed: false, category: 'apply' },
  { id: '3', label: 'Update or refine portfolio project (1 section)', completed: false, category: 'portfolio' },
  { id: '4', label: 'Engage with 2 industry posts or connect with 1 person', completed: false, category: 'network' },
  { id: '5', label: 'Study or practice 30 min (AI tool, Grasshopper, Python, etc.)', completed: false, category: 'learn' },
  { id: '6', label: 'Review and log all applications in tracker', completed: false, category: 'apply' },
]

const DEFAULT_CAREER_GOALS: CareerGoal[] = [
  {
    id: 'g1',
    title: 'Complete Master thesis with AI/fabrication focus',
    description: 'Deliver a strong thesis demonstrating computational design + fabrication pipeline',
    timeframe: 'short',
    completed: false,
  },
  {
    id: 'g2',
    title: 'Build portfolio with 3 standout projects',
    description: 'Parametric design, AI-assisted workflow, and a physical fabrication piece',
    timeframe: 'short',
    completed: false,
  },
  {
    id: 'g3',
    title: 'Land graduate or junior role in computational design',
    description: 'Target firms: Hassell, Woods Bagot, FJMT, BVN, or tech-forward studios',
    timeframe: 'medium',
    completed: false,
  },
  {
    id: 'g4',
    title: 'Develop expertise in generative AI for architecture',
    description: 'Master Stable Diffusion workflows, LLM-assisted design, and custom ML pipelines',
    timeframe: 'medium',
    completed: false,
  },
  {
    id: 'g5',
    title: 'Lead innovation in digital fabrication lab or R&D team',
    description: 'Robotics, 3D printing, CNC — bridging design intent and material reality',
    timeframe: 'long',
    completed: false,
  },
]

const DEFAULT_SKILLS: SkillItem[] = [
  { id: 's1', name: 'Rhino / Grasshopper', category: 'architecture', level: 4, target: 5 },
  { id: 's2', name: 'Python (design automation)', category: 'ai', level: 3, target: 5 },
  { id: 's3', name: 'Machine Learning basics', category: 'ai', level: 2, target: 4 },
  { id: 's4', name: 'Stable Diffusion / Gen AI', category: 'ai', level: 2, target: 4 },
  { id: 's5', name: '3D Printing / FDM-SLA', category: 'fabrication', level: 3, target: 5 },
  { id: 's6', name: 'CNC / Laser cutting', category: 'fabrication', level: 3, target: 4 },
  { id: 's7', name: 'Revit / BIM', category: 'architecture', level: 3, target: 4 },
  { id: 's8', name: 'Blender / Unreal (viz)', category: 'architecture', level: 2, target: 4 },
  { id: 's9', name: 'Arduino / Robotics', category: 'fabrication', level: 2, target: 4 },
  { id: 's10', name: 'Technical writing & presentation', category: 'soft', level: 3, target: 5 },
]

export interface OnboardingPrefs {
  regionalIntent: boolean
  english: EnglishLevel
  age: AgeBracket
  expertise: ExpertiseItem[]
}

function baseState(profile: UserProfile): AppState {
  return {
    applications: [],
    dailyTasks: DEFAULT_DAILY_TASKS.map((t) => ({ ...t })),
    careerGoals: DEFAULT_CAREER_GOALS.map((g) => ({ ...g })),
    skills: DEFAULT_SKILLS.map((s) => ({ ...s })),
    dailyLogs: [],
    streak: 0,
    lastActiveDate: '',
    profile,
  }
}

// Build a fresh, isolated AppState from a person's onboarding choices.
export function newAppState(prefs: OnboardingPrefs): AppState {
  const profile: UserProfile = {
    regionalIntent: prefs.regionalIntent,
    expertise: prefs.expertise,
    pr: { ...NEUTRAL_PROFILE.pr, english: prefs.english, age: prefs.age },
  }
  return baseState(profile)
}

function today(): string {
  return new Date().toISOString().split('T')[0]
}

export function updateStreak(state: AppState): AppState {
  const todayStr = today()
  if (state.lastActiveDate === todayStr) return state

  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toISOString().split('T')[0]

  const newStreak = state.lastActiveDate === yesterdayStr ? state.streak + 1 : 1

  return {
    ...state,
    streak: newStreak,
    lastActiveDate: todayStr,
    dailyTasks: state.dailyTasks.map((t) => ({ ...t, completed: false })),
  }
}

// Ensure a loaded state has all required shape (older saves may lack fields).
function normalizeState(parsed: Partial<AppState>): AppState {
  return {
    ...baseState(NEUTRAL_PROFILE),
    ...parsed,
    dailyTasks: parsed.dailyTasks?.length ? parsed.dailyTasks : DEFAULT_DAILY_TASKS.map((t) => ({ ...t })),
    careerGoals: parsed.careerGoals?.length ? parsed.careerGoals : DEFAULT_CAREER_GOALS.map((g) => ({ ...g })),
    skills: parsed.skills?.length ? parsed.skills : DEFAULT_SKILLS.map((s) => ({ ...s })),
    profile: {
      ...NEUTRAL_PROFILE,
      ...parsed.profile,
      expertise: parsed.profile?.expertise?.length ? parsed.profile.expertise : defaultExpertise(3),
      pr: { ...NEUTRAL_PROFILE.pr, ...parsed.profile?.pr },
    },
  }
}

export function createProfile(name: string, prefs: OnboardingPrefs): ProfileRecord {
  return {
    id: crypto.randomUUID(),
    name: name.trim() || 'My profile',
    createdAt: new Date().toISOString(),
    state: newAppState(prefs),
  }
}

// Load the multi-profile store, migrating any legacy single-profile save.
export function loadProfiles(): ProfilesStore {
  try {
    const raw = localStorage.getItem(PROFILES_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as ProfilesStore
      const profiles = (parsed.profiles ?? []).map((p) => ({
        ...p,
        state: normalizeState(p.state),
      }))
      const activeId =
        parsed.activeId && profiles.some((p) => p.id === parsed.activeId)
          ? parsed.activeId
          : profiles[0]?.id ?? null
      return { activeId, profiles }
    }

    // Migrate an existing legacy single-profile save into the multi store.
    const legacy = localStorage.getItem(STORAGE_KEY)
    if (legacy) {
      const state = normalizeState(JSON.parse(legacy) as Partial<AppState>)
      const record: ProfileRecord = {
        id: crypto.randomUUID(),
        name: 'My profile',
        createdAt: new Date().toISOString(),
        state,
      }
      const store: ProfilesStore = { activeId: record.id, profiles: [record] }
      saveProfiles(store)
      return store
    }
  } catch {
    /* fall through to empty store */
  }
  return { activeId: null, profiles: [] }
}

export function saveProfiles(store: ProfilesStore): void {
  localStorage.setItem(PROFILES_KEY, JSON.stringify(store))
}

export { DEFAULT_DAILY_TASKS, DEFAULT_CAREER_GOALS, DEFAULT_SKILLS }
