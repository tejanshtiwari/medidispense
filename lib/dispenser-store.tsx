'use client'

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export type Medicine = {
  id: string
  name: string
  strength: string
  image: string
  stock: number
  slot: number
  motor: string
}

export type DispenseLog = {
  id: string
  timestamp: string
  patientId: string
  medicines: { name: string; qty: number }[]
  token: string
  status: 'Generated' | 'Scanned by Machine' | 'Dispensed Successfully'
}

export type Doctor = {
  regId: string
  name: string
  hospital: string
}

type DispenserState = {
  isLoggedIn: boolean
  doctor: Doctor | null
  medicines: Medicine[]
  logs: DispenseLog[]
  login: (regId: string) => void
  logout: () => void
  setStock: (id: string, stock: number) => void
  dispense: (patientId: string, cart: { id: string; qty: number }[]) => DispenseLog
  advanceLog: (id: string) => void
}

const DispenserContext = createContext<DispenserState | null>(null)

const INITIAL_MEDICINES: Medicine[] = [
  {
    id: 'paracetamol',
    name: 'Paracetamol',
    strength: '650mg',
    image: '/medicines/paracetamol.png',
    stock: 48,
    slot: 1,
    motor: 'Servo Motor 1',
  },
  {
    id: 'cetirizine',
    name: 'Cetirizine',
    strength: '10mg',
    image: '/medicines/cetirizine.png',
    stock: 32,
    slot: 2,
    motor: 'Servo Motor 2',
  },
  {
    id: 'cough-syrup',
    name: 'Cough Syrup',
    strength: '100ml',
    image: '/medicines/cough-syrup.png',
    stock: 14,
    slot: 3,
    motor: 'Servo Motor 3',
  },
  {
    id: 'amoxicillin',
    name: 'Amoxicillin',
    strength: '500mg',
    image: '/medicines/amoxicillin.png',
    stock: 21,
    slot: 4,
    motor: 'Servo Motor 4',
  },
]

const INITIAL_LOGS: DispenseLog[] = [
  {
    id: 'log-1001',
    timestamp: '2026-09-02 09:14:22',
    patientId: '+91 98••• ••210',
    medicines: [
      { name: 'Paracetamol 650mg', qty: 2 },
      { name: 'Cetirizine 10mg', qty: 1 },
    ],
    token: 'MDX-7F3A9C',
    status: 'Dispensed Successfully',
  },
  {
    id: 'log-1002',
    timestamp: '2026-09-02 10:02:47',
    patientId: 'ABHA ••••-4471',
    medicines: [{ name: 'Amoxicillin 500mg', qty: 1 }],
    token: 'MDX-1B8E42',
    status: 'Dispensed Successfully',
  },
  {
    id: 'log-1003',
    timestamp: '2026-09-02 11:31:05',
    patientId: '+91 90••• ••883',
    medicines: [{ name: 'Cough Syrup 100ml', qty: 1 }],
    token: 'MDX-9D2F17',
    status: 'Scanned by Machine',
  },
]

function generateToken() {
  const hex = Array.from({ length: 6 }, () =>
    '0123456789ABCDEF'[Math.floor(Math.random() * 16)],
  ).join('')
  return `MDX-${hex}`
}

export function DispenserProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [doctor, setDoctor] = useState<Doctor | null>(null)
  const [medicines, setMedicines] = useState<Medicine[]>(INITIAL_MEDICINES)
  const [logs, setLogs] = useState<DispenseLog[]>(INITIAL_LOGS)

  const login = useCallback((regId: string) => {
    setDoctor({
      regId: regId || 'MH-DOC-20481',
      name: 'Dr. A. Sharma',
      hospital: 'Govt. District General Hospital, Pune',
    })
    setIsLoggedIn(true)
  }, [])

  const logout = useCallback(() => {
    setIsLoggedIn(false)
    setDoctor(null)
  }, [])

  const setStock = useCallback((id: string, stock: number) => {
    setMedicines((prev) =>
      prev.map((m) => (m.id === id ? { ...m, stock: Math.max(0, stock) } : m)),
    )
  }, [])

  const dispense = useCallback(
    (patientId: string, cart: { id: string; qty: number }[]) => {
      const items = cart.filter((c) => c.qty > 0)
      const token = generateToken()

      setMedicines((prev) =>
        prev.map((m) => {
          const line = items.find((i) => i.id === m.id)
          return line ? { ...m, stock: Math.max(0, m.stock - line.qty) } : m
        }),
      )

      const log: DispenseLog = {
        id: `log-${Date.now()}`,
        timestamp: new Date()
          .toLocaleString('en-CA', { hour12: false })
          .replace(',', ''),
        patientId: patientId || 'Unknown',
        medicines: items.map((i) => {
          const med = INITIAL_MEDICINES.find((m) => m.id === i.id)!
          return { name: `${med.name} ${med.strength}`, qty: i.qty }
        }),
        token,
        status: 'Generated',
      }

      setLogs((prev) => [log, ...prev])
      return log
    },
    [],
  )

  const advanceLog = useCallback((id: string) => {
    setLogs((prev) =>
      prev.map((l) => {
        if (l.id !== id) return l
        if (l.status === 'Generated')
          return { ...l, status: 'Scanned by Machine' }
        if (l.status === 'Scanned by Machine')
          return { ...l, status: 'Dispensed Successfully' }
        return l
      }),
    )
  }, [])

  const value = useMemo(
    () => ({
      isLoggedIn,
      doctor,
      medicines,
      logs,
      login,
      logout,
      setStock,
      dispense,
      advanceLog,
    }),
    [isLoggedIn, doctor, medicines, logs, login, logout, setStock, dispense, advanceLog],
  )

  return (
    <DispenserContext.Provider value={value}>
      {children}
    </DispenserContext.Provider>
  )
}

export function useDispenser() {
  const ctx = useContext(DispenserContext)
  if (!ctx) throw new Error('useDispenser must be used within DispenserProvider')
  return ctx
}
