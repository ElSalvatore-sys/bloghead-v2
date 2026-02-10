/**
 * Notification Service
 * Handles in-app notification CRUD and fire-and-forget creation
 */

import { supabase } from './supabase'
import { handleSupabaseError, UnauthorizedError } from '@/lib/errors'
import type { Json } from '@/types/database'

export type NotificationType =
  | 'enquiry_received'
  | 'enquiry_status_changed'
  | 'message_received'
  | 'new_favorite'

export interface Notification {
  id: string
  user_id: string
  type: NotificationType
  title: string
  body: string | null
  data: Json
  link: string | null
  read_at: string | null
  created_at: string
}

interface CreateNotificationInput {
  user_id: string
  type: NotificationType
  title: string
  body?: string
  data?: Json
  link?: string
}

export class NotificationService {
  static async create(input: CreateNotificationInput): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .insert({
        user_id: input.user_id,
        type: input.type,
        title: input.title,
        body: input.body ?? null,
        data: input.data ?? {},
        link: input.link ?? null,
      })

    if (error) handleSupabaseError(error)
  }

  static async getAll(limit = 50): Promise<Notification[]> {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      throw new UnauthorizedError('Not authenticated')
    }

    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) handleSupabaseError(error)
    return (data ?? []) as Notification[]
  }

  static async getUnread(): Promise<Notification[]> {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      throw new UnauthorizedError('Not authenticated')
    }

    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .is('read_at', null)
      .order('created_at', { ascending: false })

    if (error) handleSupabaseError(error)
    return (data ?? []) as Notification[]
  }

  static async getUnreadCount(): Promise<number> {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return 0
    }

    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .is('read_at', null)

    if (error) return 0
    return count ?? 0
  }

  static async markRead(id: string): Promise<Notification> {
    const { data, error } = await supabase
      .from('notifications')
      .update({ read_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) handleSupabaseError(error)
    return data as Notification
  }

  static async markAllRead(): Promise<void> {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      throw new UnauthorizedError('Not authenticated')
    }

    const { error } = await supabase
      .from('notifications')
      .update({ read_at: new Date().toISOString() })
      .eq('user_id', user.id)
      .is('read_at', null)

    if (error) handleSupabaseError(error)
  }

  static async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', id)

    if (error) handleSupabaseError(error)
  }

  /**
   * Fire-and-forget notification creation.
   * Use this from other services to avoid blocking the main operation.
   */
  static notify(input: CreateNotificationInput): void {
    NotificationService.create(input).catch(() => {})
  }
}
