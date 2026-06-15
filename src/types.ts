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

export interface AppState {
  applications: JobApplication[]
  dailyTasks: DailyTask[]
  careerGoals: CareerGoal[]
  skills: SkillItem[]
  dailyLogs: DailyLog[]
  streak: number
  lastActiveDate: string
}

export type TabId = 'dashboard' | 'applications' | 'daily' | 'guidelines' | 'career'
