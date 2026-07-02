import type { ExpertiseItem } from '../types'

interface ExpertiseEditorProps {
  expertise: ExpertiseItem[]
  onChange: (tag: string, weight: ExpertiseItem['weight']) => void
  regionalIntent: boolean
  onToggleRegional: (value: boolean) => void
}

export function ExpertiseEditor({
  expertise,
  onChange,
  regionalIntent,
  onToggleRegional,
}: ExpertiseEditorProps) {
  return (
    <div className="bg-surface-raised rounded-2xl p-5 border border-white/5">
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-semibold text-white">Your Expertise</h3>
        <span className="text-[10px] text-muted uppercase tracking-wider">live · re-ranks below</span>
      </div>
      <p className="text-xs text-muted mb-4">
        Drag each skill 0–5. Everything below re-scores instantly as you change them.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
        {expertise.map((item) => (
          <div key={item.tag}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm text-white flex items-center gap-2">
                <span className="text-accent w-4 text-center">{item.icon}</span>
                {item.label}
              </span>
              <span className="text-xs text-muted tabular-nums">{item.weight}/5</span>
            </div>
            <div className="flex gap-1">
              {[0, 1, 2, 3, 4, 5].map((level) => (
                <button
                  key={level}
                  onClick={() => onChange(item.tag, level as ExpertiseItem['weight'])}
                  aria-label={`${item.label} level ${level}`}
                  className={`flex-1 h-2.5 rounded-full transition-all ${
                    level === 0
                      ? 'hidden'
                      : level <= item.weight
                        ? 'bg-accent'
                        : 'bg-surface-overlay hover:bg-surface-overlay/70'
                  }`}
                />
              ))}
              <button
                onClick={() => onChange(item.tag, 0)}
                className="text-[10px] text-muted hover:text-white px-1"
                aria-label={`${item.label} reset to 0`}
              >
                0
              </button>
            </div>
          </div>
        ))}
      </div>

      <label className="flex items-center gap-3 mt-5 pt-4 border-t border-white/5 cursor-pointer">
        <input
          type="checkbox"
          checked={regionalIntent}
          onChange={(e) => onToggleRegional(e.target.checked)}
          className="w-4 h-4 accent-accent"
        />
        <span className="text-sm text-white">
          Open to regional Australia (Tasmania, Adelaide, regional VIC/NSW, NT…)
        </span>
      </label>
      <p className="text-xs text-muted mt-1 ml-7">
        Strongly recommended — regional work unlocks the 491 visa + regional points, the fastest
        realistic PR route.
      </p>
    </div>
  )
}
