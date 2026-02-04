import { Outlet } from 'react-router-dom'
import { Toaster } from 'sonner'
import { AuthProvider } from '@/context/AuthContext'
import { DevAuthPanel } from '@/components/dev/DevAuthPanel'

function App() {
  return (
    <AuthProvider>
      <Outlet />
      <Toaster position="bottom-left" />
      <DevAuthPanel />
    </AuthProvider>
  )
}

export default App
