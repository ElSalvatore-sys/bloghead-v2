import { Dialog, DialogContent } from '@/components/ui/dialog'
import { LoginForm } from './LoginForm'
import { RegisterForm } from './RegisterForm'
import { useAuthModal } from '@/context/AuthModalContext'

export function AuthModal() {
  const { isOpen, mode, closeModal, switchMode } = useAuthModal()

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeModal()}>
      <DialogContent className="sm:max-w-[500px] bg-[#232323] border-none">
        {mode === 'login' ? (
          <LoginForm onSwitchToRegister={() => switchMode('register')} />
        ) : (
          <RegisterForm onSwitchToLogin={() => switchMode('login')} />
        )}
      </DialogContent>
    </Dialog>
  )
}
