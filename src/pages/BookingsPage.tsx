import { useEffect } from 'react'
import { CalendarCheck, Inbox, Send } from 'lucide-react'
import { PageHeader } from '@/components/ui/page-header'
import { EmptyState } from '@/components/ui/empty-state'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BookingCard } from '@/components/booking'
import { useAuth } from '@/context/AuthContext'
import { useUserBookings, useProviderBookings } from '@/hooks/queries'

function BookingSkeletonList() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="rounded-lg border p-4 space-y-3">
          <div className="flex justify-between">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-5 w-20" />
          </div>
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-64" />
        </div>
      ))}
    </div>
  )
}

export function BookingsPage() {
  const { profile } = useAuth()
  const {
    data: sentBookings,
    isLoading: sentLoading,
  } = useUserBookings()
  const {
    data: receivedBookings,
    isLoading: receivedLoading,
  } = useProviderBookings()

  useEffect(() => {
    document.title = 'Bookings | Bloghead'
    return () => {
      document.title = 'Bloghead'
    }
  }, [])

  const isProvider = profile?.role === 'ARTIST' || profile?.role === 'VENUE'
  const hasSent = (sentBookings?.length ?? 0) > 0
  const hasReceived = (receivedBookings?.length ?? 0) > 0
  const showTabs = isProvider && (hasSent || hasReceived)

  return (
    <div className="space-y-6" data-testid="bookings-page">
      <PageHeader
        title="Bookings"
        description="Manage your booking requests"
      />

      {showTabs ? (
        <Tabs defaultValue={hasReceived ? 'received' : 'sent'}>
          <TabsList>
            <TabsTrigger value="received">
              Incoming Requests
              {hasReceived && (
                <span className="ml-1.5 text-xs text-muted-foreground">
                  ({receivedBookings!.length})
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="sent">
              My Requests
              {hasSent && (
                <span className="ml-1.5 text-xs text-muted-foreground">
                  ({sentBookings!.length})
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="received">
            {receivedLoading ? (
              <BookingSkeletonList />
            ) : !hasReceived ? (
              <EmptyState
                icon={Inbox}
                title="No incoming requests"
                description="When someone sends you a booking request, it will appear here."
              />
            ) : (
              <div className="space-y-4">
                {receivedBookings!.map((booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    viewType="provider"
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="sent">
            {sentLoading ? (
              <BookingSkeletonList />
            ) : !hasSent ? (
              <EmptyState
                icon={Send}
                title="No booking requests sent"
                description="Visit an artist or venue page to send a booking request."
              />
            ) : (
              <div className="space-y-4">
                {sentBookings!.map((booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    viewType="fan"
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      ) : (
        <>
          {sentLoading ? (
            <BookingSkeletonList />
          ) : !hasSent ? (
            <EmptyState
              icon={CalendarCheck}
              title="No bookings yet"
              description="Visit an artist or venue page to send your first booking request."
            />
          ) : (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">My Booking Requests</h2>
              {sentBookings!.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  viewType="fan"
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default BookingsPage
