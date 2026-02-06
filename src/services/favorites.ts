/**
 * Favorites Service
 * Handles vendor favoriting (the "heart" feature)
 */

import { supabase } from './supabase'
import type { Tables, TablesInsert, Enums } from '@/types/database'
import { handleSupabaseError, UnauthorizedError } from '@/lib/errors'
import type { ArtistDiscoverResult } from './artists'
import type { VenueDiscoverResult, VenueType } from './venues'

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

  /**
   * Get enriched favorite artists for card display
   */
  static async getFavoriteArtistsEnriched(): Promise<ArtistDiscoverResult[]> {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      throw new UnauthorizedError('Not authenticated')
    }

    const { data, error } = await supabase
      .from('favorites')
      .select(
        `
        artists!inner (
          id, stage_name, bio, hourly_rate, years_experience, has_equipment,
          artist_media!left (url, is_primary),
          artist_genres!left (genre_id, genres (name))
        )
      `
      )
      .eq('profile_id', user.id)
      .eq('favorite_type', 'ARTIST')
      .order('created_at', { ascending: false })

    if (error) handleSupabaseError(error)

    return (data ?? []).map((fav) => {
      const artist = fav.artists as Record<string, unknown>
      const media = artist.artist_media as Array<{ url: string; is_primary: boolean }> | null
      const primaryMedia = media?.find((m) => m.is_primary)
      const genreJoins = artist.artist_genres as Array<{ genres: { name: string } | null }> | null
      const genreNames =
        genreJoins?.map((g) => g.genres?.name).filter((n): n is string => !!n) ?? []

      return {
        id: artist.id as string,
        stage_name: artist.stage_name as string,
        bio: artist.bio as string | null,
        hourly_rate: artist.hourly_rate as number | null,
        years_experience: artist.years_experience as number | null,
        has_equipment: (artist.has_equipment as boolean) ?? false,
        primary_image_url: primaryMedia?.url ?? null,
        genre_names: [...new Set(genreNames)],
      }
    })
  }

  /**
   * Get enriched favorite venues for card display
   */
  static async getFavoriteVenuesEnriched(): Promise<VenueDiscoverResult[]> {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      throw new UnauthorizedError('Not authenticated')
    }

    const { data, error } = await supabase
      .from('favorites')
      .select(
        `
        venues!inner (
          id, venue_name, description, type, street, capacity_min, capacity_max,
          cities!left (name),
          venue_media!left (url, is_primary),
          venue_amenities!left (amenities (name))
        )
      `
      )
      .eq('profile_id', user.id)
      .eq('favorite_type', 'VENUE')
      .order('created_at', { ascending: false })

    if (error) handleSupabaseError(error)

    return (data ?? []).map((fav) => {
      const venue = fav.venues as Record<string, unknown>
      const media = venue.venue_media as Array<{ url: string; is_primary: boolean }> | null
      const primaryMedia = media?.find((m) => m.is_primary)
      const city = venue.cities as { name: string } | null
      const amenityJoins = venue.venue_amenities as Array<{
        amenities: { name: string } | null
      }> | null
      const amenityNames =
        amenityJoins?.map((a) => a.amenities?.name).filter((n): n is string => !!n) ?? []

      return {
        id: venue.id as string,
        venue_name: venue.venue_name as string,
        description: venue.description as string | null,
        type: venue.type as VenueType,
        city_name: city?.name ?? null,
        street: venue.street as string | null,
        capacity_min: venue.capacity_min as number | null,
        capacity_max: venue.capacity_max as number | null,
        primary_image_url: primaryMedia?.url ?? null,
        amenity_names: [...new Set(amenityNames)],
      }
    })
  }
}
