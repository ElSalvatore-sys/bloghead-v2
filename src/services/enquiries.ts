/**
 * Enquiry Service
 * Handles lightweight contact/enquiry CRUD for artists and venues
 */

import { supabase } from './supabase'
import { handleSupabaseError, UnauthorizedError } from '@/lib/errors'
import type { CreateEnquiryInput } from '@/lib/validations'

export type EnquiryStatus = 'PENDING' | 'READ' | 'RESPONDED' | 'ARCHIVED'

export interface Enquiry {
  id: string
  sender_id: string
  entity_type: 'ARTIST' | 'VENUE'
  artist_id: string | null
  venue_id: string | null
  enquiry_type: 'BOOKING' | 'PRICING' | 'AVAILABILITY' | 'GENERAL'
  status: EnquiryStatus
  name: string
  email: string
  phone: string | null
  message: string
  event_date: string | null
  created_at: string
  updated_at: string
}

export interface EnquiryWithDetails extends Enquiry {
  sender: { id: string; first_name: string; last_name: string } | null
  artists: { id: string; stage_name: string } | null
  venues: { id: string; venue_name: string } | null
}

export class EnquiryService {
  /**
   * Create a new enquiry
   */
  static async create(input: CreateEnquiryInput): Promise<Enquiry> {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      throw new UnauthorizedError('Not authenticated')
    }

    const { data, error } = await supabase
      .from('enquiries')
      .insert({
        sender_id: user.id,
        entity_type: input.entity_type,
        artist_id: input.entity_type === 'ARTIST' ? input.artist_id : null,
        venue_id: input.entity_type === 'VENUE' ? input.venue_id : null,
        enquiry_type: input.enquiry_type,
        name: input.name,
        email: input.email,
        phone: input.phone ?? null,
        message: input.message,
        event_date: input.event_date ?? null,
      })
      .select()
      .single()

    if (error) handleSupabaseError(error)
    return data as Enquiry
  }

  /**
   * Get all enquiries sent by the current user
   */
  static async getBySender(): Promise<EnquiryWithDetails[]> {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      throw new UnauthorizedError('Not authenticated')
    }

    const { data, error } = await supabase
      .from('enquiries')
      .select(
        `
        *,
        sender:profiles!enquiries_sender_id_fkey (id, first_name, last_name),
        artists (id, stage_name),
        venues (id, venue_name)
      `
      )
      .eq('sender_id', user.id)
      .order('created_at', { ascending: false })

    if (error) handleSupabaseError(error)
    return (data ?? []) as EnquiryWithDetails[]
  }

  /**
   * Get all enquiries received by the current user's artist/venue
   */
  static async getForProvider(): Promise<EnquiryWithDetails[]> {
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
        .maybeSingle(),
      supabase
        .from('venues')
        .select('id')
        .eq('profile_id', user.id)
        .maybeSingle(),
    ])

    const artistId = artistResult.data?.id
    const venueId = venueResult.data?.id

    if (!artistId && !venueId) return []

    let query = supabase
      .from('enquiries')
      .select(
        `
        *,
        sender:profiles!enquiries_sender_id_fkey (id, first_name, last_name),
        artists (id, stage_name),
        venues (id, venue_name)
      `
      )

    if (artistId && venueId) {
      query = query.or(`artist_id.eq.${artistId},venue_id.eq.${venueId}`)
    } else if (artistId) {
      query = query.eq('artist_id', artistId)
    } else if (venueId) {
      query = query.eq('venue_id', venueId)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) handleSupabaseError(error)
    return (data ?? []) as EnquiryWithDetails[]
  }

  /**
   * Update enquiry status (provider action)
   */
  static async updateStatus(id: string, status: EnquiryStatus): Promise<Enquiry> {
    const { data, error } = await supabase
      .from('enquiries')
      .update({ status })
      .eq('id', id)
      .select()
      .single()

    if (error) handleSupabaseError(error)
    return data as Enquiry
  }
}
