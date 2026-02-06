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
  useCreateVenue,
  useUpdateVenue,
  useDeleteVenue,
} from './use-venues'

// Favorite hooks and keys
export {
  favoriteKeys,
  useFavorites,
  useFavoritesByType,
  useIsFavorite,
  useToggleFavorite,
  useAddFavorite,
  useRemoveFavorite,
} from './use-favorites'

// Vendor search hooks
export {
  vendorSearchKeys,
  useVendorSearch,
  useVenueSearch,
  useArtistSearch,
  getTotalCount,
  flattenPages,
} from './use-vendor-search'
