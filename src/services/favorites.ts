/**
 * Favorites Service
 * Handles vendor favoriting (the "heart" feature)
 */

import { supabase } from './supabase'
import type { Tables, TablesInsert, Enums } from '@/types/database'
import { handleSupabaseError, UnauthorizedError } from '@/lib/errors'

export type Favorite = Tables<'favorites'>
export type FavoriteType = Enums<'favorite_type'>

export interface FavoriteWithVendor extends Favorite {
  venues?: {
    id: string
    venue_name: string
    type: string
  } | null
  artists?: {
    id: string
    stage_name: string
  } | null
}

interface PaginatedResult<T> {
  data: T[]
  count: number | null
}

export class FavoriteService {
  /**
   * Get all favorites for the current user
   */
  static async getFavorites(): Promise<PaginatedResult<FavoriteWithVendor>> {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      throw new UnauthorizedError('Not authenticated')
    }

    const { data, error, count } = await supabase
      .from('favorites')
      .select(
        `
        *,
        venues(id, venue_name, type),
        artists(id, stage_name)
      `,
        { count: 'exact' }
      )
      .eq('profile_id', user.id)
      .order('created_at', { ascending: false })

    if (error) handleSupabaseError(error)
    return { data: (data ?? []) as FavoriteWithVendor[], count }
  }

  /**
   * Get favorites by type (VENUE or ARTIST)
   */
  static async getFavoritesByType(
    favoriteType: FavoriteType
  ): Promise<PaginatedResult<FavoriteWithVendor>> {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      throw new UnauthorizedError('Not authenticated')
    }

    const { data, error, count } = await supabase
      .from('favorites')
      .select(
        `
        *,
        venues(id, venue_name, type),
        artists(id, stage_name)
      `,
        { count: 'exact' }
      )
      .eq('profile_id', user.id)
      .eq('favorite_type', favoriteType)
      .order('created_at', { ascending: false })

    if (error) handleSupabaseError(error)
    return { data: (data ?? []) as FavoriteWithVendor[], count }
  }

  /**
   * Check if a vendor is favorited
   */
  static async checkIsFavorite(
    vendorId: string,
    vendorType: FavoriteType
  ): Promise<boolean> {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return false
    }

    const column = vendorType === 'VENUE' ? 'venue_id' : 'artist_id'

    const { data, error } = await supabase
      .from('favorites')
      .select('id')
      .eq('profile_id', user.id)
      .eq(column, vendorId)
      .maybeSingle()

    if (error) handleSupabaseError(error)
    return data !== null
  }

  /**
   * Add a vendor to favorites
   */
  static async addFavorite(
    vendorId: string,
    vendorType: FavoriteType
  ): Promise<Favorite> {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      throw new UnauthorizedError('Not authenticated')
    }

    const insertData: TablesInsert<'favorites'> = {
      profile_id: user.id,
      favorite_type: vendorType,
      venue_id: vendorType === 'VENUE' ? vendorId : null,
      artist_id: vendorType === 'ARTIST' ? vendorId : null,
    }

    const { data, error } = await supabase
      .from('favorites')
      .insert(insertData)
      .select()
      .single()

    if (error) handleSupabaseError(error)
    return data
  }

  /**
   * Remove a vendor from favorites
   */
  static async removeFavorite(
    vendorId: string,
    vendorType: FavoriteType
  ): Promise<void> {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      throw new UnauthorizedError('Not authenticated')
    }

    const column = vendorType === 'VENUE' ? 'venue_id' : 'artist_id'

    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('profile_id', user.id)
      .eq(column, vendorId)

    if (error) handleSupabaseError(error)
  }

  /**
   * Toggle favorite status (add if not exists, remove if exists)
   */
  static async toggleFavorite(
    vendorId: string,
    vendorType: FavoriteType
  ): Promise<{ isFavorite: boolean }> {
    const isFavorite = await FavoriteService.checkIsFavorite(vendorId, vendorType)

    if (isFavorite) {
      await FavoriteService.removeFavorite(vendorId, vendorType)
      return { isFavorite: false }
    } else {
      await FavoriteService.addFavorite(vendorId, vendorType)
      return { isFavorite: true }
    }
  }
}
