import type { DailyTask } from '../types'

const CATEGORY_COLORS: Record<DailyTask['category'], string> = {
  search: 'text-blue-400 bg-blue-400/10',
  apply: 'text-accent bg-accent/10',
  network: 'text-purple-400 bg-purple-400/10',
  portfolio: 'text-warning bg-warning/10',
  learn: 'text-success bg-success/10',
}

const CATEGORY_LABELS: Record<DailyTask['category'], string> = {
  search: 'Search',
  apply: 'Apply',
  network: 'Network',
  portfolio: 'Portfolio',
  learn: 'Learn',
}

interface DailyRoutineProps {
  tasks: DailyTask[]
  onToggle: (id: string) => void
}

export function DailyRoutine({ tasks, onToggle }: DailyRoutineProps) {
  const completed = tasks.filter((t) => t.completed).length
  const progress = tasks.length ? Math.round((completed / tasks.length) * 100) : 0

  return (
    <div className="space-y-8">
      <header>
        <h2 className="font-serif text-3xl sm:text-4xl text-white">Daily Routine</h2>
        <p className="text-muted mt-2">
          Your structured job-hunting workflow — complete these every weekday
        </p>
      </header>

      <div className="bg-surface-raised rounded-2xl p-6 border border-white/5">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-muted">Daily completion</span>
          <span className="text-sm font-semibold text-white">
            {completed}/{tasks.length} ({progress}%)
          </span>
        </div>
        <div className="h-3 bg-surface-overlay rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-accent to-accent/60 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        {progress === 100 && (
          <p className="text-success text-sm mt-3">
            🎉 All done for today! Your streak is growing.
          </p>
        )}
      </div>

      <div className="space-y-3">
        {tasks.map((task, i) => (
          <button
            key={task.id}
            onClick={() => onToggle(task.id)}
            className={`w-full flex items-start gap-4 p-5 rounded-2xl border transition-all text-left ${
              task.completed
                ? 'bg-success/5 border-success/20'
                : 'bg-surface-raised border-white/5 hover:border-white/10'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                task.completed
                  ? 'bg-success text-surface'
                  : 'bg-surface-overlay text-muted'
              }`}
            >
              {task.completed ? '✓' : i + 1}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full ${CATEGORY_COLORS[task.category]}`}
                >
                  {CATEGORY_LABELS[task.category]}
                </span>
              </div>
              <p
                className={`text-sm leading-relaxed ${
                  task.completed ? 'text-muted line-through' : 'text-white'
                }`}
              >
                {task.label}
              </p>
            </div>
          </button>
        ))}
      </div>

      <div className="bg-surface-raised rounded-2xl p-6 border border-white/5">
        <h3 className="font-semibold text-white mb-3">⏰ Suggested Schedule</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <ScheduleBlock time="8:00 – 8:45" activity="Morning search & save roles" />
          <ScheduleBlock time="9:00 – 10:30" activity="Apply to 1–2 positions" />
          <ScheduleBlock time="12:00 – 12:30" activity="Portfolio update" />
          <ScheduleBlock time="17:00 – 17:20" activity="Networking & LinkedIn" />
          <ScheduleBlock time="20:00 – 20:30" activity="Skill practice (AI/tools)" />
          <ScheduleBlock time="21:00 – 21:10" activity="Log & reflect" />
        </div>
      </div>
    </div>
  )
}

function ScheduleBlock({ time, activity }: { time: string; activity: string }) {
  return (
    <div className="flex gap-3">
      <span className="text-accent text-xs font-mono whitespace-nowrap pt-0.5">{time}</span>
      <span className="text-muted">{activity}</span>
    </div>
  )
}
