import { useState } from 'react'
import type { JobApplication, ApplicationStatus } from '../types'

const STATUS_CONFIG: Record<
  ApplicationStatus,
  { label: string; color: string }
> = {
  saved: { label: 'Saved', color: 'bg-muted/20 text-muted' },
  applied: { label: 'Applied', color: 'bg-blue-500/20 text-blue-400' },
  interview: { label: 'Interview', color: 'bg-warning/20 text-warning' },
  offer: { label: 'Offer', color: 'bg-success/20 text-success' },
  rejected: { label: 'Rejected', color: 'bg-accent/20 text-accent' },
  withdrawn: { label: 'Withdrawn', color: 'bg-white/10 text-muted' },
}

interface ApplicationsProps {
  applications: JobApplication[]
  onAdd: (app: Omit<JobApplication, 'id'>) => void
  onUpdate: (id: string, updates: Partial<JobApplication>) => void
  onDelete: (id: string) => void
}

export function Applications({ applications, onAdd, onUpdate, onDelete }: ApplicationsProps) {
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState<ApplicationStatus | 'all'>('all')

  const filtered =
    filter === 'all' ? applications : applications.filter((a) => a.status === filter)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    onAdd({
      company: fd.get('company') as string,
      role: fd.get('role') as string,
      location: fd.get('location') as string,
      url: fd.get('url') as string,
      status: (fd.get('status') as ApplicationStatus) || 'saved',
      dateApplied: fd.get('dateApplied') as string || new Date().toISOString().split('T')[0],
      notes: fd.get('notes') as string,
      salary: fd.get('salary') as string,
      tags: (fd.get('tags') as string).split(',').map((t) => t.trim()).filter(Boolean),
    })
    setShowForm(false)
    e.currentTarget.reset()
  }

  return (
    <div className="space-y-8">
      <header className="flex items-start justify-between">
        <div>
          <h2 className="font-serif text-4xl text-white">Applications</h2>
          <p className="text-muted mt-2">Track every role from saved to offer</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-5 py-2.5 bg-accent text-white rounded-xl text-sm font-medium hover:bg-accent/90 transition-colors"
        >
          {showForm ? 'Cancel' : '+ Add Application'}
        </button>
      </header>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-surface-raised rounded-2xl p-6 border border-white/5 grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <FormField label="Company" name="company" required />
          <FormField label="Role" name="role" required />
          <FormField label="Location" name="location" placeholder="Melbourne, VIC" />
          <FormField label="URL" name="url" placeholder="https://..." />
          <FormField label="Date Applied" name="dateApplied" type="date" />
          <FormField label="Salary (optional)" name="salary" placeholder="AUD 60,000" />
          <div>
            <label className="text-xs text-muted block mb-1">Status</label>
            <select
              name="status"
              className="w-full bg-surface-overlay border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white"
            >
              {Object.entries(STATUS_CONFIG).map(([key, { label }]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
          <FormField label="Tags" name="tags" placeholder="AI, fabrication, graduate" />
          <div className="md:col-span-2">
            <label className="text-xs text-muted block mb-1">Notes</label>
            <textarea
              name="notes"
              rows={2}
              className="w-full bg-surface-overlay border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white resize-none"
              placeholder="Key contacts, follow-up dates, etc."
            />
          </div>
          <div className="md:col-span-2">
            <button
              type="submit"
              className="px-6 py-2.5 bg-accent text-white rounded-xl text-sm font-medium"
            >
              Save Application
            </button>
          </div>
        </form>
      )}

      <div className="flex gap-2 flex-wrap">
        <FilterChip active={filter === 'all'} onClick={() => setFilter('all')} label="All" count={applications.length} />
        {(Object.keys(STATUS_CONFIG) as ApplicationStatus[]).map((status) => (
          <FilterChip
            key={status}
            active={filter === status}
            onClick={() => setFilter(status)}
            label={STATUS_CONFIG[status].label}
            count={applications.filter((a) => a.status === status).length}
          />
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-muted">
          <div className="text-4xl mb-4">📋</div>
          <p>No applications yet. Start by saving roles from your daily search.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered
            .sort((a, b) => b.dateApplied.localeCompare(a.dateApplied))
            .map((app) => (
              <ApplicationCard
                key={app.id}
                app={app}
                onUpdate={onUpdate}
                onDelete={onDelete}
              />
            ))}
        </div>
      )}
    </div>
  )
}

function ApplicationCard({
  app,
  onUpdate,
  onDelete,
}: {
  app: JobApplication
  onUpdate: (id: string, updates: Partial<JobApplication>) => void
  onDelete: (id: string) => void
}) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="bg-surface-raised rounded-2xl border border-white/5 overflow-hidden">
      <div
        className="flex items-center gap-4 p-5 cursor-pointer hover:bg-white/[0.02]"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h3 className="font-semibold text-white">{app.role}</h3>
            <span className={`text-xs px-2.5 py-0.5 rounded-full ${STATUS_CONFIG[app.status].color}`}>
              {STATUS_CONFIG[app.status].label}
            </span>
          </div>
          <p className="text-sm text-muted mt-1">
            {app.company} · {app.location || 'Location N/A'}
          </p>
        </div>
        <div className="text-xs text-muted whitespace-nowrap">{app.dateApplied}</div>
        <span className="text-muted">{expanded ? '▲' : '▼'}</span>
      </div>

      {expanded && (
        <div className="px-5 pb-5 border-t border-white/5 pt-4 space-y-3">
          {app.url && (
            <a href={app.url} target="_blank" rel="noopener noreferrer" className="text-sm text-accent hover:underline">
              View listing →
            </a>
          )}
          {app.salary && <p className="text-sm text-muted">Salary: {app.salary}</p>}
          {app.notes && <p className="text-sm text-muted">{app.notes}</p>}
          {app.tags.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {app.tags.map((tag) => (
                <span key={tag} className="text-xs bg-surface-overlay px-2 py-1 rounded-full text-muted">
                  {tag}
                </span>
              ))}
            </div>
          )}
          <div className="flex items-center gap-3 pt-2">
            <select
              value={app.status}
              onChange={(e) => onUpdate(app.id, { status: e.target.value as ApplicationStatus })}
              className="bg-surface-overlay border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white"
            >
              {Object.entries(STATUS_CONFIG).map(([key, { label }]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
            <button
              onClick={() => onDelete(app.id)}
              className="text-xs text-accent hover:underline ml-auto"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function FormField({
  label,
  name,
  type = 'text',
  required,
  placeholder,
}: {
  label: string
  name: string
  type?: string
  required?: boolean
  placeholder?: string
}) {
  return (
    <div>
      <label className="text-xs text-muted block mb-1">{label}</label>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full bg-surface-overlay border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-muted/50"
      />
    </div>
  )
}

function FilterChip({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean
  onClick: () => void
  label: string
  count: number
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
        active ? 'bg-accent text-white' : 'bg-surface-overlay text-muted hover:text-white'
      }`}
    >
      {label} ({count})
    </button>
  )
}
