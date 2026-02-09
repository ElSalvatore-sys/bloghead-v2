/**
 * Seed Demo Data Script
 *
 * Creates 12 demo artists and 12 demo venues with full records:
 * - Auth users + profiles
 * - Artist/venue records (is_public: true)
 * - Genre/amenity associations via junction tables
 * - Primary media entries (picsum.photos placeholders)
 *
 * Run with: npm run db:seed-demo
 * Idempotent: safe to run multiple times.
 *
 * Requires SUPABASE_SERVICE_ROLE_KEY in .env.local
 */

import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

// Load .env.local
config({ path: '.env.local' })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing environment variables:')
  console.error('   - VITE_SUPABASE_URL')
  console.error('   - SUPABASE_SERVICE_ROLE_KEY')
  console.error('\nAdd SUPABASE_SERVICE_ROLE_KEY to .env.local')
  console.error('Get it from: Supabase Dashboard > Settings > API > service_role key')
  process.exit(1)
}

// Admin client bypasses RLS
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// =============================================
// DATA DEFINITIONS
// =============================================

interface DemoArtist {
  email: string
  firstName: string
  lastName: string
  stageName: string
  bio: string
  hourlyRate: number
  yearsExperience: number
  genreSlugs: string[]
  hasEquipment: boolean
  imageId: number // picsum.photos seed
}

interface DemoVenue {
  email: string
  firstName: string
  lastName: string
  venueName: string
  type: 'BAR' | 'CLUB' | 'RESTAURANT' | 'HOTEL' | 'EVENT_SPACE'
  description: string
  citySlug: string
  street: string
  postalCode: string
  capacityMin: number
  capacityMax: number
  amenitySlugs: string[]
  imageId: number
}

