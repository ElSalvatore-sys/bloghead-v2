import { useEffect } from 'react'
import { CalendarIcon, Loader2 } from 'lucide-react'
import { format } from 'date-fns'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/stores'
import { useAuth } from '@/context/AuthContext'
import { useArtistByProfile, useVenueByProfile, useCreateBooking } from '@/hooks/queries'
import { useZodForm } from '@/lib/forms/use-zod-form'
import { createBookingRequestSchema, type CreateBookingRequestInput } from '@/lib/validations'
import { Link } from 'react-router-dom'

export function BookingRequestModal() {
  const activeModal = useUIStore((s) => s.activeModal)
  const modalData = useUIStore((s) => s.modalData)
  const closeModal = useUIStore((s) => s.closeModal)
  const { profile } = useAuth()

  const isOpen = activeModal === 'booking-request'

  const entityType = modalData?.entityType as 'artist' | 'venue' | undefined
  const targetArtistId = modalData?.artistId as string | undefined
  const targetVenueId = modalData?.venueId as string | undefined
  const targetName = (modalData?.artistName ?? modalData?.venueName) as string | undefined

  // Auto-fill the user's own artist/venue
  const { data: userArtist } = useArtistByProfile(profile?.id ?? '', {
    enabled: isOpen && profile?.role === 'ARTIST',
  })
  const { data: userVenue } = useVenueByProfile(profile?.id ?? '', {
    enabled: isOpen && profile?.role === 'VENUE',
  })

  const createBooking = useCreateBooking()

  const form = useZodForm(createBookingRequestSchema, {
    defaultValues: {
      title: '',
      event_date: '',
      start_time: '',
      end_time: '',
      description: '',
      proposed_rate: undefined,
    },
  })

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      form.reset()
    }
  }, [isOpen, form])

  const onSubmit = (data: CreateBookingRequestInput) => {
    // Determine artist_id and venue_id based on context
    let artistId: string | undefined
    let venueId: string | undefined

    if (entityType === 'artist') {
      // Viewing an artist → artist is the target, venue is the user's
      artistId = targetArtistId
      venueId = targetVenueId ?? userVenue?.id
    } else {
      // Viewing a venue → venue is the target, artist is the user's
      venueId = targetVenueId
      artistId = targetArtistId ?? userArtist?.id
    }

    if (!artistId || !venueId) return

    createBooking.mutate(
      { input: data, artistId, venueId },
      {
        onSuccess: () => {
          closeModal()
        },
      }
    )
  }

  const isUserRole = profile?.role === 'USER'

  // Determine if we have both IDs
  const resolvedArtistId = entityType === 'artist' ? targetArtistId : (targetArtistId ?? userArtist?.id)
  const resolvedVenueId = entityType === 'venue' ? targetVenueId : (targetVenueId ?? userVenue?.id)
  const canSubmit = !!resolvedArtistId && !!resolvedVenueId

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeModal()}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto" data-testid="booking-request-modal">
        <DialogHeader>
          <DialogTitle>Send Booking Request</DialogTitle>
          {targetName && (
            <DialogDescription>
              Request to book {targetName}
            </DialogDescription>
          )}
        </DialogHeader>

        {isUserRole ? (
          <div className="py-6 text-center space-y-3">
            <p className="text-muted-foreground">
              Register as an artist or venue to send booking requests.
            </p>
            <Button asChild variant="outline">
              <Link to="/settings" onClick={closeModal}>
                Go to Profile Settings
              </Link>
            </Button>
          </div>
        ) : !canSubmit ? (
          <div className="py-6 text-center space-y-3">
            <p className="text-muted-foreground">
              {profile?.role === 'VENUE'
                ? 'You need a venue profile to send booking requests.'
                : 'You need an artist profile to send booking requests.'}
            </p>
          </div>
        ) : (
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Event Title</Label>
              <Input
                id="title"
                placeholder="e.g., Summer DJ Night"
                disabled={createBooking.isPending}
                {...form.register('title')}
              />
              {form.formState.errors.title && (
                <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
              )}
            </div>

            {/* Event Date */}
            <div className="space-y-2">
              <Label>Event Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    disabled={createBooking.isPending}
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !form.watch('event_date') && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {form.watch('event_date')
                      ? format(new Date(form.watch('event_date') + 'T00:00:00'), 'PPP')
                      : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={
                      form.watch('event_date')
                        ? new Date(form.watch('event_date') + 'T00:00:00')
                        : undefined
                    }
                    onSelect={(date) => {
                      if (date) {
                        const yyyy = date.getFullYear()
                        const mm = String(date.getMonth() + 1).padStart(2, '0')
                        const dd = String(date.getDate()).padStart(2, '0')
                        form.setValue('event_date', `${yyyy}-${mm}-${dd}`, {
                          shouldValidate: true,
                        })
                      }
                    }}
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
              {form.formState.errors.event_date && (
                <p className="text-sm text-destructive">{form.formState.errors.event_date.message}</p>
              )}
            </div>

            {/* Time fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_time">Start Time</Label>
                <Input
                  id="start_time"
                  type="time"
                  disabled={createBooking.isPending}
                  {...form.register('start_time')}
                />
                {form.formState.errors.start_time && (
                  <p className="text-sm text-destructive">{form.formState.errors.start_time.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="end_time">End Time</Label>
                <Input
                  id="end_time"
                  type="time"
                  disabled={createBooking.isPending}
                  {...form.register('end_time')}
                />
                {form.formState.errors.end_time && (
                  <p className="text-sm text-destructive">{form.formState.errors.end_time.message}</p>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                placeholder="Tell them about your event..."
                rows={3}
                disabled={createBooking.isPending}
                {...form.register('description')}
              />
              {form.formState.errors.description && (
                <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>
              )}
            </div>

            {/* Proposed Rate */}
            <div className="space-y-2">
              <Label htmlFor="proposed_rate">Proposed Rate (optional)</Label>
              <Input
                id="proposed_rate"
                type="number"
                min={0}
                placeholder="e.g., 500"
                disabled={createBooking.isPending}
                {...form.register('proposed_rate', { valueAsNumber: true })}
              />
              {form.formState.errors.proposed_rate && (
                <p className="text-sm text-destructive">{form.formState.errors.proposed_rate.message}</p>
              )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full"
              disabled={createBooking.isPending}
              data-testid="booking-submit"
            >
              {createBooking.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                'Send Booking Request'
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
