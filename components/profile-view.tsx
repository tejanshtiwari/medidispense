'use client'

import {
  ShieldCheck,
  BadgeCheck,
  Hospital,
  IdCard,
  LogOut,
  Stethoscope,
  KeyRound,
} from 'lucide-react'
import { useDispenser } from '@/lib/dispenser-store'

function Row({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof IdCard
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-3 border-b border-border py-3.5 last:border-0">
      <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="size-4.5" />
      </span>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  )
}

export function ProfileView() {
  const { doctor, logout } = useDispenser()

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-foreground">Doctor Profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Your verified credentials and secure session.
        </p>
      </header>

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex items-center gap-4 border-b border-border bg-secondary/50 p-6">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md">
            <Stethoscope className="size-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-foreground">
                {doctor?.name ?? 'Dr. A. Sharma'}
              </h2>
              <BadgeCheck className="size-5 text-accent" />
            </div>
            <p className="text-sm text-muted-foreground">General Physician · MBBS, MD</p>
          </div>
        </div>

        <div className="p-6">
          <Row icon={IdCard} label="Registration ID" value={doctor?.regId ?? 'MH-DOC-20481'} />
          <Row
            icon={Hospital}
            label="Affiliated Hospital"
            value={doctor?.hospital ?? 'Govt. District General Hospital, Pune'}
          />
          <Row icon={KeyRound} label="Access Level" value="Full Dispensing Authority" />
          <Row icon={ShieldCheck} label="Session" value="Verified · MFA active" />
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-2">
            <ShieldCheck className="mt-0.5 size-4.5 shrink-0 text-primary" />
            <p className="text-sm text-muted-foreground text-pretty">
              Ending your session immediately revokes dispensing authority. You will
              need to re-verify your credentials to authorize new tokens.
            </p>
          </div>
          <button
            type="button"
            onClick={logout}
            className="flex shrink-0 items-center justify-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2.5 text-sm font-semibold text-destructive transition hover:bg-destructive hover:text-primary-foreground"
          >
            <LogOut className="size-4.5" />
            Sign out
          </button>
        </div>
      </div>
    </div>
  )
}
