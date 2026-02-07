/**
 * Email Templates
 * Plain HTML templates for transactional emails
 */

const APP_URL = import.meta.env.VITE_APP_URL || 'https://blogyydev.xyz'

const BRAND_COLOR = '#7C3AED'
const BG_COLOR = '#09090B'
const TEXT_COLOR = '#E4E4E7'
const MUTED_COLOR = '#A1A1AA'

function layout(body: string, unsubscribeUrl: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
</head>
<body style="margin:0;padding:0;background:${BG_COLOR};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:${BG_COLOR};padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
          <!-- Header -->
          <tr>
            <td style="padding:0 0 24px 0;">
              <span style="font-size:24px;font-weight:700;color:${BRAND_COLOR};letter-spacing:-0.5px;">bloghead</span>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="background:#18181B;border-radius:12px;padding:32px;">
              ${body}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:24px 0 0 0;text-align:center;">
              <p style="font-size:12px;color:${MUTED_COLOR};margin:0;">
                <a href="${unsubscribeUrl}" style="color:${MUTED_COLOR};text-decoration:underline;">Manage notification preferences</a>
              </p>
              <p style="font-size:12px;color:${MUTED_COLOR};margin:8px 0 0 0;">
                bloghead &mdash; Connect artists and venues
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

function ctaButton(text: string, url: string): string {
  return `<a href="${url}" style="display:inline-block;background:${BRAND_COLOR};color:#fff;font-size:14px;font-weight:600;text-decoration:none;padding:12px 24px;border-radius:8px;margin-top:16px;">${text}</a>`
}

interface BookingNewData {
  recipientName: string
  requesterName: string
  title: string
  eventDate: string
  startTime?: string | null
  endTime?: string | null
  proposedRate?: string | null
  bookingId: string
}

export function bookingNewTemplate(data: BookingNewData): {
  subject: string
  html: string
  headers: Record<string, string>
} {
  const unsubscribeUrl = `${APP_URL}/settings?tab=notifications`
  const timeRange =
    data.startTime && data.endTime
      ? `<p style="font-size:14px;color:${TEXT_COLOR};margin:4px 0;">Time: ${data.startTime} &ndash; ${data.endTime}</p>`
      : ''
  const rate = data.proposedRate
    ? `<p style="font-size:14px;color:${TEXT_COLOR};margin:4px 0;">Proposed rate: &euro;${data.proposedRate}</p>`
    : ''

  const body = `
    <h2 style="font-size:18px;color:${TEXT_COLOR};margin:0 0 8px 0;">New Booking Request</h2>
    <p style="font-size:14px;color:${MUTED_COLOR};margin:0 0 16px 0;">Hi ${data.recipientName},</p>
    <p style="font-size:14px;color:${TEXT_COLOR};margin:0 0 8px 0;">
      <strong>${data.requesterName}</strong> sent you a booking request:
    </p>
    <div style="background:${BG_COLOR};border-radius:8px;padding:16px;margin:16px 0;">
      <p style="font-size:16px;font-weight:600;color:${TEXT_COLOR};margin:0 0 8px 0;">${data.title}</p>
      <p style="font-size:14px;color:${TEXT_COLOR};margin:4px 0;">Date: ${data.eventDate}</p>
      ${timeRange}
      ${rate}
    </div>
    ${ctaButton('View Booking', `${APP_URL}/bookings/${data.bookingId}`)}
  `

  return {
    subject: `New booking request from ${data.requesterName}`,
    html: layout(body, unsubscribeUrl),
    headers: { 'List-Unsubscribe': `<${unsubscribeUrl}>` },
  }
}

interface BookingStatusData {
  recipientName: string
  title: string
  previousStatus: string
  newStatus: string
  note?: string | null
  bookingId: string
}

export function bookingStatusTemplate(data: BookingStatusData): {
  subject: string
  html: string
  headers: Record<string, string>
} {
  const unsubscribeUrl = `${APP_URL}/settings?tab=notifications`
  const statusColors: Record<string, string> = {
    ACCEPTED: '#22C55E',
    DECLINED: '#EF4444',
    CANCELLED: '#F59E0B',
    COMPLETED: '#3B82F6',
  }
  const statusColor = statusColors[data.newStatus] || TEXT_COLOR
  const noteBlock = data.note
    ? `<p style="font-size:14px;color:${MUTED_COLOR};margin:12px 0 0 0;font-style:italic;">"${data.note}"</p>`
    : ''

  const body = `
    <h2 style="font-size:18px;color:${TEXT_COLOR};margin:0 0 8px 0;">Booking Status Update</h2>
    <p style="font-size:14px;color:${MUTED_COLOR};margin:0 0 16px 0;">Hi ${data.recipientName},</p>
    <p style="font-size:14px;color:${TEXT_COLOR};margin:0 0 8px 0;">
      Your booking <strong>${data.title}</strong> has been updated:
    </p>
    <div style="background:${BG_COLOR};border-radius:8px;padding:16px;margin:16px 0;">
      <p style="font-size:14px;color:${MUTED_COLOR};margin:0;">
        ${data.previousStatus} &rarr; <span style="color:${statusColor};font-weight:600;">${data.newStatus}</span>
      </p>
      ${noteBlock}
    </div>
    ${ctaButton('View Booking', `${APP_URL}/bookings/${data.bookingId}`)}
  `

  return {
    subject: `Booking ${data.newStatus.toLowerCase()}: ${data.title}`,
    html: layout(body, unsubscribeUrl),
    headers: { 'List-Unsubscribe': `<${unsubscribeUrl}>` },
  }
}

interface MessageNewData {
  recipientName: string
  senderName: string
  messagePreview: string
  threadId: string
}

export function messageNewTemplate(data: MessageNewData): {
  subject: string
  html: string
  headers: Record<string, string>
} {
  const unsubscribeUrl = `${APP_URL}/settings?tab=notifications`
  const preview =
    data.messagePreview.length > 150
      ? data.messagePreview.slice(0, 150) + '...'
      : data.messagePreview

  const body = `
    <h2 style="font-size:18px;color:${TEXT_COLOR};margin:0 0 8px 0;">New Message</h2>
    <p style="font-size:14px;color:${MUTED_COLOR};margin:0 0 16px 0;">Hi ${data.recipientName},</p>
    <p style="font-size:14px;color:${TEXT_COLOR};margin:0 0 8px 0;">
      <strong>${data.senderName}</strong> sent you a message:
    </p>
    <div style="background:${BG_COLOR};border-radius:8px;padding:16px;margin:16px 0;">
      <p style="font-size:14px;color:${TEXT_COLOR};margin:0;white-space:pre-wrap;">${preview}</p>
    </div>
    ${ctaButton('Reply', `${APP_URL}/messages/${data.threadId}`)}
  `

  return {
    subject: `New message from ${data.senderName}`,
    html: layout(body, unsubscribeUrl),
    headers: { 'List-Unsubscribe': `<${unsubscribeUrl}>` },
  }
}
