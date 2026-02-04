import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export function DashboardPage() {
  const { user, profile, signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Dashboard</CardTitle>
          <CardDescription>
            Welcome back! You are signed in.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2 text-sm">
            <p>
              <span className="text-muted-foreground">Email:</span>{' '}
              {user?.email}
            </p>
            <p>
              <span className="text-muted-foreground">User ID:</span>{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">
                {user?.id.slice(0, 8)}...
              </code>
            </p>
            {profile && (
              <>
                <p>
                  <span className="text-muted-foreground">Name:</span>{' '}
                  {profile.first_name || 'Not set'} {profile.last_name || ''}
                </p>
                <p>
                  <span className="text-muted-foreground">Role:</span>{' '}
                  <span className="capitalize">{profile.role || 'Not set'}</span>
                </p>
              </>
            )}
          </div>
          <Button onClick={handleSignOut} variant="outline" className="w-full">
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