const DEMO_ARTISTS: DemoArtist[] = [
  {
    email: 'demo-artist-01@test.com',
    firstName: 'Niklas',
    lastName: 'Hartmann',
    stageName: 'DJ Nachtklang',
    bio: 'Deep electronic sounds from the heart of Wiesbaden. Resident DJ with 8 years of experience blending house, techno, and deep house into unforgettable sets.',
    hourlyRate: 120,
    yearsExperience: 8,
    genreSlugs: ['electronic', 'house', 'deep-house'],
    hasEquipment: true,
    imageId: 1011
  },
  {
    email: 'demo-artist-02@test.com',
    firstName: 'Luna',
    lastName: 'Voss',
    stageName: 'Luna Voss',
    bio: 'Award-winning jazz vocalist and pianist performing across the Rhein-Main region. Specializing in smooth jazz and intimate evening performances.',
    hourlyRate: 95,
    yearsExperience: 12,
    genreSlugs: ['jazz', 'smooth-jazz'],
    hasEquipment: false,
    imageId: 1027
  },
  {
    email: 'demo-artist-03@test.com',
    firstName: 'Max',
    lastName: 'Steiner',
    stageName: 'Steinbrech',
    bio: 'Alternative rock band from Mainz. Raw energy, authentic lyrics, and powerful live performances that leave audiences wanting more.',
    hourlyRate: 85,
    yearsExperience: 6,
    genreSlugs: ['rock', 'alternative'],
    hasEquipment: true,
    imageId: 1025
  },
  {
    email: 'demo-artist-04@test.com',
    firstName: 'Karim',
    lastName: 'Yilmaz',
    stageName: 'MC Rheinflow',
    bio: 'Bilingual MC bringing Deutschrap to the international stage. Known for freestyle battles and high-energy live shows across Hessen.',
    hourlyRate: 150,
    yearsExperience: 10,
    genreSlugs: ['hip-hop', 'deutschrap'],
    hasEquipment: true,
    imageId: 1012
  },
  {
    email: 'demo-artist-05@test.com',
    firstName: 'Klara',
    lastName: 'Engel',
    stageName: 'Klara Engel',
    bio: 'Classically trained pianist and composer. Performing with orchestras and chamber ensembles for over 15 years. Available for weddings and corporate events.',
    hourlyRate: 200,
    yearsExperience: 15,
    genreSlugs: ['classical'],
    hasEquipment: false,
    imageId: 1029
  },
  {
    email: 'demo-artist-06@test.com',
    firstName: 'Felix',
    lastName: 'Braun',
    stageName: 'Farbton',
    bio: 'Pop artist creating catchy melodies with electronic undertones. Chart-topping singles and a growing fanbase across Germany.',
    hourlyRate: 110,
    yearsExperience: 4,
    genreSlugs: ['pop', 'charts'],
    hasEquipment: true,
    imageId: 1005
  },
  {
    email: 'demo-artist-07@test.com',
    firstName: 'Tim',
    lastName: 'Krause',
    stageName: 'Bass Monarch',
    bio: 'Drum & Bass specialist with a reputation for high-octane DJ sets. Regular appearances at clubs across NRW and beyond.',
    hourlyRate: 130,
    yearsExperience: 7,
    genreSlugs: ['electronic', 'drum-and-bass'],
    hasEquipment: true,
    imageId: 1074
  },
  {
    email: 'demo-artist-08@test.com',
    firstName: 'Lena',
    lastName: 'Winkler',
    stageName: 'The Wanderers',
    bio: 'Folk duo weaving storytelling and acoustic instruments into intimate performances. Perfect for festivals, cafes, and private gatherings.',
    hourlyRate: 75,
    yearsExperience: 9,
    genreSlugs: ['folk'],
    hasEquipment: true,
    imageId: 1039
  },
  {
    email: 'demo-artist-09@test.com',
    firstName: 'Sofia',
    lastName: 'Rivera',
    stageName: 'Sofia Ritmo',
    bio: 'Latin dance music artist bringing salsa, bachata, and reggaeton vibes to every event. Get ready to move!',
    hourlyRate: 100,
    yearsExperience: 5,
    genreSlugs: ['latin', 'salsa'],
    hasEquipment: true,
    imageId: 1062
  },
  {
    email: 'demo-artist-10@test.com',
    firstName: 'Aisha',
    lastName: 'Johnson',
    stageName: 'Velvet Echo',
    bio: 'Soulful R&B vocalist with a voice that captivates audiences. Drawing inspiration from classic soul and modern R&B to create unforgettable live experiences.',
    hourlyRate: 115,
    yearsExperience: 11,
    genreSlugs: ['rnb', 'soul'],
    hasEquipment: false,
    imageId: 1044
  },
  {
    email: 'demo-artist-11@test.com',
    firstName: 'Markus',
    lastName: 'Schwarz',
    stageName: 'Ironforge',
    bio: 'Heavy metal band forged in the fires of Leipzig. Thunderous riffs, pounding drums, and vocals that shake the walls.',
    hourlyRate: 90,
    yearsExperience: 8,
    genreSlugs: ['metal', 'heavy-metal'],
    hasEquipment: true,
    imageId: 1059
  },
  {
    email: 'demo-artist-12@test.com',
    firstName: 'Daniel',
    lastName: 'Müller',
    stageName: 'Riddim Roots',
    bio: 'Reggae musician spreading positive vibes and conscious lyrics. One love, one heart — let the music bring us together.',
    hourlyRate: 80,
    yearsExperience: 6,
    genreSlugs: ['reggae'],
    hasEquipment: true,
    imageId: 1069
  }
]

