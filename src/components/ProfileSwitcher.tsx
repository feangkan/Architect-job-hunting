import { useState, useRef, useEffect } from 'react'
import type { ProfileRecord } from '../types'

interface ProfileSwitcherProps {
  profiles: ProfileRecord[]
  activeId: string | null
  onSwitch: (id: string) => void
  onAdd: () => void
  onRename: (id: string, name: string) => void
  onDelete: (id: string) => void
  compact?: boolean
}

export function ProfileSwitcher({
  profiles,
  activeId,
  onSwitch,
  onAdd,
  onRename,
  onDelete,
  compact,
}: ProfileSwitcherProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const active = profiles.find((p) => p.id === activeId)

  useEffect(() => {
    if (!open) return
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [open])

  const handleRename = () => {
    if (!active) return
    const next = window.prompt('Rename profile', active.name)
    if (next && next.trim()) onRename(active.id, next.trim())
  }

  const handleDelete = (p: ProfileRecord) => {
    if (
      window.confirm(
        `Delete “${p.name}”? This permanently removes that person's applications and progress on this device.`
      )
    ) {
      onDelete(p.id)
    }
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center gap-2 rounded-xl border border-white/5 bg-surface-overlay/60 hover:bg-surface-overlay transition-colors ${
          compact ? 'px-2.5 py-1.5' : 'px-3 py-2.5'
        }`}
      >
        <span className="w-6 h-6 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs font-bold shrink-0">
          {(active?.name ?? '?').charAt(0).toUpperCase()}
        </span>
        <span className="min-w-0 flex-1 text-left">
          <span className="block text-sm text-white truncate leading-tight">
            {active?.name ?? 'No profile'}
          </span>
          {!compact && <span className="block text-[10px] text-muted">tap to switch</span>}
        </span>
        <span className="text-muted text-xs">▾</span>
      </button>

      {open && (
        <div className="absolute left-0 right-0 mt-2 z-50 bg-surface-raised border border-white/10 rounded-xl shadow-xl overflow-hidden">
          <div className="max-h-64 overflow-y-auto py-1">
            {profiles.map((p) => (
              <div
                key={p.id}
                className={`flex items-center gap-2 px-3 py-2 hover:bg-white/5 ${
                  p.id === activeId ? 'bg-accent/10' : ''
                }`}
              >
                <button
                  onClick={() => {
                    onSwitch(p.id)
                    setOpen(false)
                  }}
                  className="flex-1 flex items-center gap-2 min-w-0 text-left"
                >
                  <span className="w-6 h-6 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs font-bold shrink-0">
                    {p.name.charAt(0).toUpperCase()}
                  </span>
                  <span className="text-sm text-white truncate">{p.name}</span>
                  {p.id === activeId && <span className="text-accent text-xs ml-auto">✓</span>}
                </button>
                {profiles.length > 1 && (
                  <button
                    onClick={() => handleDelete(p)}
                    className="text-muted hover:text-accent text-xs px-1"
                    aria-label={`Delete ${p.name}`}
                    title="Delete profile"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
          <div className="border-t border-white/10 p-1">
            <button
              onClick={() => {
                handleRename()
                setOpen(false)
              }}
              className="w-full text-left px-3 py-2 text-sm text-muted hover:text-white hover:bg-white/5 rounded-lg"
            >
              ✎ Rename current
            </button>
            <button
              onClick={() => {
                onAdd()
                setOpen(false)
              }}
              className="w-full text-left px-3 py-2 text-sm text-accent hover:bg-accent/10 rounded-lg"
            >
              + Add another profile
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
