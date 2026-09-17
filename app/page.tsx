'use client'

import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { DispenserProvider, useDispenser } from '@/lib/dispenser-store'
import { AppSidebar, type View } from '@/components/app-sidebar'
import { AuthView } from '@/components/auth-view'
import { DashboardView } from '@/components/dashboard-view'
import { DispenseView } from '@/components/dispense-view'
import { LogsView } from '@/components/logs-view'
import { ProfileView } from '@/components/profile-view'

function Shell() {
  const { isLoggedIn } = useDispenser()
  const [view, setView] = useState<View>('dashboard')
  const [mobileOpen, setMobileOpen] = useState(false)

  function navigate(v: View) {
    setView(v)
    setMobileOpen(false)
  }

  // Not authenticated: profile tab shows auth, everything else is gated to auth too.
  if (!isLoggedIn) {
    return (
      <div className="flex min-h-screen bg-background">
        <div className="hidden lg:block">
          <AppSidebar view="profile" onNavigate={() => {}} />
        </div>
        <main className="flex-1 overflow-y-auto">
          <AuthView />
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <AppSidebar view={view} onNavigate={navigate} />
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-foreground/40"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full">
            <AppSidebar view={view} onNavigate={navigate} />
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile top bar */}
        <div className="flex items-center gap-3 border-b border-border bg-card px-4 py-3 lg:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle navigation"
            className="rounded-md p-1.5 text-foreground hover:bg-secondary"
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
          <span className="text-sm font-bold text-foreground">MediDispense</span>
        </div>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {view === 'dashboard' && <DashboardView onNavigate={navigate} />}
          {view === 'dispense' && <DispenseView />}
          {view === 'logs' && <LogsView />}
          {view === 'profile' && <ProfileView />}
        </main>
      </div>
    </div>
  )
}

export default function Page() {
  return (
    <DispenserProvider>
      <Shell />
    </DispenserProvider>
  )
}