const DEMO_VENUES: DemoVenue[] = [
  {
    email: 'demo-venue-01@test.com',
    firstName: 'Stefan',
    lastName: 'Weber',
    venueName: 'Nachtwerk Club',
    type: 'CLUB',
    description: 'Wiesbadens premier nightclub featuring world-class sound systems and international DJs. Three floors of music every weekend.',
    citySlug: 'wiesbaden',
    street: 'Kirchgasse 15',
    postalCode: '65183',
    capacityMin: 200,
    capacityMax: 800,
    amenitySlugs: ['stage', 'sound-system', 'lighting', 'dance-floor', 'bar', 'coat-check'],
    imageId: 1016
  },
  {
    email: 'demo-venue-02@test.com',
    firstName: 'Thomas',
    lastName: 'Fischer',
    venueName: 'Jazzkeller Frankfurt',
    type: 'BAR',
    description: 'Intimate jazz bar in the heart of Frankfurt. Live jazz performances every evening in a cozy, underground atmosphere.',
    citySlug: 'frankfurt-am-main',
    street: 'Kleine Bockenheimer Str. 18a',
    postalCode: '60313',
    capacityMin: 50,
    capacityMax: 150,
    amenitySlugs: ['stage', 'sound-system', 'bar', 'piano'],
    imageId: 1033
  },
  {
    email: 'demo-venue-03@test.com',
    firstName: 'Andrea',
    lastName: 'Koch',
    venueName: 'Kulturhalle Mainz',
    type: 'EVENT_SPACE',
    description: 'Versatile event hall in Mainz perfect for concerts, corporate events, and exhibitions. State-of-the-art facilities with full accessibility.',
    citySlug: 'mainz',
    street: 'Rheinallee 45',
    postalCode: '55116',
    capacityMin: 300,
    capacityMax: 1000,
    amenitySlugs: ['stage', 'sound-system', 'lighting', 'backstage', 'parking', 'wheelchair-access'],
    imageId: 1042
  },
  {
    email: 'demo-venue-04@test.com',
    firstName: 'Julia',
    lastName: 'Hoffmann',
    venueName: 'Skyline Lounge',
    type: 'BAR',
    description: 'Rooftop bar with stunning views of the Frankfurt skyline. Craft cocktails and ambient music in a sophisticated setting.',
    citySlug: 'frankfurt-am-main',
    street: 'Neue Mainzer Str. 52',
    postalCode: '60311',
    capacityMin: 30,
    capacityMax: 100,
    amenitySlugs: ['bar', 'outdoor-area', 'wifi', 'air-conditioning'],
    imageId: 1048
  },
  {
    email: 'demo-venue-05@test.com',
    firstName: 'Georg',
    lastName: 'Bauer',
    venueName: 'Palais München',
    type: 'HOTEL',
    description: 'Historic hotel with a grand ballroom and modern event facilities. Ideal for galas, weddings, and prestigious corporate functions.',
    citySlug: 'muenchen',
    street: 'Maximilianstraße 28',
    postalCode: '80539',
    capacityMin: 100,
    capacityMax: 500,
    amenitySlugs: ['stage', 'sound-system', 'private-room', 'parking', 'kitchen', 'wifi'],
    imageId: 1035
  },
  {
    email: 'demo-venue-06@test.com',
    firstName: 'Petra',
    lastName: 'Schmidt',
    venueName: 'Berliner Halle',
    type: 'EVENT_SPACE',
    description: 'Massive event space in the heart of Berlin. From concerts to conventions, this venue handles it all with cutting-edge production equipment.',
    citySlug: 'berlin',
    street: 'Alexanderplatz 7',
    postalCode: '10178',
    capacityMin: 500,
    capacityMax: 2000,
    amenitySlugs: ['stage', 'sound-system', 'lighting', 'backstage', 'green-room', 'projector'],
    imageId: 1031
  },
  {
    email: 'demo-venue-07@test.com',
    firstName: 'Hans',
    lastName: 'Richter',
    venueName: 'Rheinblick Restaurant',
    type: 'RESTAURANT',
    description: 'Fine dining restaurant overlooking the Rhine. Available for private events, live music evenings, and exclusive celebrations.',
    citySlug: 'wiesbaden',
    street: 'Wilhelmstraße 36',
    postalCode: '65183',
    capacityMin: 40,
    capacityMax: 120,
    amenitySlugs: ['kitchen', 'bar', 'outdoor-area', 'private-room', 'wifi'],
    imageId: 1058
  },
  {
    email: 'demo-venue-08@test.com',
    firstName: 'Ralf',
    lastName: 'Wagner',
    venueName: 'Club Paradox',
    type: 'CLUB',
    description: 'Underground club scene in Köln with two dance floors and a legendary sound system. Home to some of Germanys best electronic music nights.',
    citySlug: 'koeln',
    street: 'Ehrenstraße 44',
    postalCode: '50672',
    capacityMin: 300,
    capacityMax: 1200,
    amenitySlugs: ['stage', 'sound-system', 'lighting', 'dance-floor', 'bar', 'smoking-area'],
    imageId: 1052
  },
  {
    email: 'demo-venue-09@test.com',
    firstName: 'Kerstin',
    lastName: 'Meier',
    venueName: 'Hafenspeicher',
    type: 'EVENT_SPACE',
    description: 'Converted warehouse in Hamburg harbor district. Industrial charm meets modern event production for concerts and cultural events.',
    citySlug: 'hamburg',
    street: 'Am Sandtorkai 30',
    postalCode: '20457',
    capacityMin: 200,
    capacityMax: 600,
    amenitySlugs: ['stage', 'sound-system', 'backstage', 'parking', 'projector'],
    imageId: 1015
  },
  {
    email: 'demo-venue-10@test.com',
    firstName: 'Michael',
    lastName: 'Neumann',
    venueName: 'Schlosspark Hotel',
    type: 'HOTEL',
    description: 'Elegant hotel in Darmstadt with beautiful garden grounds. Perfect for weddings, conferences, and intimate musical evenings.',
    citySlug: 'darmstadt',
    street: 'Schlossgartenstraße 12',
    postalCode: '64289',
    capacityMin: 80,
    capacityMax: 300,
    amenitySlugs: ['stage', 'private-room', 'parking', 'kitchen', 'wifi', 'air-conditioning'],
    imageId: 1040
  },
  {
    email: 'demo-venue-11@test.com',
    firstName: 'Robert',
    lastName: 'Lehmann',
    venueName: 'Vinyl Underground',
    type: 'CLUB',
    description: 'Leipzigs go-to spot for alternative and electronic music. Vinyl-only DJ sets, live bands, and a community-driven vibe.',
    citySlug: 'leipzig',
    street: 'Karl-Liebknecht-Str. 36',
    postalCode: '04107',
    capacityMin: 100,
    capacityMax: 400,
    amenitySlugs: ['stage', 'sound-system', 'lighting', 'dance-floor', 'bar', 'coat-check'],
    imageId: 1024
  },
  {
    email: 'demo-venue-12@test.com',
    firstName: 'Maria',
    lastName: 'Zimmermann',
    venueName: 'Biergarten Alm',
    type: 'RESTAURANT',
    description: 'Traditional Bavarian beer garden with live music on weekends. Authentic cuisine, local beers, and a warm atmosphere under the chestnut trees.',
    citySlug: 'muenchen',
    street: 'Leopoldstraße 50',
    postalCode: '80802',
    capacityMin: 60,
    capacityMax: 200,
    amenitySlugs: ['kitchen', 'bar', 'outdoor-area', 'parking', 'wifi'],
    imageId: 1060
  }
]

