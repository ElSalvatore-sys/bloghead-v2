import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { LoginForm } from './LoginForm'
import { RegisterForm } from './RegisterForm'
import { useAuthModal } from '@/context/AuthModalContext'

export function AuthModal() {
  const { isOpen, mode, closeModal, switchMode } = useAuthModal()

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="sm:max-w-[600px] bg-[#1a1a2e] border-none shadow-2xl backdrop-blur-sm">
        {/* Visually hidden but accessible titles */}
        <DialogTitle className="sr-only">
          {mode === 'login' ? 'Anmelden' : 'Registrieren'}
        </DialogTitle>
        <DialogDescription className="sr-only">
          {mode === 'login'
            ? 'Melde dich bei deinem Bloghead-Konto an'
            : 'Erstelle ein neues Bloghead-Konto'}
        </DialogDescription>

        {mode === 'login' ? (
          <LoginForm onSwitchToRegister={() => switchMode('register')} />
        ) : (
          <RegisterForm onSwitchToLogin={() => switchMode('login')} />
        )}
      </DialogContent>
    </Dialog>
  )
}
