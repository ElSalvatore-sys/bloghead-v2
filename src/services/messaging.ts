/**
 * Messaging Service
 * Handles message threads and messages
 */

import { supabase } from './supabase'
import type { Tables } from '@/types/database'
import { handleSupabaseError, UnauthorizedError } from '@/lib/errors'
import { sendMessageSchema } from '@/lib/validations'
import { EmailService } from './email'
import { messageNewTemplate } from '@/lib/email-templates'

export type MessageThread = Tables<'message_threads'>
export type Message = Tables<'messages'>

export interface ThreadParticipant {
  id: string
  first_name: string
  last_name: string
  avatar_url: string | null
  role: string
}

export interface ThreadWithDetails extends MessageThread {
  participant_one: ThreadParticipant | null
  participant_two: ThreadParticipant | null
  last_message: {
    content: string
    sender_id: string | null
    created_at: string
    is_read: boolean
  } | null
  unread_count: number
}

export interface ThreadDetail extends MessageThread {
  participant_one: ThreadParticipant | null
  participant_two: ThreadParticipant | null
  messages: Message[]
}

export class MessagingService {
  /**
   * Get all threads for the current user
   */
  static async getThreads(): Promise<ThreadWithDetails[]> {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      throw new UnauthorizedError('Not authenticated')
    }

    const { data, error } = await supabase
      .from('message_threads')
      .select(
        `
        *,
        participant_one:profiles!message_threads_participant_one_id_fkey (id, first_name, last_name, avatar_url, role),
        participant_two:profiles!message_threads_participant_two_id_fkey (id, first_name, last_name, avatar_url, role),
        messages (id, content, sender_id, created_at, is_read)
      `
      )
      .or(
        `participant_one_id.eq.${user.id},participant_two_id.eq.${user.id}`
      )
      .order('last_message_at', { ascending: false, nullsFirst: false })
      .order('created_at', {
        referencedTable: 'messages',
        ascending: false,
      })

    if (error) handleSupabaseError(error)

