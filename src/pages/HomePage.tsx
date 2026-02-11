import { Suspense, lazy } from 'react'
import { AuthModalProvider } from '@/context/AuthModalContext'
import { AuthModal } from '@/components/auth/AuthModal'
import LandingNav from '@/components/sections/LandingNav'

// Lazy load all 8 sections
const HeroSection = lazy(() => import('@/components/sections/HeroSection'))
const AboutSection = lazy(() => import('@/components/sections/AboutSection'))
const FeaturesSection = lazy(() => import('@/components/sections/FeaturesSection'))
const ArtistsCarouselSection = lazy(() => import('@/components/sections/ArtistsCarouselSection'))
const MemberCTASection = lazy(() => import('@/components/sections/MemberCTASection'))
const VorteileMemberSection = lazy(() => import('@/components/sections/VorteileMemberSection'))
const EventsSection = lazy(() => import('@/components/sections/EventsSection'))
const VRExperiencesSection = lazy(() => import('@/components/sections/VRExperiencesSection'))

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen bg-[#171717]">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#610AD1]"></div>
  </div>
)

/**
 * Home/Landing Page
 * Pixel-perfect recreation of blogyydev.xyz design
 * 8 sections: Hero, About, Features, Artists Carousel, Member CTA, Member Benefits, Events, VR
 */
export const HomePage = () => {
  return (
    <AuthModalProvider>
      <div className="relative bg-[#171717]">
        <LandingNav />
        <Suspense fallback={<LoadingSpinner />}>
          {/* Section 1: Hero - Full screen */}
          <HeroSection />

          {/* Section 2: About - Eine Plattform, Zwei Welten */}
          <AboutSection />

          {/* Section 3: Features - Für wen ist Bloghead? */}
          <FeaturesSection />

          {/* Section 4: Artists Carousel */}
          <ArtistsCarouselSection />

          {/* Section 5: Member CTA */}
          <MemberCTASection />

          {/* Section 6: Member Benefits */}
          <VorteileMemberSection />

          {/* Section 7: Events Grid */}
          <EventsSection />

          {/* Section 8: VR Experiences */}
          <VRExperiencesSection />
        </Suspense>
        <AuthModal />
      </div>
    </AuthModalProvider>
  )
}
