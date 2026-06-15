import type { TabId } from './types'

export interface NavItem {
  id: TabId
  label: string
  shortLabel: string
  icon: string
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', shortLabel: 'Home', icon: '◈' },
  { id: 'daily', label: 'Daily Routine', shortLabel: 'Daily', icon: '☀' },
  { id: 'applications', label: 'Applications', shortLabel: 'Jobs', icon: '▤' },
  { id: 'guidelines', label: 'Guidelines', shortLabel: 'Guide', icon: '◎' },
  { id: 'career', label: 'Career Plan', shortLabel: 'Plan', icon: '↗' },
]
