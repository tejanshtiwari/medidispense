'use client'

import {
  LayoutDashboard,
  ScanLine,
  Activity,
  UserCog,
  Pill,
  LogOut,
  ShieldCheck,
} from 'lucide-react'
import { useDispenser } from '@/lib/dispenser-store'

export type View = 'dashboard' | 'dispense' | 'logs' | 'profile'

const NAV: { id: View; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
  { id: 'dispense', label: 'Authorize & Dispense', icon: ScanLine },
  { id: 'logs', label: 'Prescriptions & Logs', icon: Activity },
  { id: 'profile', label: 'Doctor Profile', icon: UserCog },
]

export function AppSidebar({
  view,
  onNavigate,
}: {
  view: View
  onNavigate: (v: View) => void
}) {
  const { isLoggedIn, doctor, logout } = useDispenser()

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar">
      <div className="flex items-center gap-3 border-b border-sidebar-border px-5 py-5">
        <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
          <Pill className="size-5" />
        </div>
        <div className="leading-tight">
          <p className="text-sm font-bold text-sidebar-foreground">MediDispense</p>
          <p className="text-xs text-muted-foreground">Doctor Console</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {NAV.map((item) => {
          const active = view === item.id
          const Icon = item.icon
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              aria-current={active ? 'page' : undefined}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              }`}
            >
              <Icon className="size-4.5 shrink-0" />
              <span className="text-pretty text-left">{item.label}</span>
            </button>
          )
        })}
      </nav>

      <div className="border-t border-sidebar-border p-3">
        {isLoggedIn && doctor ? (
          <div className="rounded-lg bg-sidebar-accent p-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-primary" />
              <p className="truncate text-xs font-semibold text-sidebar-accent-foreground">
                {doctor.name}
              </p>
            </div>
            <p className="mt-1 truncate text-[11px] text-muted-foreground">
              ID: {doctor.regId}
            </p>
            <button
              type="button"
              onClick={logout}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-md border border-sidebar-border bg-sidebar px-3 py-1.5 text-xs font-medium text-sidebar-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            >
              <LogOut className="size-3.5" />
              Sign out
            </button>
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-sidebar-border p-3 text-center">
            <p className="text-xs font-medium text-muted-foreground">
              Not authenticated
            </p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              Login required to dispense
            </p>
          </div>
        )}
      </div>
    </aside>
  )
}
