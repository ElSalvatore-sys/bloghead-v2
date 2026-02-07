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
  type ArtistDiscoverOptions,
  type ArtistDiscoverResult,
} from './artists'

export {
  VenueService,
  type Venue,
  type VenueWithDetails,
  type VenueType,
  type VenueAmenity,
  type VenueMedia,
  type VenueDiscoverOptions,
  type VenueDiscoverResult,
} from './venues'

export {
  FavoriteService,
  type Favorite,
  type FavoriteWithVendor,
  type FavoriteType,
} from './favorites'

export {
  BookingService,
  type BookingRequest,
  type BookingWithDetails,
  type BookingDetail,
  type BookingStatus,
  type BookingRequestEvent,
} from './booking'

export {
  MessagingService,
  type MessageThread,
  type Message,
  type ThreadWithDetails,
  type ThreadDetail,
  type ThreadParticipant,
} from './messaging'

export { AvailabilityService, type Availability } from './availability'

export { GenreService, type Genre } from './genres'

export { AmenityService, type Amenity } from './amenities'

export {
  LocationService,
  type City,
  type Region,
  type CityWithRegion,
} from './locations'

export { StorageService, type StorageBucket } from './storage'

export {
  SearchService,
  type ArtistSearchResult,
  type VenueSearchResult,
  type CombinedSearchResults,
} from './search'

export {
  MediaService,
  type MediaTable,
  type ArtistMedia as ArtistMediaRecord,
  type VenueMedia as VenueMediaRecord,
} from './media'

export { EmailService, type EmailPreferences } from './email'
