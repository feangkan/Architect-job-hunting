import { useState } from 'react'
import { GUIDELINES } from '../data/content'

export function Guidelines() {
  const [activeSection, setActiveSection] = useState(GUIDELINES[0].id)

  const section = GUIDELINES.find((g) => g.id === activeSection)!

  return (
    <div className="space-y-8">
      <header>
        <h2 className="font-serif text-4xl text-white">Guidelines</h2>
        <p className="text-muted mt-2">
          Tailored advice for AI, digital fabrication & architecture careers in Australia
        </p>
      </header>

      <div className="flex gap-2 flex-wrap">
        {GUIDELINES.map((g) => (
          <button
            key={g.id}
            onClick={() => setActiveSection(g.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeSection === g.id
                ? 'bg-accent text-white'
                : 'bg-surface-raised text-muted hover:text-white border border-white/5'
            }`}
          >
            {g.icon} {g.title}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {section.items.map((item, i) => (
          <div
            key={i}
            className="bg-surface-raised rounded-2xl p-6 border border-white/5"
          >
            <h3 className="font-semibold text-white mb-2">{item.title}</h3>
            <p className="text-sm text-muted leading-relaxed">{item.content}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
