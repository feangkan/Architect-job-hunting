import type { AppState, DailyTask, CareerGoal, SkillItem, UserProfile } from './types'

const STORAGE_KEY = 'career-compass-state'

// Seeded from the user's stated expertise (computational design, robotic
// fabrication, AR/XR, BIM, parametric, generative AI/ML, digital fabrication,
// sustainability, project management, visualization) and PTE 59 / IELTS 6.0
// English (Competent band → 0 migration points). Everything here is editable
// in-app and re-runs the analysis live.
const DEFAULT_PROFILE: UserProfile = {
  regionalIntent: true,
  expertise: [
    { tag: 'computational', label: 'Computational Design', icon: '◫', weight: 5 },
    { tag: 'robotic-fab', label: 'Robotic Fabrication', icon: '⛭', weight: 4 },
    { tag: 'ar-xr', label: 'AR / XR', icon: '◉', weight: 4 },
    { tag: 'bim', label: 'BIM / Revit', icon: '▦', weight: 4 },
    { tag: 'parametric', label: 'Parametric (Grasshopper)', icon: '∿', weight: 4 },
    { tag: 'gen-ai-ml', label: 'Generative AI / ML', icon: '✦', weight: 4 },
    { tag: 'digital-fab', label: 'Digital Fabrication (3D/CNC)', icon: '⬡', weight: 4 },
    { tag: 'sustainability', label: 'Sustainability / ESD', icon: '♺', weight: 3 },
    { tag: 'project-mgmt', label: 'Project Management', icon: '▣', weight: 3 },
    { tag: 'visualization', label: 'Visualization', icon: '◈', weight: 3 },
  ],
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
    description: 'Target firms: Hassell, Woods Bagot, FJMT, BVN, or tech-forward studios in Melbourne/Sydney',
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

const DEFAULT_STATE: AppState = {
  applications: [],
  dailyTasks: DEFAULT_DAILY_TASKS,
  careerGoals: DEFAULT_CAREER_GOALS,
  skills: DEFAULT_SKILLS,
  dailyLogs: [],
  streak: 0,
  lastActiveDate: '',
  profile: DEFAULT_PROFILE,
}

function today(): string {
  return new Date().toISOString().split('T')[0]
}

function updateStreak(state: AppState): AppState {
  const todayStr = today()
  if (state.lastActiveDate === todayStr) return state

  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toISOString().split('T')[0]

  const newStreak =
    state.lastActiveDate === yesterdayStr ? state.streak + 1 : state.lastActiveDate ? 1 : 1

  return {
    ...state,
    streak: newStreak,
    lastActiveDate: todayStr,
    dailyTasks: state.dailyTasks.map((t) => ({ ...t, completed: false })),
  }
}

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return updateStreak({ ...DEFAULT_STATE })
    const parsed = JSON.parse(raw) as AppState
    return updateStreak({
      ...DEFAULT_STATE,
      ...parsed,
      dailyTasks: parsed.dailyTasks?.length ? parsed.dailyTasks : DEFAULT_DAILY_TASKS,
      careerGoals: parsed.careerGoals?.length ? parsed.careerGoals : DEFAULT_CAREER_GOALS,
      skills: parsed.skills?.length ? parsed.skills : DEFAULT_SKILLS,
      profile: {
        ...DEFAULT_PROFILE,
        ...parsed.profile,
        expertise: parsed.profile?.expertise?.length
          ? parsed.profile.expertise
          : DEFAULT_PROFILE.expertise,
        pr: { ...DEFAULT_PROFILE.pr, ...parsed.profile?.pr },
      },
    })
  } catch {
    return updateStreak({ ...DEFAULT_STATE })
  }
}

export function saveState(state: AppState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function resetDailyTasks(state: AppState): AppState {
  return {
    ...state,
    dailyTasks: DEFAULT_DAILY_TASKS.map((t) => ({ ...t, completed: false })),
  }
}

export { DEFAULT_DAILY_TASKS, DEFAULT_CAREER_GOALS, DEFAULT_SKILLS }
