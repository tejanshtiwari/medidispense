'use client'

import { useEffect, useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { Loader2, Server, ScanLine, X, CheckCircle2 } from 'lucide-react'
import type { DispenseLog } from '@/lib/dispenser-store'

export function DispenseModal({
  log,
  onClose,
}: {
  log: DispenseLog
  onClose: () => void
}) {
  const [phase, setPhase] = useState<'generating' | 'ready'>('generating')

  useEffect(() => {
    const t = setTimeout(() => setPhase('ready'), 1600)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  const payload = JSON.stringify({
    token: log.token,
    patient: log.patientId,
    items: log.medicines,
    ts: log.timestamp,
    sig: 'MEDIDISPENSE-SECURE',
  })

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Dispense authorization"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border bg-secondary px-5 py-4">
          <div className="flex items-center gap-2">
            <Server className="size-4.5 text-primary" />
            <p className="text-sm font-semibold text-secondary-foreground">
              Secure Backend Authorization
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-1 text-muted-foreground transition hover:bg-background hover:text-foreground"
          >
            <X className="size-4.5" />
          </button>
        </div>

        {phase === 'generating' ? (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <Loader2 className="size-10 animate-spin text-primary" />
            <p className="mt-4 text-sm font-medium text-foreground">
              Server generating secure token…
            </p>
            <p className="mt-1 text-xs text-muted-foreground text-pretty">
              Encrypting prescription payload and signing token
            </p>
          </div>
        ) : (
          <div className="px-6 py-6 text-center">
            <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold text-accent-foreground">
              <CheckCircle2 className="size-3.5 text-accent" />
              <span className="text-accent">Token Generated</span>
            </div>

            <div className="mx-auto flex w-fit items-center justify-center rounded-2xl border border-border bg-background p-4 shadow-sm">
              <QRCodeSVG
                value={payload}
                size={190}
                level="H"
                fgColor="#1a5a8a"
                bgColor="transparent"
              />
            </div>

            <p className="mt-4 font-mono text-lg font-bold tracking-wider text-primary">
              {log.token}
            </p>

            <div className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-primary/10 px-4 py-3">
              <ScanLine className="size-4.5 shrink-0 text-primary" />
              <p className="text-sm font-medium text-foreground text-pretty">
                Scan this QR Code at the Vending Machine to Dispense instantly
              </p>
            </div>

            <div className="mt-4 rounded-lg border border-border bg-secondary/60 p-3 text-left">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                Authorized Items
              </p>
              <ul className="space-y-1">
                {log.medicines.map((m) => (
                  <li
                    key={m.name}
                    className="flex items-center justify-between text-sm text-foreground"
                  >
                    <span>{m.name}</span>
                    <span className="font-mono font-semibold text-primary">
                      x{m.qty}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="mt-5 w-full rounded-lg border border-border bg-background py-2.5 text-sm font-medium text-foreground transition hover:bg-secondary"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
