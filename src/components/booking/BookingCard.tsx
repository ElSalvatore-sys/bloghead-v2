import { useState } from 'react'
import { Calendar, MapPin, Music } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { BookingStatusBadge } from './BookingStatusBadge'
import { useUpdateBookingStatus } from '@/hooks/queries'
import type { BookingWithDetails } from '@/services'

interface BookingCardProps {
  booking: BookingWithDetails
  viewType: 'fan' | 'provider'
}

export function BookingCard({ booking, viewType }: BookingCardProps) {
  const updateStatus = useUpdateBookingStatus()
  const [declineOpen, setDeclineOpen] = useState(false)

  const isPending = booking.status === 'PENDING'
  const counterparty =
    viewType === 'fan'
      ? booking.artists?.stage_name ?? booking.venues?.venue_name ?? 'Unknown'
      : `${booking.requester?.first_name ?? ''} ${booking.requester?.last_name ?? ''}`.trim() || 'Unknown'

  const descriptionPreview = booking.description
    ? booking.description.length > 120
      ? `${booking.description.slice(0, 120)}...`
      : booking.description
    : null

  return (
    <Card data-testid={`booking-card-${booking.id}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base leading-snug">{booking.title}</CardTitle>
          <BookingStatusBadge status={booking.status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Counterparty */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {viewType === 'fan' ? (
            <>
              {booking.artists ? (
                <Music className="h-4 w-4" />
              ) : (
                <MapPin className="h-4 w-4" />
              )}
              <span>{counterparty}</span>
            </>
          ) : (
            <span>From: {counterparty}</span>
          )}
        </div>

        {/* Date & time */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{booking.event_date}</span>
          <span className="text-xs">
            {booking.start_time} - {booking.end_time}
          </span>
        </div>

        {/* Proposed rate */}
        {booking.proposed_rate !== null && (
          <p className="text-sm">
            <span className="text-muted-foreground">Proposed rate:</span>{' '}
            <span className="font-medium">${booking.proposed_rate}</span>
          </p>
        )}

        {/* Description preview */}
        {descriptionPreview && (
          <p className="text-sm text-muted-foreground">{descriptionPreview}</p>
        )}

        {/* Actions */}
        {isPending && (
          <div className="flex gap-2 pt-1">
            {viewType === 'fan' ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  updateStatus.mutate({ id: booking.id, status: 'CANCELLED' })
                }
                disabled={updateStatus.isPending}
              >
                Cancel Request
              </Button>
            ) : (
              <>
                <Button
                  size="sm"
                  onClick={() =>
                    updateStatus.mutate({ id: booking.id, status: 'ACCEPTED' })
                  }
                  disabled={updateStatus.isPending}
                  data-testid="booking-accept"
                >
                  Accept
                </Button>
                <AlertDialog open={declineOpen} onOpenChange={setDeclineOpen}>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={updateStatus.isPending}
                      data-testid="booking-decline"
                    >
                      Decline
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Decline booking request?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to decline the booking request &quot;{booking.title}&quot;?
                        This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => {
                          updateStatus.mutate({
                            id: booking.id,
                            status: 'DECLINED',
                            note: 'Declined by provider',
                          })
                          setDeclineOpen(false)
                        }}
                      >
                        Decline
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
