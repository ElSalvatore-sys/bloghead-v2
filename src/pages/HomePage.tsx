import { type FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Search,
  Music,
  Disc3,
  Users,
  Building2,
  PartyPopper,
  Wine,
  MessageSquare,
  CalendarCheck,
} from 'lucide-react'
import { useAuth } from '@/hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  HeroBanner,
  Footer,
  SectionHeader,
  Carousel,
  CategoryCard,
  FeatureCard,
} from '@/components/shared'
import { ArtistCard } from '@/components/discovery/ArtistCard'
import { VenueCard } from '@/components/discovery/VenueCard'
import type { ArtistDiscoverResult, VenueDiscoverResult } from '@/services'

const MOCK_ARTISTS: ArtistDiscoverResult[] = [
  {
    id: 'featured-1',
    stage_name: 'Luna Beats',
    bio: null,
    genre_names: ['Electronic', 'House'],
    hourly_rate: 120,
    years_experience: 8,
    primary_image_url: 'https://picsum.photos/seed/luna-beats/400/300',
    has_equipment: true,
  },
  {
    id: 'featured-2',
    stage_name: 'The Velvet Strings',
    bio: null,
    genre_names: ['Jazz', 'Classical'],
    hourly_rate: 150,
    years_experience: 12,
    primary_image_url: 'https://picsum.photos/seed/velvet-strings/400/300',
    has_equipment: true,
  },
  {
    id: 'featured-3',
    stage_name: 'DJ Neon',
    bio: null,
    genre_names: ['Techno'],
    hourly_rate: 80,
    years_experience: 5,
    primary_image_url: 'https://picsum.photos/seed/dj-neon/400/300',
    has_equipment: true,
  },
  {
    id: 'featured-4',
    stage_name: 'Akustik Duo',
    bio: null,
    genre_names: ['Acoustic', 'Folk'],
    hourly_rate: 90,
    years_experience: 7,
    primary_image_url: 'https://picsum.photos/seed/akustik-duo/400/300',
    has_equipment: false,
  },
  {
    id: 'featured-5',
    stage_name: 'Brass Republic',
    bio: null,
    genre_names: ['Brass', 'Funk'],
    hourly_rate: 200,
    years_experience: 15,
    primary_image_url: 'https://picsum.photos/seed/brass-republic/400/300',
    has_equipment: true,
  },
  {
    id: 'featured-6',
    stage_name: 'Mira Voss',
    bio: null,
    genre_names: ['Pop', 'Soul'],
    hourly_rate: 50,
    years_experience: 2,
    primary_image_url: 'https://picsum.photos/seed/mira-voss/400/300',
    has_equipment: false,
  },
]

const MOCK_VENUES: VenueDiscoverResult[] = [
  {
    id: 'venue-featured-1',
    venue_name: 'Kulturpalast',
    description: null,
    type: 'EVENT_SPACE',
    city_name: 'Wiesbaden',
    street: null,
    capacity_min: 100,
    capacity_max: 500,
    primary_image_url: 'https://picsum.photos/seed/kulturpalast/400/300',
    amenity_names: ['Stage', 'Sound System', 'Lighting'],
  },
  {
    id: 'venue-featured-2',
    venue_name: 'The Jazz Cellar',
    description: null,
    type: 'BAR',
    city_name: 'Wiesbaden',
    street: null,
    capacity_min: 30,
    capacity_max: 80,
    primary_image_url: 'https://picsum.photos/seed/jazz-cellar/400/300',
    amenity_names: ['Live Stage', 'Bar'],
  },
  {
    id: 'venue-featured-3',
    venue_name: 'Schlachthof',
    description: null,
    type: 'CLUB',
    city_name: 'Wiesbaden',
    street: null,
    capacity_min: 200,
    capacity_max: 1200,
    primary_image_url: 'https://picsum.photos/seed/schlachthof/400/300',
    amenity_names: ['DJ Booth', 'VIP Area', 'Outdoor Terrace'],
  },
  {
    id: 'venue-featured-4',
    venue_name: 'Villa Nova',
    description: null,
    type: 'EVENT_SPACE',
    city_name: 'Frankfurt',
    street: null,
    capacity_min: 50,
    capacity_max: 300,
    primary_image_url: 'https://picsum.photos/seed/villa-nova/400/300',
    amenity_names: ['Garden', 'Kitchen'],
  },
  {
    id: 'venue-featured-5',
    venue_name: 'Nachtwerk',
    description: null,
    type: 'CLUB',
    city_name: 'Frankfurt',
    street: null,
    capacity_min: 150,
    capacity_max: 800,
    primary_image_url: 'https://picsum.photos/seed/nachtwerk/400/300',
    amenity_names: ['Sound System', 'Laser Show'],
  },
  {
    id: 'venue-featured-6',
    venue_name: 'Weinbar am Markt',
    description: null,
    type: 'RESTAURANT',
    city_name: 'Mainz',
    street: null,
    capacity_min: 20,
    capacity_max: 60,
    primary_image_url: 'https://picsum.photos/seed/weinbar/400/300',
    amenity_names: ['Patio'],
  },
]

