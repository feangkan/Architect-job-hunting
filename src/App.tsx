import { useState, useEffect, useCallback } from 'react'
import type { TabId, AppState, JobApplication, ExpertiseItem, PRProfile, Company } from './types'
import { loadState, saveState } from './storage'
import { Sidebar } from './components/Sidebar'
import { MobileNav } from './components/MobileNav'
import { Dashboard } from './components/Dashboard'
import { DailyRoutine } from './components/DailyRoutine'
import { Applications } from './components/Applications'
import { Guidelines } from './components/Guidelines'
import { CareerPlan } from './components/CareerPlan'
import { CompanyMatcher } from './components/CompanyMatcher'
import { PRRoute } from './components/PRRoute'
import { Reviewer } from './components/Reviewer'

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard')
  const [state, setState] = useState<AppState>(loadState)

  useEffect(() => {
    saveState(state)
  }, [state])

  const update = useCallback((updater: (prev: AppState) => AppState) => {
    setState((prev) => updater(prev))
  }, [])

  const toggleTask = (id: string) => {
    update((prev) => ({
      ...prev,
      dailyTasks: prev.dailyTasks.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      ),
    }))
  }

  const addApplication = (app: Omit<JobApplication, 'id'>) => {
    update((prev) => ({
      ...prev,
      applications: [
        { ...app, id: crypto.randomUUID() },
        ...prev.applications,
      ],
    }))
  }

  const updateApplication = (id: string, updates: Partial<JobApplication>) => {
    update((prev) => ({
      ...prev,
      applications: prev.applications.map((a) =>
        a.id === id ? { ...a, ...updates } : a
      ),
    }))
  }

  const deleteApplication = (id: string) => {
    update((prev) => ({
      ...prev,
      applications: prev.applications.filter((a) => a.id !== id),
    }))
  }

  const toggleGoal = (id: string) => {
    update((prev) => ({
      ...prev,
      careerGoals: prev.careerGoals.map((g) =>
        g.id === id ? { ...g, completed: !g.completed } : g
      ),
    }))
  }

  const updateSkill = (id: string, level: AppState['skills'][0]['level']) => {
    update((prev) => ({
      ...prev,
      skills: prev.skills.map((s) => (s.id === id ? { ...s, level } : s)),
    }))
  }

  const updateExpertise = (tag: string, weight: ExpertiseItem['weight']) => {
    update((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        expertise: prev.profile.expertise.map((e) =>
          e.tag === tag ? { ...e, weight } : e
        ),
      },
    }))
  }

  const toggleRegionalIntent = (value: boolean) => {
    update((prev) => ({
      ...prev,
      profile: { ...prev.profile, regionalIntent: value },
    }))
  }

  const updatePR = (updates: Partial<PRProfile>) => {
    update((prev) => ({
      ...prev,
      profile: { ...prev.profile, pr: { ...prev.profile.pr, ...updates } },
    }))
  }

  const trackCompany = (company: Company) => {
    update((prev) => {
      if (prev.applications.some((a) => a.url === company.url && a.company === company.name)) {
        return prev
      }
      const newApp: JobApplication = {
        id: crypto.randomUUID(),
        company: company.name,
        role: 'Graduate / Computational Designer',
        location: `${company.city}, ${company.state}`,
        url: company.url,
        status: 'saved',
        dateApplied: '',
        notes: company.isRegional ? 'Regional employer — strong PR leverage (491).' : '',
        tags: [company.category, company.isRegional ? 'regional' : 'metro'],
      }
      return { ...prev, applications: [newApp, ...prev.applications] }
    })
    setActiveTab('applications')
  }

  return (
    <div className="min-h-screen">
      <Sidebar
        active={activeTab}
        onNavigate={setActiveTab}
        streak={state.streak}
      />
      <MobileNav
        active={activeTab}
        onNavigate={setActiveTab}
        streak={state.streak}
      />
      <main className="lg:ml-64 p-4 sm:p-6 lg:p-8 max-w-5xl pb-24 lg:pb-8">
        {activeTab === 'dashboard' && (
          <Dashboard state={state} onNavigate={setActiveTab} />
        )}
        {activeTab === 'matcher' && (
          <CompanyMatcher
            profile={state.profile}
            onChangeExpertise={updateExpertise}
            onToggleRegional={toggleRegionalIntent}
            onTrack={trackCompany}
          />
        )}
        {activeTab === 'pr' && (
          <PRRoute profile={state.profile} onChangePR={updatePR} />
        )}
        {activeTab === 'review' && <Reviewer />}
        {activeTab === 'daily' && (
          <DailyRoutine tasks={state.dailyTasks} onToggle={toggleTask} />
        )}
        {activeTab === 'applications' && (
          <Applications
            applications={state.applications}
            onAdd={addApplication}
            onUpdate={updateApplication}
            onDelete={deleteApplication}
          />
        )}
        {activeTab === 'guidelines' && <Guidelines />}
        {activeTab === 'career' && (
          <CareerPlan
            goals={state.careerGoals}
            skills={state.skills}
            onToggleGoal={toggleGoal}
            onUpdateSkill={updateSkill}
          />
        )}
      </main>
    </div>
  )
}
