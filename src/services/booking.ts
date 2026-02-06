/**
 * Booking Service
 * Handles booking request CRUD and status transitions
 */

import { supabase } from './supabase'
import type { Tables, TablesInsert, Enums } from '@/types/database'
import { handleSupabaseError, UnauthorizedError } from '@/lib/errors'
import {
  createBookingRequestSchema,
  type CreateBookingRequestInput,
} from '@/lib/validations'

export type BookingRequest = Tables<'booking_requests'>
export type BookingStatus = Enums<'booking_status'>
export type BookingRequestEvent = Tables<'booking_request_events'>

export interface BookingWithDetails extends BookingRequest {
  artists: { id: string; stage_name: string } | null
  venues: { id: string; venue_name: string; type: string } | null
  requester: { id: string; first_name: string; last_name: string } | null
}

export interface BookingDetail extends BookingWithDetails {
  booking_request_events: BookingRequestEvent[]
}

export class BookingService {
  /**
   * Create a new booking request
   */
  static async create(
    input: CreateBookingRequestInput,
    artistId: string,
    venueId: string
  ): Promise<BookingRequest> {
    const validated = createBookingRequestSchema.parse(input)

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      throw new UnauthorizedError('Not authenticated')
    }

    const insertData: TablesInsert<'booking_requests'> = {
      ...validated,
      artist_id: artistId,
      venue_id: venueId,
      requester_id: user.id,
    }

    const { data, error } = await supabase
      .from('booking_requests')
      .insert(insertData)
      .select()
      .single()

    if (error) handleSupabaseError(error)

    // Insert initial audit event
    await supabase.from('booking_request_events').insert({
      booking_request_id: data.id,
      actor_id: user.id,
      new_status: 'PENDING',
      note: 'Booking request created',
    })

    return data
  }

  /**
   * Get bookings sent by the current user
   */
  static async getByUser(): Promise<BookingWithDetails[]> {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      throw new UnauthorizedError('Not authenticated')
    }

    const { data, error } = await supabase
      .from('booking_requests')
      .select(
        `
        *,
        artists (id, stage_name),
        venues (id, venue_name, type),
        requester:profiles!booking_requests_requester_id_fkey (id, first_name, last_name)
      `
      )
      .eq('requester_id', user.id)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })

    if (error) handleSupabaseError(error)
    return (data ?? []) as BookingWithDetails[]
  }

  /**
   * Get bookings received as an artist or venue owner
   */
  static async getForProvider(): Promise<BookingWithDetails[]> {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      throw new UnauthorizedError('Not authenticated')
    }

    // Get user's artist and venue IDs
    const [artistResult, venueResult] = await Promise.all([
      supabase
        .from('artists')
        .select('id')
        .eq('profile_id', user.id)
        .is('deleted_at', null)
        .maybeSingle(),
      supabase
        .from('venues')
        .select('id')
        .eq('profile_id', user.id)
        .is('deleted_at', null)
        .maybeSingle(),
    ])

    const artistId = artistResult.data?.id
    const venueId = venueResult.data?.id

    if (!artistId && !venueId) return []

    let query = supabase
      .from('booking_requests')
      .select(
        `
        *,
        artists (id, stage_name),
        venues (id, venue_name, type),
        requester:profiles!booking_requests_requester_id_fkey (id, first_name, last_name)
      `
      )
      .is('deleted_at', null)

    // Filter by artist or venue ID
    if (artistId && venueId) {
      query = query.or(`artist_id.eq.${artistId},venue_id.eq.${venueId}`)
    } else if (artistId) {
      query = query.eq('artist_id', artistId)
    } else if (venueId) {
      query = query.eq('venue_id', venueId)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) handleSupabaseError(error)
    return (data ?? []) as BookingWithDetails[]
  }

  /**
   * Get a single booking by ID with full details and history
   */
  static async getById(id: string): Promise<BookingDetail> {
    const { data, error } = await supabase
      .from('booking_requests')
      .select(
        `
        *,
        artists (id, stage_name),
        venues (id, venue_name, type),
        requester:profiles!booking_requests_requester_id_fkey (id, first_name, last_name),
        booking_request_events (*)
      `
      )
      .eq('id', id)
      .order('created_at', {
        referencedTable: 'booking_request_events',
        ascending: false,
      })
      .single()

    if (error) handleSupabaseError(error)
    return data as BookingDetail
  }

  /**
   * Update booking status with audit trail
   */
  static async updateStatus(
    id: string,
    newStatus: BookingStatus,
    note?: string
  ): Promise<BookingRequest> {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      throw new UnauthorizedError('Not authenticated')
    }

    // Get current status
    const { data: current, error: fetchError } = await supabase
      .from('booking_requests')
      .select('status')
      .eq('id', id)
      .single()

    if (fetchError) handleSupabaseError(fetchError)

    // Update booking
    const { data, error } = await supabase
      .from('booking_requests')
      .update({
        status: newStatus,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) handleSupabaseError(error)

    // Insert audit event
    await supabase.from('booking_request_events').insert({
      booking_request_id: id,
      actor_id: user.id,
      previous_status: current.status,
      new_status: newStatus,
      note: note ?? null,
    })

    return data
  }
}
