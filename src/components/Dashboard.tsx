import type { AppState } from '../types'

interface DashboardProps {
  state: AppState
  onNavigate: (tab: 'daily' | 'applications' | 'career') => void
}

export function Dashboard({ state, onNavigate }: DashboardProps) {
  const completedToday = state.dailyTasks.filter((t) => t.completed).length
  const totalTasks = state.dailyTasks.length
  const progress = totalTasks ? Math.round((completedToday / totalTasks) * 100) : 0

  const statusCounts = state.applications.reduce(
    (acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )

  const activeApps = (statusCounts.applied || 0) + (statusCounts.interview || 0)
  const goalsDone = state.careerGoals.filter((g) => g.completed).length
  const goalsTotal = state.careerGoals.length

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <div className="space-y-8">
      <header>
        <h2 className="font-serif text-3xl sm:text-4xl text-white">
          {greeting()}, Architect
        </h2>
        <p className="text-muted mt-2">
          {new Date().toLocaleDateString('en-AU', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Today's Progress"
          value={`${progress}%`}
          sub={`${completedToday}/${totalTasks} tasks`}
          accent
          onClick={() => onNavigate('daily')}
        />
        <StatCard
          label="Active Applications"
          value={String(activeApps)}
          sub={`${state.applications.length} total tracked`}
          onClick={() => onNavigate('applications')}
        />
        <StatCard
          label="Day Streak"
          value={String(state.streak)}
          sub="Keep showing up daily"
        />
        <StatCard
          label="Career Goals"
          value={`${goalsDone}/${goalsTotal}`}
          sub="milestones reached"
          onClick={() => onNavigate('career')}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface-raised rounded-2xl p-6 border border-white/5">
          <h3 className="font-semibold text-white mb-4">Today's Checklist</h3>
          <div className="space-y-2">
            {state.dailyTasks.slice(0, 4).map((task) => (
              <div
                key={task.id}
                className={`flex items-center gap-3 p-3 rounded-xl text-sm ${
                  task.completed ? 'bg-success/10 text-success' : 'bg-surface-overlay text-muted'
                }`}
              >
                <span>{task.completed ? '✓' : '○'}</span>
                <span className={task.completed ? 'line-through opacity-70' : ''}>
                  {task.label}
                </span>
              </div>
            ))}
          </div>
          <button
            onClick={() => onNavigate('daily')}
            className="mt-4 text-sm text-accent hover:underline"
          >
            View all tasks →
          </button>
        </div>

        <div className="bg-surface-raised rounded-2xl p-6 border border-white/5">
          <h3 className="font-semibold text-white mb-4">Application Pipeline</h3>
          <div className="space-y-3">
            <PipelineBar label="Saved" count={statusCounts.saved || 0} color="bg-muted" />
            <PipelineBar label="Applied" count={statusCounts.applied || 0} color="bg-blue-500" />
            <PipelineBar label="Interview" count={statusCounts.interview || 0} color="bg-warning" />
            <PipelineBar label="Offer" count={statusCounts.offer || 0} color="bg-success" />
            <PipelineBar label="Rejected" count={statusCounts.rejected || 0} color="bg-accent/60" />
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-accent/10 to-transparent rounded-2xl p-6 border border-accent/20">
        <h3 className="font-semibold text-white mb-2">💡 Today's Focus</h3>
        <p className="text-muted text-sm leading-relaxed">
          {progress < 50
            ? 'Start with your morning search block — find 5 roles matching computational design or digital fabrication. Quality over quantity.'
            : progress < 100
              ? 'Great momentum! Finish your daily tasks and log any new applications before end of day.'
              : 'All tasks complete — consider updating one portfolio project or sending a networking message.'}
        </p>
      </div>
    </div>
  )
}

function StatCard({
  label,
  value,
  sub,
  accent,
  onClick,
}: {
  label: string
  value: string
  sub: string
  accent?: boolean
  onClick?: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`bg-surface-raised rounded-2xl p-5 border border-white/5 text-left transition-all hover:border-white/10 ${
        onClick ? 'cursor-pointer' : 'cursor-default'
      }`}
    >
      <div className="text-xs text-muted uppercase tracking-wider">{label}</div>
      <div className={`text-3xl font-bold mt-2 ${accent ? 'text-accent' : 'text-white'}`}>
        {value}
      </div>
      <div className="text-xs text-muted mt-1">{sub}</div>
    </button>
  )
}

function PipelineBar({
  label,
  count,
  color,
}: {
  label: string
  count: number
  color: string
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-muted w-20">{label}</span>
      <div className="flex-1 h-2 bg-surface-overlay rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all`}
          style={{ width: `${Math.min(count * 20, 100)}%` }}
        />
      </div>
      <span className="text-xs text-white w-6 text-right">{count}</span>
    </div>
  )
}