const PASSWORD = 'DemoPassword123!'

// =============================================
// LOOKUP HELPERS
// =============================================

async function loadGenreMap(): Promise<Map<string, string>> {
  const { data, error } = await supabase.from('genres').select('id, slug')
  if (error) throw new Error(`Failed to load genres: ${error.message}`)
  const map = new Map<string, string>()
  for (const g of data) map.set(g.slug, g.id)
  return map
}

async function loadAmenityMap(): Promise<Map<string, string>> {
  const { data, error } = await supabase.from('amenities').select('id, slug')
  if (error) throw new Error(`Failed to load amenities: ${error.message}`)
  const map = new Map<string, string>()
  for (const a of data) map.set(a.slug, a.id)
  return map
}

async function loadCityMap(): Promise<Map<string, string>> {
  const { data, error } = await supabase.from('cities').select('id, slug')
  if (error) throw new Error(`Failed to load cities: ${error.message}`)
  const map = new Map<string, string>()
  for (const c of data) map.set(c.slug, c.id)
  return map
}

// =============================================
// AUTH USER CREATION (idempotent)
// =============================================

async function ensureAuthUser(
  email: string,
  firstName: string,
  lastName: string,
  role: 'ARTIST' | 'VENUE'
): Promise<string | null> {
  // Check if user already exists
  const { data: existingUsers } = await supabase.auth.admin.listUsers()
  const existing = existingUsers?.users?.find(u => u.email === email)

  if (existing) {
    console.log(`   Auth user exists: ${email} (${existing.id})`)
    // Ensure profile role is correct
    await supabase
      .from('profiles')
      .update({ role, first_name: firstName, last_name: lastName })
      .eq('id', existing.id)
    return existing.id
  }

  // Create new user
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password: PASSWORD,
    email_confirm: true,
    user_metadata: { first_name: firstName, last_name: lastName }
  })

  if (error) {
    console.error(`   Failed to create auth user ${email}: ${error.message}`)
    return null
  }

  console.log(`   Created auth user: ${email} (${data.user.id})`)

  // Wait for profile trigger
  await new Promise(resolve => setTimeout(resolve, 1000))

  // Update profile role
  await supabase
    .from('profiles')
    .update({ role, first_name: firstName, last_name: lastName })
    .eq('id', data.user.id)

  return data.user.id
}

