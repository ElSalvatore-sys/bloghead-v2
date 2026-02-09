import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Calendar,
  Music,
  MapPin,
  Heart,
  Mail,
  CalendarCheck,
  MessageSquare,
  Settings,
  HelpCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/stores'
import { useUnreadCount } from '@/hooks/queries'
import { Badge } from '@/components/ui/badge'
import {
  Sheet,
  SheetContent,
} from '@/components/ui/sheet'

const navItems = [
  { name: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { name: 'events', label: 'Events', icon: Calendar, href: '/events' },
  { name: 'artists', label: 'Artists', icon: Music, href: '/artists' },
  { name: 'venues', label: 'Venues', icon: MapPin, href: '/venues' },
  { name: 'favorites', label: 'Favorites', icon: Heart, href: '/favorites' },
  { name: 'enquiries', label: 'Enquiries', icon: Mail, href: '/enquiries' },
  { name: 'bookings', label: 'Bookings', icon: CalendarCheck, href: '/bookings' },
  { name: 'messages', label: 'Messages', icon: MessageSquare, href: '/messages' },
  { name: 'settings', label: 'Settings', icon: Settings, href: '/settings' },
]

function SidebarContent() {
  const location = useLocation()
  const setSidebarOpen = useUIStore((s) => s.setSidebarOpen)
  const { data: unreadCount } = useUnreadCount()

  return (
    <div className="flex flex-col h-full" data-testid="sidebar">
      <nav className="flex-1 space-y-1 p-4" data-testid="sidebar-nav">
        {navItems.map(({ name, label, icon: Icon, href }) => {
          const isActive = location.pathname === href

          return (
            <Link
              key={name}
              to={href}
              onClick={() => setSidebarOpen(false)}
              data-testid={`sidebar-link-${name}`}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary/10 text-primary border-l-2 border-primary'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
              {name === 'messages' && (unreadCount ?? 0) > 0 && (
                <Badge variant="default" className="ml-auto h-5 min-w-5 px-1 text-xs">
                  {(unreadCount ?? 0) > 99 ? '99+' : unreadCount}
                </Badge>
              )}
            </Link>
          )
        })}
      </nav>

      <div className="border-t p-4">
        <Link
          to="/help"
          onClick={() => setSidebarOpen(false)}
          className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <HelpCircle className="h-4 w-4" />
          Help & Support
        </Link>
      </div>
    </div>
  )
}

export function Sidebar() {
  const sidebarOpen = useUIStore((s) => s.sidebarOpen)
  const setSidebarOpen = useUIStore((s) => s.setSidebarOpen)

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 md:top-14 border-r bg-background">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar (Sheet) */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  )
}
