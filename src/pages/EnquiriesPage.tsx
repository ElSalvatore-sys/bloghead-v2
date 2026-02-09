import { useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Mail, Inbox } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/AuthContext'
import {
  useSentEnquiries,
  useReceivedEnquiries,
} from '@/hooks/queries/use-enquiries'
import type { EnquiryWithDetails } from '@/services'

function formatRelativeDate(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 30) return `${days}d ago`
  return new Date(dateStr).toLocaleDateString()
}

const ENQUIRY_TYPE_STYLES: Record<string, { className: string; label: string }> = {
  BOOKING: { className: 'border-blue-200 text-blue-700', label: 'Booking' },
  PRICING: { className: 'border-green-200 text-green-700', label: 'Pricing' },
  AVAILABILITY: { className: 'border-amber-200 text-amber-700', label: 'Availability' },
  GENERAL: { className: '', label: 'General' },
}

const STATUS_STYLES: Record<string, { className: string; label: string }> = {
  PENDING: { className: 'bg-amber-100 text-amber-800', label: 'Pending' },
  READ: { className: 'bg-blue-100 text-blue-800', label: 'Read' },
  RESPONDED: { className: 'bg-green-100 text-green-800', label: 'Responded' },
  ARCHIVED: { className: 'bg-gray-100 text-gray-800', label: 'Archived' },
}

export function EnquiriesPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { profile } = useAuth()
  const tab = searchParams.get('tab') ?? 'sent'
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const sent = useSentEnquiries()
  const received = useReceivedEnquiries()

  const isProvider = profile?.role === 'ARTIST' || profile?.role === 'VENUE'

  function renderEnquiryCard(enquiry: EnquiryWithDetails) {
    const entityName = enquiry.artists?.stage_name || enquiry.venues?.venue_name || 'Unknown'
    const typeStyle = ENQUIRY_TYPE_STYLES[enquiry.enquiry_type] ?? ENQUIRY_TYPE_STYLES.GENERAL
    const statusStyle = STATUS_STYLES[enquiry.status] ?? STATUS_STYLES.PENDING
    const isExpanded = expandedId === enquiry.id
    const preview = enquiry.message.length > 100
      ? enquiry.message.slice(0, 100) + '...'
      : enquiry.message

    return (
      <div
        key={enquiry.id}
        className="flex items-start gap-4 rounded-lg border p-4 cursor-pointer hover:bg-accent/50 transition-colors"
        onClick={() => setExpandedId(isExpanded ? null : enquiry.id)}
        data-testid="enquiry-card"
      >
        <Mail className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium">{entityName}</span>
            <Badge variant="outline" className={typeStyle.className}>
              {typeStyle.label}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">{preview}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {formatRelativeDate(enquiry.created_at)}
          </p>

          {isExpanded && (
            <div className="mt-3 space-y-2 border-t pt-3 text-sm">
              <p>{enquiry.message}</p>
              {enquiry.event_date && (
                <p className="text-muted-foreground">
                  Event date: {enquiry.event_date}
                </p>
              )}
              {enquiry.phone && (
                <p className="text-muted-foreground">
                  Phone: {enquiry.phone}
                </p>
              )}
              {enquiry.email && (
                <p className="text-muted-foreground">
                  Email: {enquiry.email}
                </p>
              )}
            </div>
          )}
        </div>

        <Badge className={statusStyle.className}>
          {statusStyle.label}
        </Badge>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Mail className="h-8 w-8 text-blue-500" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Enquiries</h1>
          <p className="text-muted-foreground">
            Track your messages to artists and venues
          </p>
        </div>
      </div>

      <Tabs
        value={tab}
        onValueChange={(value) => setSearchParams({ tab: value })}
      >
        <TabsList>
          <TabsTrigger value="sent">
            Sent{sent.data ? ` (${sent.data.length})` : ''}
          </TabsTrigger>
          {isProvider && (
            <TabsTrigger value="received">
              Received{received.data ? ` (${received.data.length})` : ''}
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="sent" className="mt-6">
          {sent.isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-[100px]" />
              ))}
            </div>
          ) : sent.data?.length ? (
            <div className="space-y-4">
              {sent.data.map((enquiry) => renderEnquiryCard(enquiry))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Mail className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold">
                No enquiries sent yet
              </h3>
              <p className="text-muted-foreground mt-1 mb-4">
                Browse artists and venues to get started
              </p>
              <Button asChild>
                <Link to="/artists">Discover Artists</Link>
              </Button>
            </div>
          )}
        </TabsContent>

        {isProvider && (
          <TabsContent value="received" className="mt-6">
            {received.isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-[100px]" />
                ))}
              </div>
            ) : received.data?.length ? (
              <div className="space-y-4">
                {received.data.map((enquiry) => renderEnquiryCard(enquiry))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Inbox className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-semibold">
                  No enquiries received yet
                </h3>
                <p className="text-muted-foreground mt-1 mb-4">
                  Enquiries from fans will appear here
                </p>
              </div>
            )}
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}

export default EnquiriesPage
