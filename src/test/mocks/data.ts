export const mockUser = {
  id: 'user-123',
  email: 'test@example.com',
  app_metadata: {},
  user_metadata: { first_name: 'Test', last_name: 'User' },
  aud: 'authenticated',
  created_at: '2024-01-01T00:00:00Z',
}

export const mockSession = {
  access_token: 'mock-access-token',
  refresh_token: 'mock-refresh-token',
  expires_in: 3600,
  token_type: 'bearer',
  user: mockUser,
}

export const mockProfile = {
  id: 'user-123',
  email: 'test@example.com',
  first_name: 'Test',
  last_name: 'User',
  avatar_url: 'https://example.com/avatar.jpg',
  role: 'ARTIST' as const,
  bio: 'Test bio',
  phone: '+49123456789',
  city_id: 'city-1',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  deleted_at: null,
}

export const mockArtist = {
  id: 'artist-1',
  profile_id: 'user-123',
  stage_name: 'DJ Test',
  bio: 'Test artist bio',
  hourly_rate: 50,
  years_experience: 5,
  has_equipment: true,
  is_public: true,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  deleted_at: null,
}

export const mockVenue = {
  id: 'venue-1',
  profile_id: 'user-123',
  venue_name: 'Test Club',
  description: 'A test venue',
  type: 'CLUB' as const,
  street: 'Test Street 1',
  city_id: 'city-1',
  capacity_min: 50,
  capacity_max: 200,
  is_public: true,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  deleted_at: null,
}

export const mockBooking = {
  id: 'booking-1',
  requester_id: 'user-123',
  artist_id: 'artist-1',
  venue_id: 'venue-1',
  title: 'Test Booking',
  event_date: '2024-06-15',
  start_time: '20:00',
  end_time: '23:00',
  proposed_rate: 100,
  status: 'PENDING' as const,
  notes: 'Test notes',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  deleted_at: null,
}

export const mockThread = {
  id: 'thread-1',
  participant_one_id: 'user-123',
  participant_two_id: 'user-456',
  booking_request_id: null,
  last_message_at: '2024-01-01T12:00:00Z',
  created_at: '2024-01-01T00:00:00Z',
}

export const mockMessage = {
  id: 'msg-1',
  thread_id: 'thread-1',
  sender_id: 'user-123',
  content: 'Hello, this is a test message',
  is_read: false,
  read_at: null,
  created_at: '2024-01-01T12:00:00Z',
}

export const mockFavorite = {
  id: 'fav-1',
  profile_id: 'user-123',
  favorite_type: 'ARTIST' as const,
  artist_id: 'artist-1',
  venue_id: null,
  created_at: '2024-01-01T00:00:00Z',
}

export const mockGenre = {
  id: 'genre-1',
  name: 'House',
  sort_order: 0,
  created_at: '2024-01-01T00:00:00Z',
}

export const mockAmenity = {
  id: 'amenity-1',
  name: 'Sound System',
  sort_order: 0,
  created_at: '2024-01-01T00:00:00Z',
}

export const mockCity = {
  id: 'city-1',
  name: 'Wiesbaden',
  region_id: 'region-1',
  created_at: '2024-01-01T00:00:00Z',
}

export const mockRegion = {
  id: 'region-1',
  name: 'Hessen',
  created_at: '2024-01-01T00:00:00Z',
}

export const mockAvailability = {
  id: 'avail-1',
  artist_id: 'artist-1',
  day_of_week: 5,
  start_time: '20:00',
  end_time: '02:00',
  is_available: true,
  created_at: '2024-01-01T00:00:00Z',
}

export const mockEmailPreferences = {
  id: 'ep-1',
  profile_id: 'user-123',
  booking_emails: true,
  message_emails: true,
  marketing_emails: false,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
}

export const mockMediaRecord = {
  id: 'media-1',
  url: 'https://test.supabase.co/storage/v1/object/public/artist-media/artist-1/img.webp',
  type: 'IMAGE' as const,
  title: null,
  description: null,
  sort_order: 0,
  is_primary: true,
  artist_id: 'artist-1',
  created_at: '2024-01-01T00:00:00Z',
}

export const mockEnquiry = {
  id: 'enq-1',
  sender_id: 'user-123',
  entity_type: 'ARTIST' as const,
  artist_id: 'artist-1',
  venue_id: null,
  enquiry_type: 'BOOKING' as const,
  status: 'PENDING' as const,
  name: 'Test User',
  email: 'test@example.com',
  phone: null,
  message: 'I would like to book you for an event.',
  event_date: '2024-07-15',
  created_at: '2024-01-15T10:00:00Z',
  updated_at: '2024-01-15T10:00:00Z',
}
