'use client'

import { Cpu, CircleDot, Radio, ChevronRight, Wifi } from 'lucide-react'
import { useDispenser, type DispenseLog } from '@/lib/dispenser-store'

const STATUS_STYLES: Record<DispenseLog['status'], string> = {
  Generated: 'bg-primary/10 text-primary',
  'Scanned by Machine': 'bg-amber-100 text-amber-700',
  'Dispensed Successfully': 'bg-accent/15 text-accent',
}

export function LogsView() {
  const { medicines, logs, advanceLog } = useDispenser()

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-foreground">
          Vending Machine Status &amp; Logs
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Live hardware monitoring and dispense history.
        </p>
      </header>

      {/* Monitor screen */}
      <section className="overflow-hidden rounded-2xl border border-border shadow-sm">
        <div className="flex items-center justify-between bg-foreground px-5 py-3">
          <div className="flex items-center gap-2 text-background">
            <Cpu className="size-4.5" />
            <span className="text-sm font-semibold">Machine Monitor · Unit #DGH-01</span>
          </div>
          <span className="flex items-center gap-1.5 rounded-full bg-accent/20 px-2.5 py-1 text-xs font-semibold text-accent">
            <CircleDot className="size-3 animate-pulse" />
            ONLINE via ESP32 / Raspberry Pi
          </span>
        </div>

        <div className="grid grid-cols-1 gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
          {medicines.map((med) => (
            <div key={med.id} className="bg-card p-4">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                  <Radio className="size-3.5 text-accent" />
                  Slot {med.slot}
                </span>
                <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-semibold text-accent">
                  READY
                </span>
              </div>
              <p className="mt-2 text-sm font-semibold text-foreground">
                {med.name} {med.strength}
              </p>
              <p className="text-xs text-muted-foreground">{med.motor}</p>
              <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                <Wifi className="size-3.5 text-accent" />
                Calibrated · {med.stock} loaded
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Log table */}
      <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="border-b border-border px-5 py-4">
          <h2 className="text-sm font-semibold text-foreground">Dispense Logs</h2>
          <p className="text-xs text-muted-foreground">
            Advance a token to simulate the machine scanning and dispensing.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/50 text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-5 py-3 font-semibold">Timestamp</th>
                <th className="px-5 py-3 font-semibold">Patient ID</th>
                <th className="px-5 py-3 font-semibold">Medicines</th>
                <th className="px-5 py-3 font-semibold">Token</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold" />
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr
                  key={log.id}
                  className="border-b border-border last:border-0 hover:bg-secondary/30"
                >
                  <td className="whitespace-nowrap px-5 py-3 font-mono text-xs text-muted-foreground">
                    {log.timestamp}
                  </td>
                  <td className="whitespace-nowrap px-5 py-3 font-medium text-foreground">
                    {log.patientId}
                  </td>
                  <td className="px-5 py-3 text-foreground">
                    {log.medicines.map((m) => (
                      <span key={m.name} className="mr-2 inline-block whitespace-nowrap">
                        {m.name}
                        <span className="ml-1 font-mono text-primary">x{m.qty}</span>
                      </span>
                    ))}
                  </td>
                  <td className="whitespace-nowrap px-5 py-3 font-mono text-xs font-semibold text-primary">
                    {log.token}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[log.status]}`}
                    >
                      {log.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    {log.status !== 'Dispensed Successfully' ? (
                      <button
                        type="button"
                        onClick={() => advanceLog(log.id)}
                        className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-2.5 py-1 text-xs font-medium text-foreground transition hover:bg-primary hover:text-primary-foreground"
                      >
                        Advance
                        <ChevronRight className="size-3.5" />
                      </button>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
