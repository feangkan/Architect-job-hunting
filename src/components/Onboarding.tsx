import { useState } from 'react'
import type { AgeBracket, EnglishLevel, ExpertiseItem } from '../types'
import { defaultExpertise, type OnboardingPrefs } from '../storage'
import { ENGLISH_LABELS } from '../lib/prPoints'

interface OnboardingProps {
  onCreate: (name: string, prefs: OnboardingPrefs) => void
  onCancel?: () => void
  existingNames: string[]
}

export function Onboarding({ onCreate, onCancel, existingNames }: OnboardingProps) {
  const [name, setName] = useState('')
  const [expertise, setExpertise] = useState<ExpertiseItem[]>(defaultExpertise(3))
  const [regionalIntent, setRegionalIntent] = useState(true)
  const [english, setEnglish] = useState<EnglishLevel>('competent')
  const [age, setAge] = useState<AgeBracket>('25-32')

  const trimmed = name.trim()
  const duplicate = existingNames.some((n) => n.toLowerCase() === trimmed.toLowerCase())
  const ready = trimmed.length > 0 && !duplicate

  const setWeight = (tag: string, weight: ExpertiseItem['weight']) =>
    setExpertise((prev) => prev.map((e) => (e.tag === tag ? { ...e, weight } : e)))

  return (
    <div className="min-h-screen flex items-start sm:items-center justify-center p-4 py-10">
      <div className="w-full max-w-lg space-y-6">
        <header className="text-center">
          <h1 className="font-serif text-3xl sm:text-4xl text-white">
            Welcome to <span className="text-accent">Career Compass</span>
          </h1>
          <p className="text-muted mt-2 text-sm">
            Create your own profile. Your skills, factors, applications, and daily progress are saved
            privately on this device — separate from everyone else’s.
          </p>
        </header>

        <div className="bg-surface-raised rounded-2xl p-5 border border-white/5 space-y-5">
          <div>
            <label className="text-sm text-white font-medium">Your name or nickname</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alex"
              autoFocus
              className="mt-1.5 w-full bg-surface-overlay text-white text-sm rounded-lg px-3 py-2.5 border border-white/5 focus:outline-none focus:border-accent"
            />
            {duplicate && (
              <p className="text-xs text-accent mt-1">That name already exists — pick another.</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-sm text-white font-medium">English level</span>
              <select
                value={english}
                onChange={(e) => setEnglish(e.target.value as EnglishLevel)}
                className="mt-1.5 w-full bg-surface-overlay text-white text-sm rounded-lg px-3 py-2.5 border border-white/5 focus:outline-none focus:border-accent"
              >
                {(['competent', 'proficient', 'superior'] as EnglishLevel[]).map((e) => (
                  <option key={e} value={e}>
                    {ENGLISH_LABELS[e]}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-sm text-white font-medium">Age</span>
              <select
                value={age}
                onChange={(e) => setAge(e.target.value as AgeBracket)}
                className="mt-1.5 w-full bg-surface-overlay text-white text-sm rounded-lg px-3 py-2.5 border border-white/5 focus:outline-none focus:border-accent"
              >
                <option value="18-24">18–24</option>
                <option value="25-32">25–32</option>
                <option value="33-39">33–39</option>
                <option value="40-44">40–44</option>
                <option value="45+">45+</option>
              </select>
            </label>
          </div>

          <div>
            <span className="text-sm text-white font-medium">Your expertise (drag 0–5)</span>
            <p className="text-xs text-muted mt-0.5 mb-3">
              Set anything you don’t have to 0. You can fine-tune all of this later.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
              {expertise.map((item) => (
                <div key={item.tag}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-white flex items-center gap-1.5">
                      <span className="text-accent w-4 text-center">{item.icon}</span>
                      {item.label}
                    </span>
                    <span className="text-[11px] text-muted tabular-nums">{item.weight}/5</span>
                  </div>
                  <div className="flex gap-1 items-center">
                    <button
                      onClick={() => setWeight(item.tag, 0)}
                      className="text-[10px] text-muted hover:text-white pr-1"
                    >
                      0
                    </button>
                    {[1, 2, 3, 4, 5].map((level) => (
                      <button
                        key={level}
                        onClick={() => setWeight(item.tag, level as ExpertiseItem['weight'])}
                        aria-label={`${item.label} level ${level}`}
                        className={`flex-1 h-2.5 rounded-full transition-all ${
                          level <= item.weight ? 'bg-accent' : 'bg-surface-overlay hover:bg-surface-overlay/70'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <label className="flex items-start gap-3 pt-1 cursor-pointer">
            <input
              type="checkbox"
              checked={regionalIntent}
              onChange={(e) => setRegionalIntent(e.target.checked)}
              className="w-4 h-4 mt-0.5 accent-accent"
            />
            <span className="text-sm text-white">
              Open to regional Australia
              <span className="block text-xs text-muted">
                Recommended — regional work unlocks the 491 visa + points, the fastest PR route.
              </span>
            </span>
          </label>
        </div>

        <div className="flex gap-3">
          {onCancel && (
            <button
              onClick={onCancel}
              className="px-4 py-3 rounded-xl text-sm font-medium bg-surface-raised text-muted border border-white/5 hover:text-white"
            >
              Cancel
            </button>
          )}
          <button
            disabled={!ready}
            onClick={() => onCreate(trimmed, { regionalIntent, english, age, expertise })}
            className={`flex-1 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              ready
                ? 'bg-accent text-white hover:opacity-90'
                : 'bg-surface-overlay text-muted cursor-not-allowed'
            }`}
          >
            Create my profile →
          </button>
        </div>

        <p className="text-[11px] text-muted/70 text-center leading-relaxed">
          Everything is stored only in this browser. Nothing is uploaded. Share the link with friends
          — each person creates their own profile on their own device.
        </p>
      </div>
    </div>
  )
}
