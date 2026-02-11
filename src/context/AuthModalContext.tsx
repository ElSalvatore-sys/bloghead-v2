import { createContext, useContext, useState, ReactNode } from 'react'

type AuthModalMode = 'login' | 'register'

interface AuthModalContextType {
  isOpen: boolean
  mode: AuthModalMode
  openModal: (mode: AuthModalMode) => void
  closeModal: () => void
  switchMode: (mode: AuthModalMode) => void
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined)

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [mode, setMode] = useState<AuthModalMode>('login')

  return (
    <AuthModalContext.Provider
      value={{
        isOpen,
        mode,
        openModal: (m) => {
          setMode(m)
          setIsOpen(true)
        },
        closeModal: () => setIsOpen(false),
        switchMode: setMode,
      }}
    >
      {children}
    </AuthModalContext.Provider>
  )
}

export const useAuthModal = () => {
  const context = useContext(AuthModalContext)
  if (!context) throw new Error('useAuthModal must be used within AuthModalProvider')
  return context
}