// =============================================
// ARTIST SEEDING
// =============================================

async function seedArtist(
  artist: DemoArtist,
  genreMap: Map<string, string>
): Promise<boolean> {
  console.log(`\n--- Artist: ${artist.stageName} ---`)

  const userId = await ensureAuthUser(artist.email, artist.firstName, artist.lastName, 'ARTIST')
  if (!userId) return false

  // Check if artist record already exists
  const { data: existingArtist } = await supabase
    .from('artists')
    .select('id')
    .eq('profile_id', userId)
    .maybeSingle()

  let artistId: string

  if (existingArtist) {
    console.log(`   Artist record exists: ${existingArtist.id}`)
    artistId = existingArtist.id
  } else {
    const { data: newArtist, error } = await supabase
      .from('artists')
      .insert({
        profile_id: userId,
        stage_name: artist.stageName,
        bio: artist.bio,
        hourly_rate: artist.hourlyRate,
        years_experience: artist.yearsExperience,
        has_equipment: artist.hasEquipment,
        is_public: true
      })
      .select('id')
      .single()

    if (error) {
      console.error(`   Failed to create artist: ${error.message}`)
      return false
    }

    console.log(`   Created artist: ${newArtist.id}`)
    artistId = newArtist.id
  }

  // Link genres (skip on conflict)
  for (const slug of artist.genreSlugs) {
    const genreId = genreMap.get(slug)
    if (!genreId) {
      console.warn(`   Genre not found: ${slug}`)
      continue
    }

    const { error } = await supabase
      .from('artist_genres')
      .upsert(
        { artist_id: artistId, genre_id: genreId, is_primary: slug === artist.genreSlugs[0] },
        { onConflict: 'artist_id,genre_id' }
      )

    if (error) {
      console.warn(`   Genre link error (${slug}): ${error.message}`)
    }
  }

  // Add primary image (skip if exists)
  const { data: existingMedia } = await supabase
    .from('artist_media')
    .select('id')
    .eq('artist_id', artistId)
    .eq('is_primary', true)
    .maybeSingle()

  if (!existingMedia) {
    const { error } = await supabase
      .from('artist_media')
      .insert({
        artist_id: artistId,
        type: 'IMAGE',
        url: `https://picsum.photos/seed/${artist.imageId}/800/600`,
        thumbnail_url: `https://picsum.photos/seed/${artist.imageId}/400/300`,
        title: `${artist.stageName} profile photo`,
        is_primary: true,
        sort_order: 0
      })

    if (error) {
      console.warn(`   Media insert error: ${error.message}`)
    }
  } else {
    console.log(`   Primary media exists`)
  }

  console.log(`   Done: ${artist.stageName}`)
  return true
}

// =============================================
// VENUE SEEDING
// =============================================

