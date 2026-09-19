'use client'

import {
  Activity,
  Boxes,
  Cpu,
  ScanLine,
  TrendingUp,
  CircleDot,
  ArrowRight,
} from 'lucide-react'
import { useDispenser } from '@/lib/dispenser-store'
import type { View } from './app-sidebar'

function StatCard({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: typeof Activity
  label: string
  value: string
  hint: string
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="size-4.5" />
        </span>
      </div>
      <p className="mt-3 text-3xl font-bold text-foreground">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
    </div>
  )
}

export function DashboardView({ onNavigate }: { onNavigate: (v: View) => void }) {
  const { medicines, logs, doctor } = useDispenser()

  const totalStock = medicines.reduce((a, m) => a + m.stock, 0)
  const dispensedToday = logs.filter(
    (l) => l.status === 'Dispensed Successfully',
  ).length
  const pending = logs.filter((l) => l.status !== 'Dispensed Successfully').length

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Welcome back, {doctor?.name ?? 'Doctor'}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {doctor?.hospital ?? 'Automated dispensing overview'}
          </p>
        </div>
        <button
          type="button"
          onClick={() => onNavigate('dispense')}
          className="flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-95"
        >
          <ScanLine className="size-4.5" />
          New Dispense
        </button>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={ScanLine}
          label="Dispensed Today"
          value={String(dispensedToday)}
          hint="Successful transactions"
        />
        <StatCard
          icon={Activity}
          label="Pending Tokens"
          value={String(pending)}
          hint="Awaiting machine scan"
        />
        <StatCard
          icon={Boxes}
          label="Total Stock"
          value={String(totalStock)}
          hint="Units across all slots"
        />
        <StatCard
          icon={Cpu}
          label="Machine Slots"
          value={String(medicines.length)}
          hint="Servo-controlled dispensers"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Machine status */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm lg:col-span-1">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">Hardware Status</h2>
            <span className="flex items-center gap-1.5 rounded-full bg-accent/15 px-2.5 py-1 text-xs font-semibold text-accent">
              <CircleDot className="size-3 animate-pulse" />
              ONLINE
            </span>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Controller</span>
              <span className="font-medium text-foreground">ESP32 / Raspberry Pi</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Firmware</span>
              <span className="font-mono text-foreground">v2.4.1</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Uptime</span>
              <span className="font-medium text-foreground">12h 41m</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Link</span>
              <span className="font-medium text-accent">MQTT · secure</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('logs')}
            className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-lg border border-border bg-background py-2 text-sm font-medium text-foreground transition hover:bg-secondary"
          >
            View live monitor
            <ArrowRight className="size-4" />
          </button>
        </div>

        {/* Stock levels */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm lg:col-span-2">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
            <TrendingUp className="size-4 text-primary" />
            Slot Inventory Levels
          </h2>
          <div className="space-y-4">
            {medicines.map((med) => {
              const pct = Math.min(100, (med.stock / 60) * 100)
              return (
                <div key={med.id}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">
                      Slot {med.slot} · {med.name} {med.strength}
                    </span>
                    <span className="font-mono text-muted-foreground">
                      {med.stock} units
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-secondary">
                    <div
                      className={`h-full rounded-full ${
                        med.stock < 15 ? 'bg-amber-500' : 'bg-primary'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
