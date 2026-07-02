import { useMemo, useState } from 'react'
import type { AusState, Company, ExpertiseItem, UserProfile } from '../types'
import { COMPANIES } from '../data/companies'
import {
  rankCompanies,
  band,
  EXPERTISE_LABELS,
  EXPERTISE_ICONS,
  type SortMode,
} from '../lib/matching'
import { ExpertiseEditor } from './ExpertiseEditor'
import { Disclaimer } from './Disclaimer'

interface CompanyMatcherProps {
  profile: UserProfile
  onChangeExpertise: (tag: string, weight: ExpertiseItem['weight']) => void
  onToggleRegional: (value: boolean) => void
  onTrack: (company: Company) => void
}

const SORTS: { id: SortMode; label: string }[] = [
  { id: 'pr', label: 'Best for PR' },
  { id: 'fit', label: 'Skill fit' },
  { id: 'win', label: 'Win chance' },
  { id: 'leverage', label: 'PR leverage' },
]

const STATES: (AusState | 'ALL')[] = ['ALL', 'VIC', 'NSW', 'QLD', 'SA', 'WA', 'TAS', 'ACT', 'NT']

export function CompanyMatcher({
  profile,
  onChangeExpertise,
  onToggleRegional,
  onTrack,
}: CompanyMatcherProps) {
  const [sort, setSort] = useState<SortMode>('pr')
  const [stateFilter, setStateFilter] = useState<AusState | 'ALL'>('ALL')
  const [regionalOnly, setRegionalOnly] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)

  const ranked = useMemo(() => {
    const filtered = COMPANIES.filter(
      (c) =>
        (stateFilter === 'ALL' || c.state === stateFilter) && (!regionalOnly || c.isRegional)
    )
    return rankCompanies(profile, filtered, sort)
  }, [profile, sort, stateFilter, regionalOnly])

  return (
    <div className="space-y-6">
      <header>
        <h2 className="font-serif text-3xl sm:text-4xl text-white">Company Matcher</h2>
        <p className="text-muted mt-2">
          {ranked.length} employers scored against your expertise and your PR goal — re-ranked live.
        </p>
      </header>

      <ExpertiseEditor
        expertise={profile.expertise}
        onChange={onChangeExpertise}
        regionalIntent={profile.regionalIntent}
        onToggleRegional={onToggleRegional}
      />

      <div className="space-y-3">
        <div className="flex gap-2 flex-wrap">
          {SORTS.map((s) => (
            <button
              key={s.id}
              onClick={() => setSort(s.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                sort === s.id ? 'bg-accent text-white' : 'bg-surface-raised text-muted border border-white/5'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2 flex-wrap items-center">
          {STATES.map((s) => (
            <button
              key={s}
              onClick={() => setStateFilter(s)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                stateFilter === s ? 'bg-surface-overlay text-white' : 'bg-surface-raised text-muted border border-white/5'
              }`}
            >
              {s === 'ALL' ? 'All states' : s}
            </button>
          ))}
          <label className="flex items-center gap-2 text-xs text-muted cursor-pointer ml-1">
            <input
              type="checkbox"
              checked={regionalOnly}
              onChange={(e) => setRegionalOnly(e.target.checked)}
              className="w-3.5 h-3.5 accent-accent"
            />
            Regional only
          </label>
        </div>
      </div>

      <Disclaimer>
        Company data is a hand-curated research shortlist with estimated tech-maturity and
        visa-sponsorship signals — not live jobs or official information. Verify current roles and
        visa policy on each firm’s own careers page, and confirm migration details with a registered
        (MARA) agent.
      </Disclaimer>

      <div className="space-y-4">
        {ranked.map((s) => {
          const isOpen = expanded === s.company.id
          const winBand = band(s.win)
          const levBand = band(s.leverage)
          return (
            <div
              key={s.company.id}
              className="bg-surface-raised rounded-2xl border border-white/5 overflow-hidden"
            >
              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-white">{s.company.name}</h3>
                      {s.company.isRegional && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-success/15 text-success font-medium">
                          REGIONAL · PR boost
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted mt-1">
                      {s.company.city} · {s.company.state} · {sponsorLabel(s.company)}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-3xl font-bold text-accent leading-none">{s.overall}</div>
                    <div className="text-[10px] text-muted uppercase tracking-wider mt-1">PR match</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-4">
                  <MiniStat label="Skill fit" value={s.fit} />
                  <MiniStat label="Win chance" value={s.win} bandLabel={winBand.label} />
                  <MiniStat label="PR leverage" value={s.leverage} bandLabel={levBand.label} />
                </div>

                {s.matchedTags.length > 0 && (
                  <div className="flex gap-1.5 flex-wrap mt-4">
                    {s.matchedTags.map((t) => (
                      <span
                        key={t}
                        className="text-[11px] px-2 py-0.5 rounded-full bg-accent/15 text-accent"
                      >
                        {EXPERTISE_ICONS[t]} {EXPERTISE_LABELS[t]}
                      </span>
                    ))}
                    {s.gapTags.map((t) => (
                      <span
                        key={t}
                        className="text-[11px] px-2 py-0.5 rounded-full bg-surface-overlay text-muted"
                        title="They value this but your weight is low — a growth area."
                      >
                        + {EXPERTISE_LABELS[t]}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => setExpanded(isOpen ? null : s.company.id)}
                    className="text-sm text-accent hover:underline"
                  >
                    {isOpen ? 'Hide analysis' : 'Why it suits →'}
                  </button>
                  <span className="text-muted">·</span>
                  <a
                    href={s.company.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-muted hover:text-white"
                  >
                    Careers ↗
                  </a>
                  <button
                    onClick={() => onTrack(s.company)}
                    className="text-sm text-muted hover:text-white ml-auto"
                  >
                    + Track
                  </button>
                </div>
              </div>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 border-t border-white/5 bg-surface/40">
                  <ul className="space-y-2 mt-3">
                    {s.reasons.map((r, i) => (
                      <li key={i} className="text-sm text-muted flex gap-2">
                        <span className="text-accent shrink-0">→</span>
                        {r}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 bg-surface-raised rounded-xl p-3">
                    <p className="text-xs text-muted">
                      <span className="text-white font-medium">Future opportunity:</span>{' '}
                      {s.company.futureOutlook}
                    </p>
                  </div>
                  {s.gapTags.length > 0 && (
                    <p className="text-xs text-warning/90 mt-3">
                      Growth edge: they also value{' '}
                      {s.gapTags.map((t) => EXPERTISE_LABELS[t]).join(', ')} — strengthening these
                      would raise your fit here.
                    </p>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function sponsorLabel(c: Company): string {
  if (c.sponsorsVisa === 'yes') return 'sponsors visa'
  if (c.sponsorsVisa === 'sometimes') return 'sometimes sponsors'
  return 'rarely sponsors'
}

function MiniStat({
  label,
  value,
  bandLabel,
}: {
  label: string
  value: number
  bandLabel?: string
}) {
  return (
    <div className="bg-surface-overlay/60 rounded-xl px-3 py-2 text-center">
      <div className="text-lg font-bold text-white leading-none">{value}</div>
      <div className="text-[10px] text-muted mt-1">
        {label}
        {bandLabel ? ` · ${bandLabel}` : ''}
      </div>
    </div>
  )
}
