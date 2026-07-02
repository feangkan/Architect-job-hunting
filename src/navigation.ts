import type { TabId } from './types'

export interface NavItem {
  id: TabId
  label: string
  shortLabel: string
  icon: string
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', shortLabel: 'Home', icon: '◈' },
  { id: 'matcher', label: 'Company Matcher', shortLabel: 'Match', icon: '⌖' },
  { id: 'pr', label: 'PR Route', shortLabel: 'PR', icon: '⚑' },
  { id: 'review', label: 'Application Review', shortLabel: 'Review', icon: '✓' },
  { id: 'applications', label: 'Applications', shortLabel: 'Jobs', icon: '▤' },
  { id: 'daily', label: 'Daily Routine', shortLabel: 'Daily', icon: '☀' },
  { id: 'guidelines', label: 'Guidelines', shortLabel: 'Guide', icon: '◎' },
  { id: 'career', label: 'Career Plan', shortLabel: 'Plan', icon: '↗' },
  { id: 'feedback', label: 'Feedback', shortLabel: 'Feedback', icon: '✉' },
]
