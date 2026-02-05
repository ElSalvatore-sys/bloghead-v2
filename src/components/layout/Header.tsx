import { Link } from 'react-router-dom'
import { Menu, LogOut, Settings } from 'lucide-react'
import { useAuth } from '@/hooks'
import { useUIStore } from '@/stores'
import { ThemeToggle } from '@/components/theme/ThemeToggle'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const roleBadgeClasses: Record<string, string> = {
  ARTIST: 'bg-brand text-brand-foreground',
  VENUE: 'bg-primary text-primary-foreground',
  USER: 'bg-secondary text-secondary-foreground',
  ADMIN: 'bg-destructive text-destructive-foreground',
}

function getInitials(firstName?: string | null, lastName?: string | null): string {
  const first = firstName?.charAt(0)?.toUpperCase() || ''
  const last = lastName?.charAt(0)?.toUpperCase() || ''
  return first + last || '?'
}

export function Header() {
  const { profile, user, signOut } = useAuth()
  const toggleSidebar = useUIStore((s) => s.toggleSidebar)

  const initials = getInitials(profile?.first_name, profile?.last_name)
  const displayName = [profile?.first_name, profile?.last_name].filter(Boolean).join(' ') || 'User'
  const role = profile?.role || 'USER'

  return (
    <header
      data-testid="header"
      className="sticky top-0 z-40 bg-background border-b"
    >
      <div className="flex h-14 items-center gap-4 px-4">
        {/* Left side */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={toggleSidebar}
          data-testid="header-hamburger"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle sidebar</span>
        </Button>

        <Link
          to="/dashboard"
          className="font-bold text-xl text-primary"
          data-testid="header-logo"
        >
          bloghead
        </Link>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-8 w-8 rounded-full"
                data-testid="header-user-menu"
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-2">
                  <p className="text-sm font-medium leading-none">{displayName}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                  <Badge className={roleBadgeClasses[role] || roleBadgeClasses.USER} variant="secondary">
                    {role}
                  </Badge>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={signOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
