import { Link } from 'react-router-dom'
import {
  Heart,
  Send,
  MessageCircle,
  Music,
  MapPin,
  Sparkles,
  AlertCircle,
} from 'lucide-react'
import {
  useCurrentProfile,
  useFavorites,
  useSentEnquiries,
  useUnreadCount,
} from '@/hooks'
import { isAbortError } from '@/lib/errors'
import { formatDate } from '@/lib/format'
import { PageHeader } from '@/components/ui/page-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

function DashboardSkeleton() {
  return (
    <div data-testid="dashboard-loading" className="space-y-6">
      <div className="h-16 bg-muted animate-pulse rounded-lg" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-28 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
      <div className="flex items-center justify-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    </div>
  )
}

const quickActions = [
  {
    id: 'artists',
    icon: Music,
    label: 'Discover Artists',
    description: 'Find your next favorite artist',
    link: '/artists',
  },
  {
    id: 'venues',
    icon: MapPin,
    label: 'Discover Venues',
    description: 'Explore nightlife spots',
    link: '/venues',
  },
  {
    id: 'favorites',
    icon: Heart,
    label: 'My Favorites',
    description: 'Your saved artists & venues',
    link: '/favorites',
  },
  {
    id: 'enquiries',
    icon: Send,
    label: 'My Enquiries',
    description: 'Track your messages',
    link: '/enquiries',
  },
]

export function DashboardPage() {
  const {
    data: profile,
    isLoading: profileLoading,
    isError,
    error,
  } = useCurrentProfile()
  const { data: favorites } = useFavorites()
  const { data: sentEnquiries } = useSentEnquiries()
  const { data: unreadCount } = useUnreadCount()

  if (profileLoading) {
    return <DashboardSkeleton />
  }

  if (isError && !isAbortError(error)) {
    return (
      <div data-testid="dashboard" className="space-y-6">
        <PageHeader title="Dashboard" description="Welcome back" />
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Failed to load profile</AlertTitle>
          <AlertDescription>
            {error?.message ?? 'Please try again'}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  const displayName =
    profile?.display_name || profile?.first_name || 'there'
  const favoritesCount = favorites?.data?.length ?? 0
  const enquiriesCount = sentEnquiries?.length ?? 0
  const messagesCount = unreadCount ?? 0

  const recentFavorites = (favorites?.data ?? []).slice(0, 3)
  const recentEnquiries = (sentEnquiries ?? []).slice(0, 3)

  return (
    <div data-testid="dashboard" className="space-y-6">
      <PageHeader
        title="Dashboard"
        description={`Welcome back, ${displayName}`}
      />

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link to="/favorites" data-testid="stat-favorites">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50">
                <Heart className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{favoritesCount}</p>
                <p className="text-sm text-muted-foreground">Favorites</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link to="/enquiries" data-testid="stat-enquiries">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-50">
                <Send className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{enquiriesCount}</p>
                <p className="text-sm text-muted-foreground">Enquiries Sent</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link to="/messages" data-testid="stat-messages">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-50">
                <MessageCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{messagesCount}</p>
                <p className="text-sm text-muted-foreground">Messages</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Explore</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map(({ id, icon: Icon, label, description, link }) => (
            <Link key={id} to={link} data-testid={`action-${id}`}>
              <Card className="hover:shadow-md transition-shadow h-full">
                <CardContent className="flex flex-col items-center text-center gap-2 p-6">
                  <Icon className="h-6 w-6 text-primary" />
                  <p className="font-medium text-sm">{label}</p>
                  <p className="text-xs text-muted-foreground">{description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Recent Activity</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Recent Favorites */}
          <Card data-testid="recent-favorites">
            <CardHeader>
              <CardTitle className="text-base">Recent Favorites</CardTitle>
            </CardHeader>
            <CardContent>
              {recentFavorites.length > 0 ? (
                <div className="space-y-3">
                  {recentFavorites.map((fav) => {
                    const name =
                      fav.artists?.stage_name ??
                      fav.venues?.venue_name ??
                      'Unknown'
                    const type =
                      fav.favorite_type === 'ARTIST' ? 'Artist' : 'Venue'
                    return (
                      <div
                        key={fav.id}
                        className="flex items-center justify-between gap-2"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-sm truncate">{name}</span>
                          <Badge variant="secondary" className="shrink-0">
                            {type}
                          </Badge>
                        </div>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {formatDate(fav.created_at)}
                        </span>
                      </div>
                    )
                  })}
                  <Link
                    to="/favorites"
                    className="text-sm text-primary hover:underline block mt-2"
                  >
                    View all
                  </Link>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  <p>No favorites yet.</p>
                  <Link
                    to="/artists"
                    className="text-primary hover:underline mt-1 inline-block"
                  >
                    Discover artists
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Enquiries */}
          <Card data-testid="recent-enquiries">
            <CardHeader>
              <CardTitle className="text-base">Recent Enquiries</CardTitle>
            </CardHeader>
            <CardContent>
              {recentEnquiries.length > 0 ? (
                <div className="space-y-3">
                  {recentEnquiries.map((enq) => {
                    const name =
                      enq.artists?.stage_name ??
                      enq.venues?.venue_name ??
                      'Unknown'
                    return (
                      <div
                        key={enq.id}
                        className="flex items-center justify-between gap-2"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-sm truncate">{name}</span>
                          <Badge variant="outline" className="shrink-0">
                            {enq.status}
                          </Badge>
                        </div>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {formatDate(enq.created_at)}
                        </span>
                      </div>
                    )
                  })}
                  <Link
                    to="/enquiries"
                    className="text-sm text-primary hover:underline block mt-2"
                  >
                    View all
                  </Link>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  <p>No enquiries yet.</p>
                  <Link
                    to="/artists"
                    className="text-primary hover:underline mt-1 inline-block"
                  >
                    Discover artists
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Getting Started — conditional */}
      {favoritesCount === 0 && enquiriesCount === 0 && (
        <Card data-testid="getting-started" className="border-dashed">
          <CardContent className="flex flex-col items-center text-center gap-4 py-10">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <Sparkles className="h-7 w-7 text-primary" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-semibold">
                Get Started with bloghead
              </h3>
              <p className="text-sm text-muted-foreground max-w-md">
                Discover amazing artists and venues in your area. Save your
                favorites and send enquiries to book your next experience.
              </p>
            </div>
            <div className="flex gap-3">
              <Button asChild>
                <Link to="/artists">Browse Artists</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/venues">Browse Venues</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
