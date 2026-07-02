import { useState, useEffect, useCallback, useMemo } from 'react'
import type {
  TabId,
  AppState,
  JobApplication,
  ExpertiseItem,
  PRProfile,
  Company,
  ProfilesStore,
} from './types'
import {
  loadProfiles,
  saveProfiles,
  createProfile,
  updateStreak,
  type OnboardingPrefs,
} from './storage'
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
import { Onboarding } from './components/Onboarding'
import { ProfileSwitcher } from './components/ProfileSwitcher'

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard')
  const [store, setStore] = useState<ProfilesStore>(loadProfiles)
  // When true, show the create-profile screen even though profiles exist.
  const [addingProfile, setAddingProfile] = useState(false)

  useEffect(() => {
    saveProfiles(store)
  }, [store])

  const activeProfile = useMemo(
    () => store.profiles.find((p) => p.id === store.activeId) ?? null,
    [store]
  )
  const state = activeProfile?.state ?? null

  // Roll the daily streak / reset tasks for the active profile once per day.
  useEffect(() => {
    if (!store.activeId) return
    setStore((prev) => ({
      ...prev,
      profiles: prev.profiles.map((p) =>
        p.id === prev.activeId ? { ...p, state: updateStreak(p.state) } : p
      ),
    }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store.activeId])

  // All state mutations target the active profile only.
  const update = useCallback((updater: (prev: AppState) => AppState) => {
    setStore((prev) => {
      if (!prev.activeId) return prev
      return {
        ...prev,
        profiles: prev.profiles.map((p) =>
          p.id === prev.activeId ? { ...p, state: updater(p.state) } : p
        ),
      }
    })
  }, [])

  const handleCreate = (name: string, prefs: OnboardingPrefs) => {
    const record = createProfile(name, prefs)
    setStore((prev) => ({ activeId: record.id, profiles: [...prev.profiles, record] }))
    setAddingProfile(false)
    setActiveTab('dashboard')
  }

  const switchProfile = (id: string) => {
    setStore((prev) => ({ ...prev, activeId: id }))
    setActiveTab('dashboard')
  }

  const renameProfile = (id: string, name: string) => {
    setStore((prev) => ({
      ...prev,
      profiles: prev.profiles.map((p) => (p.id === id ? { ...p, name } : p)),
    }))
  }

  const deleteProfile = (id: string) => {
    setStore((prev) => {
      const remaining = prev.profiles.filter((p) => p.id !== id)
      const activeId = prev.activeId === id ? remaining[0]?.id ?? null : prev.activeId
      return { activeId, profiles: remaining }
    })
  }

  // --- Show onboarding when there is no active profile, or when explicitly adding. ---
  if (!activeProfile || !state || addingProfile) {
    return (
      <Onboarding
        onCreate={handleCreate}
        onCancel={activeProfile && addingProfile ? () => setAddingProfile(false) : undefined}
        existingNames={store.profiles.map((p) => p.name)}
      />
    )
  }

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
      applications: [{ ...app, id: crypto.randomUUID() }, ...prev.applications],
    }))
  }

  const updateApplication = (id: string, updates: Partial<JobApplication>) => {
    update((prev) => ({
      ...prev,
      applications: prev.applications.map((a) => (a.id === id ? { ...a, ...updates } : a)),
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
        expertise: prev.profile.expertise.map((e) => (e.tag === tag ? { ...e, weight } : e)),
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

  const switcher = (
    <ProfileSwitcher
      profiles={store.profiles}
      activeId={store.activeId}
      onSwitch={switchProfile}
      onAdd={() => setAddingProfile(true)}
      onRename={renameProfile}
      onDelete={deleteProfile}
    />
  )

  return (
    <div className="min-h-screen">
      <Sidebar
        active={activeTab}
        onNavigate={setActiveTab}
        streak={state.streak}
        profileSwitcher={switcher}
      />
      <MobileNav
        active={activeTab}
        onNavigate={setActiveTab}
        streak={state.streak}
        profileSwitcher={<ProfileSwitcher
          profiles={store.profiles}
          activeId={store.activeId}
          onSwitch={switchProfile}
          onAdd={() => setAddingProfile(true)}
          onRename={renameProfile}
          onDelete={deleteProfile}
          compact
        />}
      />
      <main className="lg:ml-64 p-4 sm:p-6 lg:p-8 max-w-5xl pb-24 lg:pb-8">
        {activeTab === 'dashboard' && <Dashboard state={state} onNavigate={setActiveTab} />}
        {activeTab === 'matcher' && (
          <CompanyMatcher
            profile={state.profile}
            onChangeExpertise={updateExpertise}
            onToggleRegional={toggleRegionalIntent}
            onTrack={trackCompany}
          />
        )}
        {activeTab === 'pr' && <PRRoute profile={state.profile} onChangePR={updatePR} />}
        {activeTab === 'review' && <Reviewer />}
        {activeTab === 'daily' && <DailyRoutine tasks={state.dailyTasks} onToggle={toggleTask} />}
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