async function seedVenue(
  venue: DemoVenue,
  amenityMap: Map<string, string>,
  cityMap: Map<string, string>
): Promise<boolean> {
  console.log(`\n--- Venue: ${venue.venueName} ---`)

  const userId = await ensureAuthUser(venue.email, venue.firstName, venue.lastName, 'VENUE')
  if (!userId) return false

  const cityId = cityMap.get(venue.citySlug)
  if (!cityId) {
    console.error(`   City not found: ${venue.citySlug}`)
    return false
  }

  // Check if venue record already exists
  const { data: existingVenue } = await supabase
    .from('venues')
    .select('id')
    .eq('profile_id', userId)
    .maybeSingle()

  let venueId: string

  if (existingVenue) {
    console.log(`   Venue record exists: ${existingVenue.id}`)
    venueId = existingVenue.id
  } else {
    const { data: newVenue, error } = await supabase
      .from('venues')
      .insert({
        profile_id: userId,
        venue_name: venue.venueName,
        type: venue.type,
        description: venue.description,
        city_id: cityId,
        street: venue.street,
        postal_code: venue.postalCode,
        capacity_min: venue.capacityMin,
        capacity_max: venue.capacityMax,
        is_public: true
      })
      .select('id')
      .single()

    if (error) {
      console.error(`   Failed to create venue: ${error.message}`)
      return false
    }

    console.log(`   Created venue: ${newVenue.id}`)
    venueId = newVenue.id
  }

  // Link amenities (skip on conflict)
  for (const slug of venue.amenitySlugs) {
    const amenityId = amenityMap.get(slug)
    if (!amenityId) {
      console.warn(`   Amenity not found: ${slug}`)
      continue
    }

    const { error } = await supabase
      .from('venue_amenities')
      .upsert(
        { venue_id: venueId, amenity_id: amenityId },
        { onConflict: 'venue_id,amenity_id' }
      )

    if (error) {
      console.warn(`   Amenity link error (${slug}): ${error.message}`)
    }
  }

  // Add primary image (skip if exists)
  const { data: existingMedia } = await supabase
    .from('venue_media')
    .select('id')
    .eq('venue_id', venueId)
    .eq('is_primary', true)
    .maybeSingle()

  if (!existingMedia) {
    const { error } = await supabase
      .from('venue_media')
      .insert({
        venue_id: venueId,
        type: 'IMAGE',
        url: `https://picsum.photos/seed/${venue.imageId}/800/600`,
        thumbnail_url: `https://picsum.photos/seed/${venue.imageId}/400/300`,
        title: `${venue.venueName} photo`,
        is_primary: true,
        sort_order: 0
      })

    if (error) {
      console.warn(`   Media insert error: ${error.message}`)
    }
  } else {
    console.log(`   Primary media exists`)
  }

  console.log(`   Done: ${venue.venueName}`)
  return true
}

// =============================================
// MAIN
// =============================================

async function main() {
  console.log('Seeding demo data for discovery pages...\n')
  console.log('='.repeat(60))

  // Load lookup tables
  console.log('\nLoading lookup tables...')
  const genreMap = await loadGenreMap()
  const amenityMap = await loadAmenityMap()
  const cityMap = await loadCityMap()
  console.log(`   Genres: ${genreMap.size}, Amenities: ${amenityMap.size}, Cities: ${cityMap.size}`)

  // Seed artists
  console.log('\n' + '='.repeat(60))
  console.log('SEEDING ARTISTS (12)')
  console.log('='.repeat(60))

  let artistSuccess = 0
  let artistFail = 0
  for (const artist of DEMO_ARTISTS) {
    const ok = await seedArtist(artist, genreMap)
    if (ok) artistSuccess++
    else artistFail++
  }

  // Seed venues
  console.log('\n' + '='.repeat(60))
  console.log('SEEDING VENUES (12)')
  console.log('='.repeat(60))

  let venueSuccess = 0
  let venueFail = 0
  for (const venue of DEMO_VENUES) {
    const ok = await seedVenue(venue, amenityMap, cityMap)
    if (ok) venueSuccess++
    else venueFail++
  }

  // Summary
  console.log('\n' + '='.repeat(60))
  console.log('SUMMARY')
  console.log('='.repeat(60))
  console.log(`   Artists: ${artistSuccess} succeeded, ${artistFail} failed`)
  console.log(`   Venues:  ${venueSuccess} succeeded, ${venueFail} failed`)

  const total = artistSuccess + venueSuccess
  const totalExpected = DEMO_ARTISTS.length + DEMO_VENUES.length
  if (total === totalExpected) {
    console.log(`\nAll ${total} demo records seeded successfully!`)
    console.log('\nVerify at:')
    console.log('   http://localhost:5173/artists')
    console.log('   http://localhost:5173/venues')
  } else {
    console.log(`\n${total}/${totalExpected} records seeded. Check errors above.`)
  }
}

main().catch(console.error)