    return (data ?? []).map((thread) => {
      const messages = (thread.messages ?? []) as Message[]
      const lastMsg = messages[0] ?? null

      const unreadCount = messages.filter(
        (m) => !m.is_read && m.sender_id !== user.id
      ).length

      return {
        ...thread,
        participant_one: thread.participant_one as ThreadParticipant | null,
        participant_two: thread.participant_two as ThreadParticipant | null,
        messages: undefined,
        last_message: lastMsg
          ? {
              content: lastMsg.content,
              sender_id: lastMsg.sender_id,
              created_at: lastMsg.created_at,
              is_read: lastMsg.is_read,
            }
          : null,
        unread_count: unreadCount,
      } as ThreadWithDetails
    })
  }

  /**
   * Get a single thread with all messages, and mark unread as read
   */
  static async getThread(threadId: string): Promise<ThreadDetail> {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      throw new UnauthorizedError('Not authenticated')
    }

    const { data, error } = await supabase
      .from('message_threads')
      .select(
        `
        *,
        participant_one:profiles!message_threads_participant_one_id_fkey (id, first_name, last_name, avatar_url, role),
        participant_two:profiles!message_threads_participant_two_id_fkey (id, first_name, last_name, avatar_url, role),
        messages (*)
      `
      )
      .eq('id', threadId)
      .order('created_at', {
        referencedTable: 'messages',
        ascending: true,
      })
      .single()

    if (error) handleSupabaseError(error)

    // Mark unread messages as read
    const unreadIds = (data.messages ?? [])
      .filter((m: Message) => !m.is_read && m.sender_id !== user.id)
      .map((m: Message) => m.id)

    if (unreadIds.length > 0) {
      await supabase
        .from('messages')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .in('id', unreadIds)
    }

    return {
      ...data,
      participant_one: data.participant_one as ThreadParticipant | null,
      participant_two: data.participant_two as ThreadParticipant | null,
      messages: (data.messages ?? []) as Message[],
    } as ThreadDetail
  }

  /**
   * Get or create a thread between current user and another user
   */
  static async getOrCreateThread(
    otherUserId: string,
    bookingRequestId?: string
  ): Promise<MessageThread> {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      throw new UnauthorizedError('Not authenticated')
    }

    // Check both orderings
    const { data: existing, error: findError } = await supabase
      .from('message_threads')
      .select('*')
      .or(
        `and(participant_one_id.eq.${user.id},participant_two_id.eq.${otherUserId}),and(participant_one_id.eq.${otherUserId},participant_two_id.eq.${user.id})`
      )
      .maybeSingle()

    if (findError) handleSupabaseError(findError)
    if (existing) return existing

    // Create new thread
    const { data: newThread, error: createError } = await supabase
      .from('message_threads')
      .insert({
        participant_one_id: user.id,
        participant_two_id: otherUserId,
        booking_request_id: bookingRequestId ?? null,
      })
      .select()
      .single()

    if (createError) handleSupabaseError(createError)
    return newThread
  }

  /**
   * Send a message in a thread
   */
  static async sendMessage(
    threadId: string,
    content: string
  ): Promise<Message> {
    const validated = sendMessageSchema.parse({ content })

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      throw new UnauthorizedError('Not authenticated')
    }

    const { data, error } = await supabase
      .from('messages')
      .insert({
        thread_id: threadId,
        sender_id: user.id,
        content: validated.content,
      })
      .select()
      .single()

    if (error) handleSupabaseError(error)

    // Update thread's last_message_at
    await supabase
      .from('message_threads')
      .update({ last_message_at: new Date().toISOString() })
      .eq('id', threadId)

    // Send email notification to the other participant (fire-and-forget)
    this.sendMessageEmail(threadId, user.id, validated.content).catch(() => {})

    return data
  }

  /**
   * Send new message email to the other participant in the thread
   */
  private static async sendMessageEmail(
    threadId: string,
    senderId: string,
    content: string
  ): Promise<void> {
    // Get thread to find the other participant
    const { data: thread } = await supabase
      .from('message_threads')
      .select('participant_one_id, participant_two_id')
      .eq('id', threadId)
      .single()

    if (!thread) return

    const recipientId =
      thread.participant_one_id === senderId
        ? thread.participant_two_id
        : thread.participant_one_id

    // Get sender and recipient profiles
    const [senderResult, recipientResult] = await Promise.all([
      supabase
        .from('profiles')
        .select('first_name, last_name')
        .eq('id', senderId)
        .single(),
      supabase
        .from('profiles')
        .select('id, email, first_name')
        .eq('id', recipientId)
        .single(),
    ])

    if (!recipientResult.data?.email || !senderResult.data) return

    const senderName =
      [senderResult.data.first_name, senderResult.data.last_name]
        .filter(Boolean)
        .join(' ') || 'Someone'

    const emailContent = messageNewTemplate({
      recipientName: recipientResult.data.first_name || 'there',
      senderName,
      messagePreview: content,
      threadId,
    })

    await EmailService.send(
      'message-new',
      recipientResult.data.id,
      recipientResult.data.email,
      emailContent,
      { thread_id: threadId }
    )
  }

  /**
   * Get total unread message count for current user
   */
  static async getUnreadCount(): Promise<number> {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return 0
    }

    // Get thread IDs for user
    const { data: threads, error: threadError } = await supabase
      .from('message_threads')
      .select('id')
      .or(
        `participant_one_id.eq.${user.id},participant_two_id.eq.${user.id}`
      )

    if (threadError || !threads?.length) return 0

    const threadIds = threads.map((t) => t.id)

    const { count, error: countError } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .in('thread_id', threadIds)
      .eq('is_read', false)
      .neq('sender_id', user.id)

    if (countError) return 0
    return count ?? 0
  }
}
