import {
  Calendar,
  Music,
  MapPin,
  MessageSquare,
  Plus,
  TrendingUp,
} from 'lucide-react'
import { useAuth } from '@/hooks'
import { PageHeader } from '@/components/ui/page-header'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const stats = [
  {
    name: 'events',
    label: 'Total Events',
    value: '12',
    change: '+2 this week',
    icon: Calendar,
  },
  {
    name: 'artists',
    label: 'Active Artists',
    value: '48',
    change: '+5 this month',
    icon: Music,
  },
  {
    name: 'venues',
    label: 'Venues',
    value: '8',
    change: '2 pending approval',
    icon: MapPin,
  },
  {
    name: 'messages',
    label: 'Messages',
    value: '24',
    change: '3 unread',
    icon: MessageSquare,
  },
]

const recentActivity = [
  { text: 'New booking request from The Blue Note', time: '2 hours ago' },
  { text: 'DJ Shadow confirmed for Saturday event', time: '4 hours ago' },
  { text: 'Venue "The Loft" approved your listing', time: '6 hours ago' },
  { text: 'New message from Sarah Chen', time: '1 day ago' },
  { text: 'Event "Jazz Night" published successfully', time: '2 days ago' },
]

const quickActions = [
  { name: 'create-event', label: 'Create Event', icon: Plus },
  { name: 'browse-artists', label: 'Browse Artists', icon: Music },
  { name: 'find-venues', label: 'Find Venues', icon: MapPin },
]

export function DashboardPage() {
  const { profile } = useAuth()

  return (
    <div data-testid="dashboard" className="space-y-6">
      <PageHeader
        title="Dashboard"
        description={`Welcome back, ${profile?.first_name || 'there'}`}
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ name, label, value, change, icon: Icon }) => (
          <Card key={name} data-testid={`stat-card-${name}`}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {label}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{value}</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3" />
                {change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest updates and events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((item, i) => (
                <div key={i} className="flex items-start justify-between gap-4">
                  <p className="text-sm">{item.text}</p>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {item.time}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Get started with common tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {quickActions.map(({ name, label, icon: Icon }) => (
                <Button
                  key={name}
                  variant="outline"
                  className="justify-start h-auto py-3"
                  data-testid={`quick-action-${name}`}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
