'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import { Minus, Plus, ScanLine, Phone, Fingerprint, PackageX } from 'lucide-react'
import { useDispenser, type DispenseLog } from '@/lib/dispenser-store'
import { DispenseModal } from './dispense-modal'

export function DispenseView() {
  const { medicines, dispense } = useDispenser()
  const [patientMode, setPatientMode] = useState<'phone' | 'abha'>('phone')
  const [patientValue, setPatientValue] = useState('')
  const [cart, setCart] = useState<Record<string, number>>({})
  const [activeLog, setActiveLog] = useState<DispenseLog | null>(null)

  const totalItems = useMemo(
    () => Object.values(cart).reduce((a, b) => a + b, 0),
    [cart],
  )

  function changeQty(id: string, delta: number, max: number) {
    setCart((prev) => {
      const next = Math.min(max, Math.max(0, (prev[id] ?? 0) + delta))
      return { ...prev, [id]: next }
    })
  }

  const canDispense = totalItems > 0 && patientValue.trim().length > 0

  function handleDispense() {
    if (!canDispense) return
    const patientId =
      patientMode === 'phone' ? `+91 ${patientValue}` : `ABHA ${patientValue}`
    const log = dispense(
      patientId,
      Object.entries(cart).map(([id, qty]) => ({ id, qty })),
    )
    setActiveLog(log)
    setCart({})
    setPatientValue('')
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-foreground">Authorize &amp; Dispense</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Identify the patient, select medicines, and generate a secure dispense token.
        </p>
      </header>

      {/* Patient identification */}
      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <span className="flex size-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
            1
          </span>
          <h2 className="text-sm font-semibold text-foreground">Patient Identification</h2>
        </div>

        <div className="mb-3 inline-flex rounded-lg border border-border bg-secondary p-1">
          <button
            type="button"
            onClick={() => setPatientMode('phone')}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition ${
              patientMode === 'phone'
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground'
            }`}
          >
            <Phone className="size-4" />
            Phone Number
          </button>
          <button
            type="button"
            onClick={() => setPatientMode('abha')}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition ${
              patientMode === 'abha'
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground'
            }`}
          >
            <Fingerprint className="size-4" />
            ABHA ID
          </button>
        </div>

        <div className="relative max-w-md">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">
            {patientMode === 'phone' ? '+91' : 'ID'}
          </span>
          <input
            type="text"
            value={patientValue}
            onChange={(e) => setPatientValue(e.target.value)}
            placeholder={
              patientMode === 'phone' ? '98765 43210' : '14-1234-5678-9012'
            }
            className="w-full rounded-lg border border-input bg-background py-2.5 pl-12 pr-3 text-sm text-foreground outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30"
          />
        </div>
      </section>

      {/* Medicine grid */}
      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <span className="flex size-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
            2
          </span>
          <h2 className="text-sm font-semibold text-foreground">Select Medicines</h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {medicines.map((med) => {
            const qty = cart[med.id] ?? 0
            const out = med.stock === 0
            return (
              <div
                key={med.id}
                className="flex flex-col rounded-xl border border-border bg-background p-3"
              >
                <div className="relative mb-3 flex h-28 items-center justify-center overflow-hidden rounded-lg bg-secondary">
                  <Image
                    src={med.image || '/placeholder.svg'}
                    alt={`${med.name} ${med.strength}`}
                    width={110}
                    height={110}
                    className="h-24 w-auto object-contain"
                  />
                  <span
                    className={`absolute right-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                      out
                        ? 'bg-destructive/15 text-destructive'
                        : med.stock < 15
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-accent/15 text-accent'
                    }`}
                  >
                    {out ? 'Out of stock' : `${med.stock} in stock`}
                  </span>
                </div>

                <p className="text-sm font-semibold text-foreground">{med.name}</p>
                <p className="text-xs text-muted-foreground">
                  {med.strength} · Slot {med.slot}
                </p>

                <div className="mt-3 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => changeQty(med.id, -1, med.stock)}
                    disabled={qty === 0}
                    aria-label={`Decrease ${med.name}`}
                    className="flex size-8 items-center justify-center rounded-md border border-border bg-card text-foreground transition hover:bg-secondary disabled:opacity-40"
                  >
                    <Minus className="size-4" />
                  </button>
                  <span className="min-w-8 text-center font-mono text-base font-bold text-foreground">
                    {qty}
                  </span>
                  <button
                    type="button"
                    onClick={() => changeQty(med.id, 1, med.stock)}
                    disabled={out || qty >= med.stock}
                    aria-label={`Increase ${med.name}`}
                    className="flex size-8 items-center justify-center rounded-md border border-border bg-primary text-primary-foreground transition hover:opacity-90 disabled:opacity-40"
                  >
                    <Plus className="size-4" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Dispense action */}
      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {totalItems > 0 ? (
              <span className="flex items-center gap-1.5">
                <span className="flex size-6 items-center justify-center rounded-full bg-primary/10 font-mono text-xs font-bold text-primary">
                  {totalItems}
                </span>
                unit{totalItems !== 1 ? 's' : ''} selected
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <PackageX className="size-4" />
                No medicines selected
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleDispense}
            disabled={!canDispense}
            className="flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ScanLine className="size-5" />
            Authorize &amp; Dispense Medicine
          </button>
        </div>
      </section>

      {activeLog && (
        <DispenseModal log={activeLog} onClose={() => setActiveLog(null)} />
      )}
    </div>
  )
}
