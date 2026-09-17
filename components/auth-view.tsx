'use client'

import { useState } from 'react'
import { Lock, IdCard, ShieldCheck, Loader2, Stethoscope } from 'lucide-react'
import { useDispenser } from '@/lib/dispenser-store'

export function AuthView() {
  const { login } = useDispenser()
  const [regId, setRegId] = useState('')
  const [pin, setPin] = useState('')
  const [verifying, setVerifying] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setVerifying(true)
    setTimeout(() => {
      login(regId)
      setVerifying(false)
    }, 1400)
  }

  return (
    <div className="flex min-h-full items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <Stethoscope className="size-7" />
          </div>
          <h1 className="text-2xl font-bold text-balance text-foreground">
            Secure Doctor Authentication
          </h1>
          <p className="mt-1 text-sm text-muted-foreground text-pretty">
            Verify your medical credentials to authorize dispensing
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-border bg-card p-6 shadow-sm"
        >
          <div className="space-y-5">
            <div>
              <label
                htmlFor="regId"
                className="mb-1.5 block text-sm font-medium text-foreground"
              >
                Doctor Registration ID / Hospital License No.
              </label>
              <div className="relative">
                <IdCard className="pointer-events-none absolute left-3 top-1/2 size-4.5 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="regId"
                  type="text"
                  required
                  value={regId}
                  onChange={(e) => setRegId(e.target.value)}
                  placeholder="e.g. MH-DOC-20481"
                  className="w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-3 text-sm text-foreground outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="pin"
                className="mb-1.5 block text-sm font-medium text-foreground"
              >
                Secret Access PIN
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 size-4.5 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="pin"
                  type="password"
                  required
                  inputMode="numeric"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="••••••"
                  className="w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-3 text-sm tracking-widest text-foreground outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={verifying}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-95 disabled:opacity-70"
            >
              {verifying ? (
                <>
                  <Loader2 className="size-4.5 animate-spin" />
                  Verifying credentials…
                </>
              ) : (
                <>
                  <ShieldCheck className="size-4.5" />
                  Verify and Login
                </>
              )}
            </button>
          </div>

          <div className="mt-5 flex items-start gap-2 rounded-lg bg-secondary p-3">
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
            <p className="text-xs text-secondary-foreground text-pretty">
              Credentials are validated against the National Medical Register.
              This is a simulated login for hackathon demonstration — any values
              will authenticate.
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
