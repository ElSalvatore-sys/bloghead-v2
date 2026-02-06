/**
 * Services barrel export
 */

export { supabase } from './supabase'

export { ProfileService, type Profile, type ProfileRole } from './profiles'

export {
  ArtistService,
  type Artist,
  type ArtistWithDetails,
  type ArtistGenre,
  type ArtistMedia,
} from './artists'

export {
  VenueService,
  type Venue,
  type VenueWithDetails,
  type VenueType,
  type VenueAmenity,
  type VenueMedia,
} from './venues'

export {
  FavoriteService,
  type Favorite,
  type FavoriteWithVendor,
  type FavoriteType,
} from './favorites'
