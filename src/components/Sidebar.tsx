import type { TabId } from '../types'

interface NavItem {
  id: TabId
  label: string
  icon: string
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: '◈' },
  { id: 'daily', label: 'Daily Routine', icon: '☀' },
  { id: 'applications', label: 'Applications', icon: '▤' },
  { id: 'guidelines', label: 'Guidelines', icon: '◎' },
  { id: 'career', label: 'Career Plan', icon: '↗' },
]

interface SidebarProps {
  active: TabId
  onNavigate: (tab: TabId) => void
  streak: number
}

export function Sidebar({ active, onNavigate, streak }: SidebarProps) {
  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-surface-raised border-r border-white/5 flex flex-col z-50">
      <div className="p-6 border-b border-white/5">
        <h1 className="font-serif text-2xl text-white leading-tight">
          Career<br />
          <span className="text-accent">Compass</span>
        </h1>
        <p className="text-xs text-muted mt-2 leading-relaxed">
          AI · Digital Fabrication · Architecture
        </p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              active === item.id
                ? 'bg-accent/15 text-accent'
                : 'text-muted hover:text-white hover:bg-white/5'
            }`}
          >
            <span className="text-base w-5 text-center">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-white/5">
        <div className="bg-surface-overlay rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-accent">{streak}</div>
          <div className="text-xs text-muted mt-1">day streak 🔥</div>
        </div>
        <p className="text-[10px] text-muted/60 text-center mt-3">
          RMIT Master of Architecture
        </p>
      </div>
    </aside>
  )
}
