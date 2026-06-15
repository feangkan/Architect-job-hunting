import type { CareerGoal, SkillItem } from '../types'
import { CAREER_ROADMAP } from '../data/content'

const TIMEFRAME_LABELS: Record<CareerGoal['timeframe'], { label: string; color: string }> = {
  short: { label: '0–6 months', color: 'text-success bg-success/10' },
  medium: { label: '6–18 months', color: 'text-warning bg-warning/10' },
  long: { label: '1–3 years', color: 'text-purple-400 bg-purple-400/10' },
}

const SKILL_CATEGORIES: Record<SkillItem['category'], string> = {
  ai: 'AI & Machine Learning',
  fabrication: 'Digital Fabrication',
  architecture: 'Architecture & Design',
  soft: 'Professional Skills',
}

interface CareerPlanProps {
  goals: CareerGoal[]
  skills: SkillItem[]
  onToggleGoal: (id: string) => void
  onUpdateSkill: (id: string, level: SkillItem['level']) => void
}

export function CareerPlan({ goals, skills, onToggleGoal, onUpdateSkill }: CareerPlanProps) {
  const goalsByTime = {
    short: goals.filter((g) => g.timeframe === 'short'),
    medium: goals.filter((g) => g.timeframe === 'medium'),
    long: goals.filter((g) => g.timeframe === 'long'),
  }

  const skillsByCategory = Object.entries(
    skills.reduce(
      (acc, skill) => {
        if (!acc[skill.category]) acc[skill.category] = []
        acc[skill.category].push(skill)
        return acc
      },
      {} as Record<string, SkillItem[]>
    )
  )

  return (
    <div className="space-y-10">
      <header>
        <h2 className="font-serif text-3xl sm:text-4xl text-white">Career Plan</h2>
        <p className="text-muted mt-2">
          Your roadmap from RMIT master's to computational design leadership
        </p>
      </header>

      <section>
        <h3 className="font-semibold text-white text-lg mb-6">🗺️ Career Roadmap</h3>
        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-px bg-white/10" />
          <div className="space-y-6">
            {CAREER_ROADMAP.map((phase, i) => (
              <div key={i} className="relative pl-14">
                <div className="absolute left-4 top-1 w-5 h-5 rounded-full bg-accent border-4 border-surface flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-white" />
                </div>
                <div className="bg-surface-raised rounded-2xl p-5 border border-white/5">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-mono text-accent">{phase.phase}</span>
                    <span className="text-xs bg-surface-overlay px-2 py-0.5 rounded-full text-muted">
                      {phase.focus}
                    </span>
                  </div>
                  <ul className="space-y-1.5">
                    {phase.actions.map((action, j) => (
                      <li key={j} className="text-sm text-muted flex gap-2">
                        <span className="text-accent shrink-0">→</span>
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <h3 className="font-semibold text-white text-lg mb-4">🎯 Goals</h3>
        {(['short', 'medium', 'long'] as const).map((timeframe) => (
          <div key={timeframe} className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className={`text-xs px-2.5 py-0.5 rounded-full ${TIMEFRAME_LABELS[timeframe].color}`}>
                {TIMEFRAME_LABELS[timeframe].label}
              </span>
            </div>
            <div className="space-y-2">
              {goalsByTime[timeframe].map((goal) => (
                <button
                  key={goal.id}
                  onClick={() => onToggleGoal(goal.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    goal.completed
                      ? 'bg-success/5 border-success/20'
                      : 'bg-surface-raised border-white/5 hover:border-white/10'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className={`mt-0.5 ${goal.completed ? 'text-success' : 'text-muted'}`}>
                      {goal.completed ? '✓' : '○'}
                    </span>
                    <div>
                      <p className={`text-sm font-medium ${goal.completed ? 'text-muted line-through' : 'text-white'}`}>
                        {goal.title}
                      </p>
                      <p className="text-xs text-muted mt-1">{goal.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </section>

      <section>
        <h3 className="font-semibold text-white text-lg mb-4">📊 Skills Tracker</h3>
        <div className="space-y-6">
          {skillsByCategory.map(([category, categorySkills]) => (
            <div key={category}>
              <h4 className="text-xs text-muted uppercase tracking-wider mb-3">
                {SKILL_CATEGORIES[category as SkillItem['category']]}
              </h4>
              <div className="space-y-3">
                {categorySkills.map((skill) => (
                  <SkillBar
                    key={skill.id}
                    skill={skill}
                    onUpdate={(level) => onUpdateSkill(skill.id, level)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

function SkillBar({
  skill,
  onUpdate,
}: {
  skill: SkillItem
  onUpdate: (level: SkillItem['level']) => void
}) {
  const gap = skill.target - skill.level

  return (
    <div className="bg-surface-raised rounded-xl p-4 border border-white/5">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-white">{skill.name}</span>
        <span className="text-xs text-muted">
          {skill.level}/{skill.target}
          {gap > 0 && <span className="text-warning ml-1">(+{gap} to target)</span>}
        </span>
      </div>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((level) => (
          <button
            key={level}
            onClick={() => onUpdate(level as SkillItem['level'])}
            className={`flex-1 h-2 rounded-full transition-all ${
              level <= skill.level
                ? level <= skill.target
                  ? 'bg-accent'
                  : 'bg-success'
                : level <= skill.target
                  ? 'bg-surface-overlay'
                  : 'bg-surface-overlay/50'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
