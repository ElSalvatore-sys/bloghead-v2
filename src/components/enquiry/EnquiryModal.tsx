import { useEffect } from 'react'
import { Loader2 } from 'lucide-react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAuth } from '@/context/AuthContext'
import { useCreateEnquiry } from '@/hooks/queries'
import { useZodForm } from '@/lib/forms/use-zod-form'
import { createEnquirySchema, type CreateEnquiryInput } from '@/lib/validations'

interface EnquiryModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  entityType: 'ARTIST' | 'VENUE'
  entityId: string
  entityName: string
}

const ENQUIRY_TYPE_LABELS = {
  BOOKING: 'Booking Request',
  PRICING: 'Pricing Info',
  AVAILABILITY: 'Availability Check',
  GENERAL: 'General Question',
} as const

export function EnquiryModal({
  open,
  onOpenChange,
  entityType,
  entityId,
  entityName,
}: EnquiryModalProps) {
  const { profile, user } = useAuth()
  const createEnquiry = useCreateEnquiry()

  const displayName = [profile?.first_name, profile?.last_name]
    .filter(Boolean)
    .join(' ')

  const form = useZodForm(createEnquirySchema, {
    defaultValues: {
      entity_type: entityType,
      artist_id: entityType === 'ARTIST' ? entityId : undefined,
      venue_id: entityType === 'VENUE' ? entityId : undefined,
      enquiry_type: 'GENERAL',
      name: displayName || '',
      email: user?.email || '',
      phone: '',
      message: '',
      event_date: undefined,
    },
  })

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      form.reset({
        entity_type: entityType,
        artist_id: entityType === 'ARTIST' ? entityId : undefined,
        venue_id: entityType === 'VENUE' ? entityId : undefined,
        enquiry_type: 'GENERAL',
        name: displayName || '',
        email: user?.email || '',
        phone: '',
        message: '',
        event_date: undefined,
      })
    }
  }, [open, entityType, entityId, displayName, user?.email, form])

  const onSubmit = (data: CreateEnquiryInput) => {
    createEnquiry.mutate(data, {
      onSuccess: () => {
        onOpenChange(false)
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto"
        data-testid="enquiry-modal"
      >
        <DialogHeader>
          <DialogTitle>Send Enquiry</DialogTitle>
          <DialogDescription>
            Contact {entityName} with your question or request
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Enquiry Type */}
          <div className="space-y-2">
            <Label htmlFor="enquiry_type">What is this about?</Label>
            <Select
              value={form.watch('enquiry_type')}
              onValueChange={(value) =>
                form.setValue('enquiry_type', value as CreateEnquiryInput['enquiry_type'], {
                  shouldValidate: true,
                })
              }
              disabled={createEnquiry.isPending}
            >
              <SelectTrigger id="enquiry_type" data-testid="enquiry-type-select">
                <SelectValue placeholder="Select enquiry type" />
              </SelectTrigger>
              <SelectContent>
                {(Object.entries(ENQUIRY_TYPE_LABELS) as [string, string][]).map(
                  ([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="enquiry-name">Name</Label>
            <Input
              id="enquiry-name"
              placeholder="Your name"
              disabled={createEnquiry.isPending}
              {...form.register('name')}
            />
            {form.formState.errors.name && (
              <p className="text-sm text-destructive">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="enquiry-email">Email</Label>
            <Input
              id="enquiry-email"
              type="email"
              placeholder="your@email.com"
              disabled={createEnquiry.isPending}
              {...form.register('email')}
            />
            {form.formState.errors.email && (
              <p className="text-sm text-destructive">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="enquiry-phone">Phone (optional)</Label>
            <Input
              id="enquiry-phone"
              type="tel"
              placeholder="+49 ..."
              disabled={createEnquiry.isPending}
              {...form.register('phone')}
            />
          </div>

          {/* Event Date */}
          <div className="space-y-2">
            <Label htmlFor="enquiry-event-date">Event Date (optional)</Label>
            <Input
              id="enquiry-event-date"
              type="date"
              disabled={createEnquiry.isPending}
              {...form.register('event_date')}
            />
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="enquiry-message">Message</Label>
            <Textarea
              id="enquiry-message"
              placeholder="Tell them what you're looking for..."
              rows={4}
              disabled={createEnquiry.isPending}
              {...form.register('message')}
            />
            {form.formState.errors.message && (
              <p className="text-sm text-destructive">
                {form.formState.errors.message.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <Button
            type="submit"
            className="w-full"
            disabled={createEnquiry.isPending}
            data-testid="enquiry-submit"
          >
            {createEnquiry.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              'Send Enquiry'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
