import { useMemo } from 'react'
import type { AgeBracket, EnglishLevel, PRProfile, UserProfile } from '../types'
import { calcPoints, suggestLevers, recommendPathways, ENGLISH_LABELS } from '../lib/prPoints'
import { Disclaimer } from './Disclaimer'

interface PRRouteProps {
  profile: UserProfile
  onChangePR: (updates: Partial<PRProfile>) => void
}

export function PRRoute({ profile, onChangePR }: PRRouteProps) {
  const pr = profile.pr
  const result = useMemo(() => calcPoints(pr), [pr])
  const levers = useMemo(() => suggestLevers(pr), [pr])
  const pathways = useMemo(
    () => recommendPathways(pr, profile.regionalIntent),
    [pr, profile.regionalIntent]
  )

  const competitiveColor =
    result.competitive === 'strong'
      ? 'text-success'
      : result.competitive === 'competitive'
        ? 'text-success'
        : result.competitive === 'borderline'
          ? 'text-warning'
          : 'text-accent'

  return (
    <div className="space-y-6">
      <header>
        <h2 className="font-serif text-3xl sm:text-4xl text-white">PR Route Analyzer</h2>
        <p className="text-muted mt-2">
          Estimate your skilled-migration points and find the shortest realistic route to permanent
          residency. Adjust any factor to simulate.
        </p>
      </header>

      <Disclaimer>
        This is an educational estimate of the GSM points test for an Architect (ANZSCO 232111), not
        migration advice. Points rules, occupation lists, and invitation cut-offs change regularly.
        Confirm everything with the Department of Home Affairs and a registered (MARA) migration
        agent before acting. No tool can guarantee a visa outcome.
      </Disclaimer>

      {/* Score summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <ScoreCard title="189 (independent)" points={result.base} hint="no nomination" />
        <ScoreCard title="190 (state)" points={result.visa190} hint="+5 nomination" />
        <ScoreCard title="491 (regional)" points={result.visa491} hint="+15 regional" highlight />
      </div>

      <div className="bg-surface-raised rounded-2xl p-5 border border-white/5">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <span className="text-sm text-muted">Best achievable score (491): </span>
            <span className="text-2xl font-bold text-white">{result.visa491}</span>
          </div>
          <span className={`text-sm font-medium ${competitiveColor}`}>
            {labelFor(result.competitive)}
          </span>
        </div>
        <p className="text-xs text-muted mt-2">
          Minimum to be invited is 65 (including any nomination). Architecture invitations are
          competitive, so aim well above the floor — the regional 491 route is usually the most
          achievable.
        </p>
      </div>

      {/* Highest-impact levers */}
      <section>
        <h3 className="font-semibold text-white text-lg mb-3">⚡ Highest-impact levers</h3>
        <div className="space-y-2">
          {levers.map((l) => (
            <div
              key={l.id}
              className={`rounded-xl p-4 border ${
                l.active
                  ? 'bg-success/5 border-success/20'
                  : 'bg-surface-raised border-white/5'
              }`}
            >
              <div className="flex items-start gap-3">
                <span
                  className={`text-sm font-bold shrink-0 px-2 py-0.5 rounded-md ${
                    l.active ? 'bg-success/15 text-success' : 'bg-accent/15 text-accent'
                  }`}
                >
                  {l.gain}
                </span>
                <div>
                  <p className="text-sm font-medium text-white flex items-center gap-2">
                    {l.active && <span className="text-success">✓</span>}
                    {l.title}
                    <span className="text-[10px] text-muted uppercase tracking-wide">
                      {windowLabel(l.inWindow)}
                    </span>
                  </p>
                  <p className="text-xs text-muted mt-1 leading-relaxed">{l.detail}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pathways */}
      <section>
        <h3 className="font-semibold text-white text-lg mb-3">🧭 Recommended pathway</h3>
        <div className="space-y-2">
          {pathways.map((p) => (
            <div key={p.code} className="bg-surface-raised rounded-xl p-4 border border-white/5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-mono bg-surface-overlay px-2 py-0.5 rounded text-white">
                  {p.code}
                </span>
                <span className="text-sm font-medium text-white">{p.name}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${fitColor(p.fit)}`}>
                  {p.fit === 'shortest' ? 'shortest route' : p.fit}
                </span>
              </div>
              <p className="text-xs text-muted mt-2 leading-relaxed">{p.summary}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Editable factors */}
      <section>
        <h3 className="font-semibold text-white text-lg mb-3">🎛 Your factors (simulate)</h3>
        <div className="bg-surface-raised rounded-2xl p-5 border border-white/5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Age bracket"
            value={pr.age}
            options={[
              ['18-24', '18–24 (25 pts)'],
              ['25-32', '25–32 (30 pts)'],
              ['33-39', '33–39 (25 pts)'],
              ['40-44', '40–44 (15 pts)'],
              ['45+', '45+ (0 pts)'],
            ]}
            onChange={(v) => onChangePR({ age: v as AgeBracket })}
          />
          <Select
            label="English level"
            value={pr.english}
            options={(['competent', 'proficient', 'superior'] as EnglishLevel[]).map((e) => [
              e,
              ENGLISH_LABELS[e],
            ])}
            onChange={(v) => onChangePR({ english: v as EnglishLevel })}
          />
          <Select
            label="Australian work experience"
            value={String(pr.ausWorkYears)}
            options={[
              ['0', 'None (0 pts)'],
              ['1', '1–2 yrs (5 pts)'],
              ['3', '3–4 yrs (10 pts)'],
              ['5', '5–7 yrs (15 pts)'],
              ['8', '8+ yrs (20 pts)'],
            ]}
            onChange={(v) => onChangePR({ ausWorkYears: Number(v) as PRProfile['ausWorkYears'] })}
          />
          <Select
            label="Overseas work experience"
            value={String(pr.overseasWorkYears)}
            options={[
              ['0', 'None (0 pts)'],
              ['3', '3–4 yrs (5 pts)'],
              ['5', '5–7 yrs (10 pts)'],
              ['8', '8+ yrs (15 pts)'],
            ]}
            onChange={(v) =>
              onChangePR({ overseasWorkYears: Number(v) as PRProfile['overseasWorkYears'] })
            }
          />
          <Select
            label="Partner / relationship"
            value={pr.partnerStatus}
            options={[
              ['single', 'Single (10 pts)'],
              ['partner-skilled', 'Partner skilled + English (10 pts)'],
              ['partner-english', 'Partner competent English (5 pts)'],
              ['partner-australian', 'Partner is citizen/PR (10 pts)'],
            ]}
            onChange={(v) => onChangePR({ partnerStatus: v as PRProfile['partnerStatus'] })}
          />
          <Select
            label="Nomination"
            value={pr.nomination}
            options={[
              ['none', 'None'],
              ['190', '190 state (+5)'],
              ['491', '491 regional (+15)'],
            ]}
            onChange={(v) => onChangePR({ nomination: v as PRProfile['nomination'] })}
          />

          <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-white/5">
            <Toggle
              label="Master's / Bachelor's degree (+15)"
              checked={pr.hasDegree}
              onChange={(v) => onChangePR({ hasDegree: v })}
            />
            <Toggle
              label="Australian study requirement (+5)"
              checked={pr.australianStudy}
              onChange={(v) => onChangePR({ australianStudy: v })}
            />
            <Toggle
              label="Regional study (+5)"
              checked={pr.regionalStudy}
              onChange={(v) => onChangePR({ regionalStudy: v })}
            />
            <Toggle
              label="Professional Year (+5)"
              checked={pr.professionalYear}
              onChange={(v) => onChangePR({ professionalYear: v })}
            />
            <Toggle
              label="NAATI community language (+5)"
              checked={pr.naatiLanguage}
              onChange={(v) => onChangePR({ naatiLanguage: v })}
            />
          </div>
        </div>
      </section>

      {/* Breakdown */}
      <section>
        <h3 className="font-semibold text-white text-lg mb-3">📋 Points breakdown</h3>
        <div className="bg-surface-raised rounded-2xl border border-white/5 divide-y divide-white/5">
          {result.lines.map((line) => (
            <div key={line.label} className="flex items-center justify-between px-5 py-3">
              <div>
                <p className="text-sm text-white">{line.label}</p>
                {line.note && <p className="text-xs text-muted">{line.note}</p>}
              </div>
              <span
                className={`text-sm font-bold tabular-nums ${
                  line.points > 0 ? 'text-white' : 'text-muted'
                }`}
              >
                {line.points}
              </span>
            </div>
          ))}
          <div className="flex items-center justify-between px-5 py-3 bg-surface-overlay/40">
            <p className="text-sm font-semibold text-white">Subtotal (before nomination)</p>
            <span className="text-lg font-bold text-accent tabular-nums">{result.base}</span>
          </div>
        </div>
      </section>
    </div>
  )
}

function labelFor(c: ReturnType<typeof calcPoints>['competitive']): string {
  switch (c) {
    case 'strong':
      return 'Strong — well above typical cut-offs'
    case 'competitive':
      return 'Competitive — realistic with nomination'
    case 'borderline':
      return 'Borderline — meets minimum, push the levers'
    default:
      return 'Below minimum — focus on the levers below'
  }
}

function windowLabel(w: 'study' | 'post-grad' | 'either'): string {
  if (w === 'study') return 'do during study'
  if (w === 'post-grad') return 'post-graduation'
  return 'anytime'
}

function fitColor(fit: 'shortest' | 'strong' | 'backup'): string {
  if (fit === 'shortest') return 'bg-success/15 text-success'
  if (fit === 'strong') return 'bg-accent/15 text-accent'
  return 'bg-surface-overlay text-muted'
}

function ScoreCard({
  title,
  points,
  hint,
  highlight,
}: {
  title: string
  points: number
  hint: string
  highlight?: boolean
}) {
  const meets = points >= 65
  return (
    <div
      className={`rounded-2xl p-5 border ${
        highlight ? 'bg-accent/10 border-accent/30' : 'bg-surface-raised border-white/5'
      }`}
    >
      <div className="text-xs text-muted uppercase tracking-wider">{title}</div>
      <div className={`text-3xl font-bold mt-1 ${meets ? 'text-success' : 'text-white'}`}>
        {points}
      </div>
      <div className="text-xs text-muted mt-1">
        {hint} · {meets ? 'meets 65 floor' : 'below 65'}
      </div>
    </div>
  )
}

function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: [string, string][]
  onChange: (value: string) => void
}) {
  return (
    <label className="block">
      <span className="text-xs text-muted">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full bg-surface-overlay text-white text-sm rounded-lg px-3 py-2 border border-white/5 focus:outline-none focus:border-accent"
      >
        {options.map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>
    </label>
  )
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (value: boolean) => void
}) {
  return (
    <label className="flex items-center gap-3 cursor-pointer py-1">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 accent-accent"
      />
      <span className="text-sm text-white">{label}</span>
    </label>
  )
}
