/**
 * Query hooks barrel export
 */

// Profile hooks and keys
export {
  profileKeys,
  useCurrentProfile,
  useProfile,
  useProfilesByRole,
  useUpdateProfile,
} from './use-profile'

// Artist hooks and keys
export {
  artistKeys,
  useArtist,
  useArtistByProfile,
  useArtists,
  useSearchArtists,
  useSimilarArtists,
  useCreateArtist,
  useUpdateArtist,
  useDeleteArtist,
} from './use-artists'

// Venue hooks and keys
export {
  venueKeys,
  useVenue,
  useVenueByProfile,
  useVenues,
  useSearchVenues,
  useSimilarVenues,
  useCreateVenue,
  useUpdateVenue,
  useDeleteVenue,
} from './use-venues'

// Availability hooks and keys
export { availabilityKeys, useAvailability } from './use-availability'

// Favorite hooks and keys
export {
  favoriteKeys,
  useFavorites,
  useFavoritesByType,
  useFavoriteArtistsEnriched,
  useFavoriteVenuesEnriched,
  useIsFavorite,
  useToggleFavorite,
  useAddFavorite,
  useRemoveFavorite,
} from './use-favorites'

// Booking hooks and keys
export {
  bookingKeys,
  useUserBookings,
  useProviderBookings,
  useBooking,
  useCreateBooking,
  useUpdateBookingStatus,
} from './use-booking'

// Messaging hooks and keys
export {
  messagingKeys,
  useThreads,
  useThread,
  useSendMessage,
  useUnreadCount,
  useGetOrCreateThread,
} from './use-messaging'

// Vendor search hooks
export {
  vendorSearchKeys,
  useVendorSearch,
  useVenueSearch,
  useArtistSearch,
  getTotalCount,
  flattenPages,
} from './use-vendor-search'

// Reference data hooks
export { genreKeys, useGenres } from './use-genres'
export { amenityKeys, useAmenities } from './use-amenities'
export { locationKeys, useCities, useRegions } from './use-locations'

// Discovery hooks
export { discoveryKeys, useDiscoverArtists, useDiscoverVenues } from './use-discovery'

// Search hooks
export {
  searchKeys,
  useSearchArtistsRpc,
  useSearchVenuesRpc,
  useGlobalSearch,
} from './use-search'

// Media hooks
export {
  mediaKeys,
  useUploadAvatar,
  useUploadMedia,
  useDeleteMedia,
  useEntityMedia,
  useSetPrimaryMedia,
} from './use-media'

// Email preference hooks
export {
  emailPreferenceKeys,
  useEmailPreferences,
  useUpdateEmailPreferences,
} from './use-email-preferences'
