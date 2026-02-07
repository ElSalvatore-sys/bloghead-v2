/**
 * Email Service
 * Handles sending emails via Edge Function, deduplication, and preference management
 */

import { supabase } from './supabase'
import type { Tables, TablesUpdate } from '@/types/database'
import type { Json } from '@/types/database'

export type EmailPreferences = Tables<'email_preferences'>

type EmailTemplate = 'booking-new' | 'booking-status' | 'message-new'

interface SendEmailParams {
  to: string
  subject: string
  html: string
  headers?: Record<string, string>
}

export class EmailService {
  /**
   * Send an email via the send-email Edge Function.
   * Checks preferences and deduplication before sending.
   * Failures are caught silently — email should never block the primary action.
   */
  static async send(
    template: EmailTemplate,
    recipientId: string,
    recipientEmail: string,
    emailContent: { subject: string; html: string; headers?: Record<string, string> },
    metadata: Record<string, string> = {}
  ): Promise<void> {
    try {
      // 1. Check preferences
      const prefs = await this.getPreferencesForUser(recipientId)
      if (prefs) {
        if (template === 'booking-new' && !prefs.booking_emails) return
        if (template === 'booking-status' && !prefs.booking_emails) return
        if (template === 'message-new' && !prefs.message_emails) return
      }

      // 2. Check deduplication
      const duplicate = await this.isDuplicate(recipientId, template, metadata)
      if (duplicate) return

      // 3. Send via Edge Function
      const params: SendEmailParams = {
        to: recipientEmail,
        subject: emailContent.subject,
        html: emailContent.html,
        headers: emailContent.headers,
      }

      const { data, error } = await supabase.functions.invoke('send-email', {
        body: params,
      })

      // 4. Log the send
      const resendId = error ? null : (data?.id ?? null)
      await supabase.from('email_logs').insert({
        recipient_email: recipientEmail,
        recipient_id: recipientId,
        template,
        subject: emailContent.subject,
        status: error ? 'failed' : 'sent',
        resend_id: resendId,
        metadata: metadata as unknown as Json,
      })
    } catch {
      // Silent failure — email must never block booking/messaging
    }
  }

  /**
   * Check if a duplicate email was sent within the last 5 minutes
   */
  private static async isDuplicate(
    recipientId: string,
    template: string,
    metadata: Record<string, string>
  ): Promise<boolean> {
    try {
      const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString()

      let query = supabase
        .from('email_logs')
        .select('id')
        .eq('recipient_id', recipientId)
        .eq('template', template)
        .gte('created_at', fiveMinAgo)

      // For message emails, also check thread_id
      if (template === 'message-new' && metadata.thread_id) {
        query = query.eq('metadata->>thread_id', String(metadata.thread_id))
      }

      // For booking emails, also check booking_id
      if (
        (template === 'booking-new' || template === 'booking-status') &&
        metadata.booking_id
      ) {
        query = query.eq('metadata->>booking_id', String(metadata.booking_id))
      }

      const { data } = await query.limit(1)
      return (data?.length ?? 0) > 0
    } catch {
      return false
    }
  }

  /**
   * Get email preferences for a specific user (internal)
   */
  private static async getPreferencesForUser(
    profileId: string
  ): Promise<EmailPreferences | null> {
    const { data } = await supabase
      .from('email_preferences')
      .select('*')
      .eq('profile_id', profileId)
      .maybeSingle()

    return data
  }

  /**
   * Get email preferences for the current user
   */
  static async getPreferences(): Promise<EmailPreferences | null> {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return null

    const { data } = await supabase
      .from('email_preferences')
      .select('*')
      .eq('profile_id', user.id)
      .maybeSingle()

    return data
  }

  /**
   * Update email preferences for the current user
   */
  static async updatePreferences(
    prefs: Partial<
      Pick<EmailPreferences, 'booking_emails' | 'message_emails' | 'marketing_emails'>
    >
  ): Promise<EmailPreferences> {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) throw new Error('Not authenticated')

    const updateData: TablesUpdate<'email_preferences'> = {
      ...prefs,
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabase
      .from('email_preferences')
      .update(updateData)
      .eq('profile_id', user.id)
      .select()
      .single()

    if (error) throw error
    return data
  }
}
