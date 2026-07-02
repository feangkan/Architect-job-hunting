import type { TabId } from '../types'
import { NAV_ITEMS } from '../navigation'

interface MobileNavProps {
  active: TabId
  onNavigate: (tab: TabId) => void
  streak: number
  profileSwitcher?: React.ReactNode
}

export function MobileNav({ active, onNavigate, streak, profileSwitcher }: MobileNavProps) {
  return (
    <>
      <header className="lg:hidden sticky top-0 z-40 bg-surface/95 backdrop-blur-md border-b border-white/5 px-4 py-3 flex items-center gap-3 safe-top">
        <div className="shrink-0">
          <h1 className="font-serif text-xl text-white leading-tight">
            Career <span className="text-accent">Compass</span>
          </h1>
        </div>
        {profileSwitcher && <div className="flex-1 min-w-0 max-w-[220px]">{profileSwitcher}</div>}
        <div className="bg-surface-overlay rounded-xl px-3 py-2 text-center min-w-[48px] shrink-0">
          <div className="text-lg font-bold text-accent leading-none">{streak}</div>
          <div className="text-[9px] text-muted mt-0.5">streak</div>
        </div>
      </header>

      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface-raised/95 backdrop-blur-md border-t border-white/10 safe-bottom">
        <div className="flex overflow-x-auto no-scrollbar">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex-1 min-w-[52px] flex flex-col items-center gap-0.5 py-2.5 px-1 transition-colors ${
                active === item.id ? 'text-accent' : 'text-muted'
              }`}
            >
              <span className="text-lg leading-none">{item.icon}</span>
              <span className="text-[10px] font-medium">{item.shortLabel}</span>
            </button>
          ))}
        </div>
      </nav>
    </>
  )
}