const CATEGORIES = [
  { icon: Music, title: 'Musicians', href: '/artists' },
  { icon: Disc3, title: 'DJs', href: '/artists' },
  { icon: Users, title: 'Bands', href: '/artists' },
  { icon: Building2, title: 'Concert Halls', href: '/venues' },
  { icon: PartyPopper, title: 'Clubs', href: '/venues' },
  { icon: Wine, title: 'Bars', href: '/venues' },
]

const HOW_IT_WORKS = [
  {
    icon: Search,
    title: 'Discover',
    description:
      'Browse thousands of artists and venues in your area',
  },
  {
    icon: MessageSquare,
    title: 'Connect',
    description:
      'Message directly and discuss your event details',
  },
  {
    icon: CalendarCheck,
    title: 'Book',
    description:
      'Confirm your booking and get ready for an amazing experience',
  },
]

export function HomePage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <HeroBanner
        title="Discover & Book Amazing Artists and Venues"
        subtitle="The platform connecting fans, artists, and venues for unforgettable live experiences"
        searchSlot={
          <form
            onSubmit={handleSearch}
            className="mx-auto flex max-w-xl gap-2"
          >
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search artists, venues, genres..."
              className="border-white/30 bg-white/10 text-white placeholder:text-white/60 focus-visible:ring-white/50"
            />
            <Button type="submit" variant="secondary">
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
          </form>
        }
        ctaButton={
          user ? (
            <Button asChild size="lg" className="rounded-lg bg-white font-semibold text-primary hover:bg-white/90">
              <Link to="/dashboard">Go to Dashboard</Link>
            </Button>
          ) : (
            <Button asChild size="lg" className="rounded-lg bg-amber-500 font-semibold text-white hover:bg-amber-600">
              <Link to="/signup">Get Started</Link>
            </Button>
          )
        }
      />

      {/* Browse by Category */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-[var(--max-w-container)] px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Browse by Category" viewAllHref="/search" />
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {CATEGORIES.map((cat) => (
              <CategoryCard
                key={cat.title}
                icon={cat.icon}
                title={cat.title}
                href={cat.href}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Artists */}
      <section className="bg-muted/50 py-16 sm:py-20">
        <div className="mx-auto max-w-[var(--max-w-container)] px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Featured Artists" viewAllHref="/artists" />
          <Carousel className="mt-8">
            {MOCK_ARTISTS.map((artist) => (
              <div
                key={artist.id}
                className="w-[85vw] shrink-0 snap-start sm:w-[calc(50%-8px)] lg:w-[calc(33.333%-11px)]"
              >
                <ArtistCard artist={artist} />
              </div>
            ))}
          </Carousel>
        </div>
      </section>

      {/* Popular Venues */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-[var(--max-w-container)] px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Popular Venues" viewAllHref="/venues" />
          <Carousel className="mt-8">
            {MOCK_VENUES.map((venue) => (
              <div
                key={venue.id}
                className="w-[85vw] shrink-0 snap-start sm:w-[calc(50%-8px)] lg:w-[calc(33.333%-11px)]"
              >
                <VenueCard venue={venue} />
              </div>
            ))}
          </Carousel>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-muted/50 py-16 sm:py-20">
        <div className="mx-auto max-w-[var(--max-w-container)] px-4 sm:px-6 lg:px-8">
          <SectionHeader title="How It Works" />
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {HOW_IT_WORKS.map((step) => (
              <FeatureCard
                key={step.title}
                icon={step.icon}
                title={step.title}
                description={step.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}
