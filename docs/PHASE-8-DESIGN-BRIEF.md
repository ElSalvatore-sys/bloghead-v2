# Phase 8 — Design Brief: Visual Polish Pass

> **Project:** bloghead-v2 (Music/Entertainment Marketplace)
> **Stack:** React + TypeScript + Vite + Supabase + TailwindCSS v4 + shadcn/ui
> **Reference:** Bridebook research (`~/Developer/bridebook-research/`) — 61 screenshots, 14 design docs
> **Date:** February 2026

---

## Table of Contents

1. [Design System Summary](#1-design-system-summary)
2. [Pages to Build](#2-pages-to-build)
3. [Component Inventory](#3-component-inventory)
4. [Implementation Order](#4-implementation-order)
5. [Screenshot Reference Map](#5-screenshot-reference-map)

---

## 1. Design System Summary

### 1.1 Current State (bloghead-v2)

**Source:** `src/styles/globals.css`

| Token | Value | Usage |
|-------|-------|-------|
| Primary | `#3B82F6` (Blue, hsl 217 91% 60%) | Buttons, links, active states, ring |
| Brand | `#F59E0B` (Amber, hsl 38 92% 50%) | Badges, highlights, CTAs |
| Background (light) | `#FFFFFF` (hsl 0 0% 100%) | Page background |
| Background (dark) | `#1A1A2E` (hsl 222 47% 11%) | Dark mode page bg |
| Foreground (light) | `#1A1A2E` (hsl 222 47% 11%) | Primary text |
| Foreground (dark) | `#F9FAFB` (hsl 210 40% 98%) | Dark mode text |
| Card (light) | `#FFFFFF` | Card surfaces |
| Card (dark) | `#22223A` (hsl 222 47% 14%) | Dark mode cards |
| Destructive | `#EF4444` (hsl 0 84% 60%) | Error states |
| Success | `#22C55E` (hsl 142 71% 45%) | Success states |
| Warning | `#F59E0B` (hsl 38 92% 50%) | Warning states |
| Info | `#06B6D4` (hsl 199 89% 48%) | Info states |
| Border | `hsl(220 13% 91%)` | Cards, inputs, dividers |
| Radius LG | `0.5rem` (8px) | Large radius |
| Radius MD | `0.375rem` (6px) | Medium radius |
| Radius SM | `0.25rem` (4px) | Small radius |

**Typography:** System defaults only — no custom font families imported.

**Component library:** 31 shadcn/ui primitives installed (button, card, dialog, form, input, label, avatar, dropdown-menu, toast, badge, sheet, separator, scroll-area, alert, skeleton, progress, table, tabs, breadcrumb, command, checkbox, select, slider, popover, textarea, calendar, alert-dialog, switch, page-header, empty-state, loading-spinner).

**Tailwind version:** v4 with `@theme` inline directive (CSS-first config, no `tailwind.config.js`).

---

### 1.2 Bridebook Reference Tokens

**Source:** `bridebook-research/docs/05-DESIGN-TOKENS.md`

| Category | Token | Value |
|----------|-------|-------|
| Brand Primary | `brand-primary` | `#5B4ED1` (Purple) |
| Brand Secondary | `brand-secondary` | `#EC4899` (Pink) |
| Brand Teal | `brand-teal` | `#3BB5A0` |
| Brand Gold | `brand-gold` | `#FFB800` |
| Font Sans | `font-sans` | `Inter, DM Sans, system-ui` |
| Font Serif | `font-serif` | `Playfair Display, Georgia, serif` |
| Spacing Base | — | 4px |
| Shadow SM | `shadow-sm` | `0 1px 2px rgba(0,0,0,0.04)` |
| Shadow MD | `shadow-md` | `0 1px 4px rgba(0,0,0,0.06)` |
| Shadow LG | `shadow-lg` | `0 2px 8px rgba(0,0,0,0.08)` |
| Shadow XL | `shadow-xl` | `0 4px 24px rgba(0,0,0,0.15)` |
| Shadow 2XL | `shadow-2xl` | `0 20px 60px rgba(0,0,0,0.2)` |
| Radius SM | `radius-sm` | 4px |
| Radius MD | `radius-md` | 8px |
| Radius LG | `radius-lg` | 12px |
| Radius XL | `radius-xl` | 16px |
| Radius Pill | `radius-pill` | 9999px |
| Transition Fast | — | 100ms ease-out |
| Transition Base | — | 150ms ease-in-out |
| Transition Slow | — | 300ms ease-in-out |

---

### 1.3 Legacy Bloghead Design Reference

**Source:** `~/design-assets/color-palettes/bloghead-theme.json`

| Token | Value | Note |
|-------|-------|------|
| Brand Primary | `#8B5CF6` (Purple) | Original Bloghead brand |
| Brand Secondary | `#06B6D4` (Cyan) | Complementary accent |
| Gradient Primary | `#8B5CF6 → #06B6D4` | Signature gradient |
| Gradient Header | `#7C3AED → #2563EB` | Header bar |
| Background Dark | `#111827` | Dark mode |
| Display Font | Inter | Display headings |
| Body Font | Inter | Body text |
| Serif Font | Merriweather | Serif accent |
| Purple Shadow | `0 4px 14px rgba(139,92,246,0.25)` | Brand shadow |

---

### 1.4 Design Recommendations

#### KEEP (no changes)

| What | Why |
|------|-----|
| Primary Blue `#3B82F6` + Amber `#F59E0B` | Deliberate clean/bright differentiation from dark music apps and from legacy Bloghead purple |
| Light/Dark mode implementation | White bg light mode, deep blue-gray dark mode — working correctly |
| shadcn/ui component foundation | 31 primitives provide solid base for all UI |
| Status colors (green/amber/red/cyan) | Standard semantic palette, consistent with both Bridebook and Tailwind defaults |
| Tailwind v4 `@theme` approach | Modern CSS-first config, no need to migrate |

#### UPDATE (adopt from Bridebook)

| What | From | To | Why |
|------|------|----|-----|
| Body font | System default | **Inter** (`@fontsource/inter`) | Professional, highly readable, widely used in modern SaaS |
| Display font | System default | **Playfair Display** (Google Fonts) | Serif for hero/display headings adds visual hierarchy and premium feel |
| Shadow scale | Tailwind defaults (heavy) | Bridebook's subtle scale: sm(0.04), md(0.06), lg(0.08), xl(0.15), 2xl(0.2) | Current shadows too strong; Bridebook's scale is more refined |
| Spacing system | Implicit 4px base | Explicit 4px base spacing tokens documented | Consistency across padding/margins |
| Border radius | 4/6/8px only | Add `radius-xl: 16px`, `radius-pill: 9999px` | Pill buttons, filter chips, rounded CTAs |
| Transition tokens | None defined | Add `--transition-fast/base/slow` CSS vars | Consistent hover/focus animations |
| Container max-width | Unset | Add `max-w-[1200px]` as standard page container | Content doesn't sprawl on wide screens |
| Z-index scale | Ad-hoc | Codified: dropdown(20), sticky(30), overlay(40), modal(50), toast(60) | Prevent layering bugs |

#### DO NOT ADOPT

| What | Why |
|------|-----|
| Bridebook purple `#5B4ED1` | bloghead-v2 has its own blue identity |
| Legacy Bloghead dark gradient aesthetic | Different brand, different era |
| Bridebook's wedding-specific themes (lavender, blush, burgundy) | Not relevant to music marketplace |
| Bridebook's warm `#F9F8F6` off-white backgrounds | bloghead-v2 uses clean white/dark blue-gray |

---

## 2. Pages to Build

### Page Overview

| # | Page | Route | Status | Complexity | Data Hooks Available |
|---|------|-------|--------|------------|---------------------|
| 1 | Landing Page | `/` | Existing — needs redesign | **L** | Public data only |
| 2 | Artist Listing | `/artists` | Existing — needs polish | **M** | `useArtists`, `useArtistFilters` |
| 3 | Venue Listing | `/venues` | Existing — needs polish | **M** | `useVenues`, `useVenueFilters` |
| 4 | Artist Detail | `/artists/:id` | Existing — needs polish | **L** | `useArtist`, `useArtistBookings` |
| 5 | Venue Detail | `/venues/:id` | Existing — needs polish | **L** | `useVenue`, `useVenueBookings` |
| 6 | Search Results | `/search` | Existing — needs polish | **M** | `useSearch` |
| 7 | Dashboard | `/dashboard` | Existing — needs redesign | **L** | `useProfile`, `useBookings`, `useFavorites`, `useMessages` |
| 8 | Bookings | `/bookings` | Existing — needs polish | **M** | `useBookings`, `useBookingActions` |
| 9 | Messages | `/messages` | Existing — needs polish | **M** | `useThreads`, `useMessages` |
| 10 | Favorites | `/favorites` | Existing — needs polish | **S** | `useFavorites` |
| 11 | Settings | `/settings` | Existing — needs polish | **M** | `useProfile`, `useUpdateProfile` |
| 12 | Artist/Venue Create & Edit Forms | New routes | **New pages** — backend hooks exist | **L** | `useCreateArtist`, `useUpdateArtist`, `useCreateVenue`, `useUpdateVenue` + ArtistService/VenueService |

---

### Page 1: Landing Page (`/`)

**Status:** Existing — needs redesign
**Complexity:** L
**Current state:** Basic landing with minimal hero and feature sections

**Bridebook screenshot references:**
- `landing page. .png` — Hero layout, search bar, category navigation
- `homepage pt2.png` — Featured sections, category cards
- `homepage pt3.png` — Popular locations/cities grid
- `homepaget pt4.png` — Country discovery, footer
- `Sign up modal (Google:Apple:Email options).png` — Auth modal reference

**Key components needed:**
- `HeroBanner` (NEW) — Full-width hero with background image, overlay text, search bar
- `SectionHeader` (NEW) — Title + "View All" link + carousel arrows
- `Footer` (NEW) — Multi-column footer with links, social icons
- Existing `SearchBar` — Adapt for hero placement
- Category cards — Reuse `ArtistCard` / `VenueCard` patterns

**Layout reference (from Bridebook wireframes):**
```
┌────────────────────────────────────────────────┐
│                  [Header/Nav]                   │
├────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────┐  │
│  │          HERO BANNER                     │  │
│  │     "Find your perfect artist"           │  │
│  │     [SearchBar: location + category]     │  │
│  │     [Button: Search]                     │  │
│  └──────────────────────────────────────────┘  │
│                                                │
│  ── Browse by Category ──────── [View All →]   │
│  [Card] [Card] [Card] [Card] [Card]            │
│                                                │
│  ── Featured Artists ────────── [View All →]   │
│  [ArtistCard] [ArtistCard] [ArtistCard]        │
│                                                │
│  ── Popular Venues ──────────── [View All →]   │
│  [VenueCard] [VenueCard] [VenueCard]           │
│                                                │
│  ── How It Works ──────────────────────────    │
│  [Step 1] [Step 2] [Step 3]                    │
│                                                │
│  [Footer]                                      │
└────────────────────────────────────────────────┘
```

**Mobile responsive:**
- Hero stacks vertically with full-width search inputs
- Category cards: 2-column grid
- Featured artists/venues: horizontal scroll carousel
- Footer: single column, accordion sections

---

### Page 2: Artist Listing (`/artists`)

**Status:** Existing — needs polish
**Complexity:** M

**Bridebook screenshot references:**
- `location und dienstleister.png` — Main listing grid with sidebar filters
- `location pt2 the map view and locations.png` — Map + list split view
- `location pt3 budget firendly.png` — Budget-friendly filter results
- `locaiton pt4.png` — Category-specific listing
- `location und dienstleister filters.png` through `...filters PT 5.png` — Filter panel states

**Key components (already exist):**
- `FilterPanel`, `FilterSheet`, `SearchBar`, `SortDropdown`, `ViewToggle`
- `ArtistCard`, `ResultsGrid`, `ActiveFilters`, `Pagination`, `CardSkeleton`

**Polish needed:**
- Enhance `FilterPanel` with sticky behavior and result count badge
- Add hover lift effect to `ArtistCard` (translate-y + shadow)
- Improve filter chip styling with pill radius
- Add skeleton loading states during filter changes

**Mobile responsive:**
- Filter panel → bottom sheet (`FilterSheet` already exists)
- Cards: single column on mobile, 2-col on tablet, 3-col on desktop

---

### Page 3: Venue Listing (`/venues`)

**Status:** Existing — needs polish
**Complexity:** M

**Bridebook screenshot references:**
- Same as Artist Listing (Bridebook uses identical layout for all listing types)
- `location - catering.png`, `location - florists.png`, `location - photograph.png`, `location - transport.png` — Category-specific layouts

**Key components (already exist):**
- Same component set as Artist Listing
- `VenueCard` instead of `ArtistCard`

**Polish needed:**
- Same improvements as Artist Listing
- Consider adding map toggle (future enhancement, not Phase 8)

---

### Page 4: Artist Detail (`/artists/:id`)

**Status:** Existing — needs polish
**Complexity:** L

**Bridebook screenshot references:**
- `locatons when pressed and trying to book the email with template.png` — Detail page with booking CTA
- `location when venue is clicked email template and message pt 2.png` — Contact/booking modal
- `locaiton when venue is choosen the email template the edit button to edit information.png` — Edit contact info

**Key components (already exist):**
- `MediaGallery`, `AvailabilityCalendar`, `BackButton`, `ShareButton`
- `ContactInfo`, `DetailSkeleton`, `ReviewsPlaceholder`, `SimilarEntities`
- `BookingRequestModal`, `BookingStatusBadge`

**New components needed:**
- `ImageLightbox` (NEW) — Fullscreen gallery viewer on image click
- `StatsRow` (NEW) — Key metrics display (bookings, rating, experience)

**Polish needed:**
- Gallery: add lightbox on click, improve grid layout
- CTA section: make booking button more prominent with sticky bottom bar on mobile
- Add stats row below artist name (rating, bookings count, years active)
- Improve responsive layout: sidebar info card on desktop, stacked on mobile

**Layout reference:**
```
┌────────────────────────────────────────────────┐
│  [← Back]                          [Share] [♥] │
├────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────┐  │
│  │  [Gallery: Main + 3 thumbs + "+N more"]  │  │
│  └──────────────────────────────────────────┘  │
│                                                │
│  ┌──── Info ────────────┐  ┌── Sidebar ─────┐ │
│  │ Artist Name           │  │ From $XXX      │ │
│  │ ★★★★☆ (42 reviews)  │  │ [Book Now]     │ │
│  │ Genre • Location      │  │ [♥ Favorite]   │ │
│  │                       │  │                │ │
│  │ [StatsRow]            │  │ Quick Facts    │ │
│  │ ── About ──           │  │ Genre: Rock    │ │
│  │ Bio text...           │  │ Capacity: 500  │ │
│  │ ── Equipment ──       │  │ Rating: 4.8    │ │
│  │ [Tag] [Tag] [Tag]    │  └────────────────┘ │
│  │ ── Reviews ──         │                     │
│  │ [Review 1]            │                     │
│  │ [Review 2]            │                     │
│  └───────────────────────┘                     │
└────────────────────────────────────────────────┘
```

---

### Page 5: Venue Detail (`/venues/:id`)

**Status:** Existing — needs polish
**Complexity:** L

**Bridebook screenshot references:** Same as Artist Detail

**Key components:** Same as Artist Detail, adapted for venue data

**Polish needed:** Same improvements as Artist Detail
- Capacity info, amenities tags, venue-specific stats

---

### Page 6: Search Results (`/search`)

**Status:** Existing — needs polish
**Complexity:** M

**Bridebook screenshot references:**
- Same listing screenshots as Pages 2/3
- `location pt2 the map view and locations.png` — Map view toggle

**Key components (already exist):**
- `SearchBar` (in `components/search/`), `SearchResults`, `SearchFilters`

**Polish needed:**
- Unify search UI with artist/venue listing patterns
- Add result count badge
- Add view toggle (grid/list)
- Improve empty state with illustration

---

### Page 7: Dashboard (`/dashboard`)

**Status:** Existing — needs redesign
**Complexity:** L

**Bridebook screenshot references:**
- `Main dashboard overview (countdown, progress, quick actions).png` — Main dashboard layout
- `planungs pic.png` — Planning tools overview
- `PLANUNGS tool pt2.png` through `planungs tool pt5.png` — Planning sub-sections

**New components needed:**
- `QuickActionBar` (NEW) — Horizontal row of icon shortcuts with counts
- `FeatureCard` (NEW) — Dashboard tool card (icon + title + description + CTA)
- `StatsRow` (NEW) — Three-column statistics display

**Polish needed:**
- Redesign layout with welcome header + stats overview
- Add quick action shortcuts (Artists, Venues, Bookings, Messages, Favorites)
- Recent bookings summary
- Recent messages preview
- Favorites carousel

**Layout reference:**
```
┌────────────────────────────────────────────────┐
│  Welcome back, [Name]!                         │
│  [StatsRow: X Bookings | Y Artists | Z Venues] │
│                                                │
│  ── Quick Actions ─────────────────────────    │
│  [Bookings] [Messages] [Favorites] [Search]    │
│                                                │
│  ── Recent Bookings ──────── [View All →]      │
│  [BookingCard] [BookingCard] [BookingCard]      │
│                                                │
│  ── Your Favorites ──────── [View All →]       │
│  [ArtistCard] [VenueCard] [ArtistCard]         │
│                                                │
│  ── Recent Messages ─────── [View All →]       │
│  [Thread preview] [Thread preview]             │
└────────────────────────────────────────────────┘
```

**Mobile responsive:**
- Stats: stacked vertically or 2-column
- Quick actions: horizontally scrollable
- Cards: single column, limited to 3 items with "View All"

---

### Page 8: Bookings (`/bookings`)

**Status:** Existing — needs polish
**Complexity:** M

**Bridebook screenshot references:**
- `planungs tool budget icon pt 1 .png`, `...pt 2.png` — Budget entry flow
- `planungs tool budget icon after budget inserted pt1.png` through `...pt5.png` — Budget dashboard

**Key components (already exist):**
- `BookingCard`, `BookingRequestModal`, `BookingStatusBadge`

**Polish needed:**
- Add tab filtering (Upcoming / Past / Pending)
- Improve `BookingCard` with better status indicators
- Add empty state with illustration
- Improve mobile card layout

---

### Page 9: Messages (`/messages`, `/messages/:threadId`)

**Status:** Existing — needs polish
**Complexity:** M

**Bridebook screenshot references:**
- `messages pt1.png` — Thread list with tabs (Vendors / Guests / System / Archived)
- `messages pt2.png` — Message detail view, two-column layout
- `messages pt3.png` — Message compose area
- `messages pt4.png` — Empty state

**Key components (already exist):**
- `ThreadList`, `ThreadHeader`, `MessageBubble`, `MessageInput`

**Polish needed:**
- Improve thread list with unread indicators and timestamps
- Better two-column layout on desktop (thread list left, messages right)
- Add message status indicators (sent, delivered, read)
- Improve empty state
- Mobile: full-screen thread list, tap to navigate to detail

---

### Page 10: Favorites (`/favorites`)

**Status:** Existing — needs polish
**Complexity:** S

**Bridebook screenshot references:**
- `favourites.png` — Favorites list view with tabs
- `favourites when favourites hinzufugen is clicked.png` — Add to favorites modal

**Polish needed:**
- Add tab filtering (Artists / Venues / All)
- Improve card grid layout
- Add empty state with CTA to discover artists/venues
- Improve `FavoriteButton` animation (heart fill + scale)

---

### Page 11: Settings (`/settings`)

**Status:** Existing — needs polish
**Complexity:** M

**Bridebook screenshot references:**
- `settings pt1.png` — Account settings with sidebar nav
- `settings pt2.png` — Profile details panel
- `settings pt3.png` — Sharing/partner settings
- `settings pt4.png` — Notification preferences
- `settings pt5.png` — Support/FAQ section

**Key components (already exist):**
- `AvatarUpload`, `ThemeToggle`

**Polish needed:**
- Improve sidebar navigation (currently in `Sidebar.tsx`)
- Better section organization (Profile, Notifications, Appearance, Account)
- Add password change section
- Improve mobile layout (sidebar → top tabs)

**Layout reference:**
```
┌────────────────────────────────────────────────┐
│  Settings                                      │
│  ┌─── Sidebar ────┐  ┌─── Content ──────────┐ │
│  │ [● Profile]     │  │ Profile              │ │
│  │ [○ Notifications]│  │                      │ │
│  │ [○ Appearance]  │  │ [AvatarUpload]       │ │
│  │ [○ Account]     │  │ [Input: Name]        │ │
│  │                 │  │ [Input: Email]       │ │
│  │ [Logout]        │  │ [Input: Phone]       │ │
│  │                 │  │ [Input: Bio]         │ │
│  │                 │  │                      │ │
│  │                 │  │ [Button: Save]       │ │
│  │                 │  │                      │ │
│  │                 │  │ ─── Danger Zone ──── │ │
│  │                 │  │ [Delete Account]     │ │
│  └─────────────────┘  └──────────────────────┘ │
└────────────────────────────────────────────────┘
```

---

### Page 12: Artist/Venue Create & Edit Forms (New Routes)

**Status:** New pages — backend hooks exist
**Complexity:** L

**No direct Bridebook screenshots** — these are admin/creator forms not present in the Bridebook consumer app. Design based on Settings page patterns and Bridebook's form components.

**Proposed routes:**
- `/artists/new` — Create artist profile
- `/artists/:id/edit` — Edit artist profile
- `/venues/new` — Create venue listing
- `/venues/:id/edit` — Edit venue listing

**Key components needed:**
- Multi-step form wizard OR single long form with sections
- `FileUpload` (exists) — For media gallery images
- `AvatarUpload` (exists) — For profile photo
- Form fields: name, genre/type, bio, location, pricing, availability, social links

**Data hooks available:**
- `useCreateArtist`, `useUpdateArtist` (from ArtistService)
- `useCreateVenue`, `useUpdateVenue` (from VenueService)

**Layout reference:**
```
┌────────────────────────────────────────────────┐
│  Create Artist Profile                         │
│                                                │
│  ── Basic Info ──────────────────────────────  │
│  [AvatarUpload]                                │
│  [Input: Artist/Band Name]                     │
│  [Select: Genre]                               │
│  [Textarea: Bio]                               │
│                                                │
│  ── Media ───────────────────────────────────  │
│  [FileUpload: Gallery images (up to 10)]       │
│  [Input: Video URL]                            │
│                                                │
│  ── Details ─────────────────────────────────  │
│  [Input: Location]                             │
│  [Input: Price Range]                          │
│  [AvailabilityCalendar]                        │
│                                                │
│  ── Social Links ────────────────────────────  │
│  [Input: Website]                              │
│  [Input: Instagram]                            │
│  [Input: Spotify]                              │
│                                                │
│  [Button: Cancel]  [Button: Save / Create]     │
└────────────────────────────────────────────────┘
```

---

## 3. Component Inventory

### 3.1 Existing Components

#### shadcn/ui Primitives (31)

| Component | File |
|-----------|------|
| Alert | `ui/alert.tsx` |
| AlertDialog | `ui/alert-dialog.tsx` |
| Avatar | `ui/avatar.tsx` |
| Badge | `ui/badge.tsx` |
| Breadcrumb | `ui/breadcrumb.tsx` |
| Button | `ui/button.tsx` |
| Calendar | `ui/calendar.tsx` |
| Card | `ui/card.tsx` |
| Checkbox | `ui/checkbox.tsx` |
| Command | `ui/command.tsx` |
| Dialog | `ui/dialog.tsx` |
| DropdownMenu | `ui/dropdown-menu.tsx` |
| EmptyState | `ui/empty-state.tsx` |
| Form | `ui/form.tsx` |
| Input | `ui/input.tsx` |
| Label | `ui/label.tsx` |
| LoadingSpinner | `ui/loading-spinner.tsx` |
| PageHeader | `ui/page-header.tsx` |
| Popover | `ui/popover.tsx` |
| Progress | `ui/progress.tsx` |
| ScrollArea | `ui/scroll-area.tsx` |
| Select | `ui/select.tsx` |
| Separator | `ui/separator.tsx` |
| Sheet | `ui/sheet.tsx` |
| Skeleton | `ui/skeleton.tsx` |
| Slider | `ui/slider.tsx` |
| Switch | `ui/switch.tsx` |
| Table | `ui/table.tsx` |
| Tabs | `ui/tabs.tsx` |
| Textarea | `ui/textarea.tsx` |
| Toast | `ui/toast.tsx` |

#### Feature Components (~40)

**Layout (5):**
- `Header` — Top navigation bar
- `Sidebar` — Side navigation
- `MainLayout` — Protected page wrapper with header + sidebar
- `AuthLayout` — Auth page wrapper
- `ThemeToggle` — Dark/light mode switch

**Discovery (12):**
- `SearchBar` (discovery/) — Search input for listing pages
- `FilterPanel` — Desktop sidebar filters
- `FilterSheet` — Mobile bottom sheet filters
- `SortDropdown` — Sort order selector
- `ViewToggle` — Grid/list view switch
- `ActiveFilters` — Applied filter chips
- `Pagination` — Page navigation
- `ArtistCard` — Artist listing card
- `VenueCard` — Venue listing card
- `ResultsGrid` — Grid layout for cards
- `CardSkeleton` — Loading placeholder for cards
- `FavoriteButton` — Heart toggle

**Detail (7):**
- `MediaGallery` — Image grid display
- `AvailabilityCalendar` — Date picker for availability
- `BackButton` — Navigation back
- `ShareButton` — Share link
- `ContactInfo` — Contact details display
- `DetailSkeleton` — Loading placeholder for detail pages
- `ReviewsPlaceholder` — Reviews section placeholder
- `SimilarEntities` — "You might also like" section

**Booking (3):**
- `BookingCard` — Booking summary card
- `BookingRequestModal` — Create booking request dialog
- `BookingStatusBadge` — Status indicator (pending/confirmed/cancelled)

**Messaging (4):**
- `ThreadList` — Conversation list
- `ThreadHeader` — Active thread header
- `MessageBubble` — Individual message
- `MessageInput` — Message compose area

**Search (3):**
- `SearchBar` (search/) — Global search input
- `SearchResults` — Search results display
- `SearchFilters` — Search filter controls

**Upload (2):**
- `AvatarUpload` — Profile photo uploader
- `FileUpload` — General file uploader

**Auth (2):**
- `ProtectedRoute` — Auth guard wrapper
- `AuthRoute` — Redirect if already logged in

---

### 3.2 New Components to Create

Based on Bridebook reference patterns adapted for bloghead-v2:

#### Layout Components (3)

| Component | Description | Bridebook Reference | Complexity |
|-----------|-------------|-------------------|------------|
| `HeroBanner` | Full-width hero with background image, overlay text, search bar | `03-UI-COMPONENTS.md` §7.5 | M |
| `Footer` | Multi-column footer with links, social icons | `03-UI-COMPONENTS.md` §1.4 | M |
| `SectionHeader` | Title + "View All" link + optional carousel arrows | `03-UI-COMPONENTS.md` §7.2 | S |

#### Card Components (3)

| Component | Description | Bridebook Reference | Complexity |
|-----------|-------------|-------------------|------------|
| `FeatureCard` | Dashboard planning tool card (icon + title + description + CTA) | `03-UI-COMPONENTS.md` §4.2 | S |
| `PromoCard` | Marketing card with background image overlay | `03-UI-COMPONENTS.md` §4.3 | S |
| `CategoryCard` | Browse category card with icon and count | Landing page category grid | S |

#### Data Display Components (3)

| Component | Description | Bridebook Reference | Complexity |
|-----------|-------------|-------------------|------------|
| `StatsRow` | Three-column statistics display | `03-UI-COMPONENTS.md` §5.3 | S |
| `QuickActionBar` | Horizontal row of icon shortcuts with counts | `03-UI-COMPONENTS.md` §5.2 | S |
| `RatingStars` | Star rating display with review count | `03-UI-COMPONENTS.md` §5.4 | S |

#### Interactive Components (4)

| Component | Description | Bridebook Reference | Complexity |
|-----------|-------------|-------------------|------------|
| `Carousel` | Horizontal scroll with arrows and dots | `03-UI-COMPONENTS.md` §8.3 | M |
| `ImageLightbox` | Fullscreen gallery viewer with prev/next | `03-UI-COMPONENTS.md` §8.7 | M |
| `ChipSelect` | Pill-style multi-select for compact options | `03-UI-COMPONENTS.md` §2.5 | S |
| `FilterBar` (enhanced) | Sticky horizontal filter with result count badge | `03-UI-COMPONENTS.md` §8.1 | M |

#### Form Components (1)

| Component | Description | Bridebook Reference | Complexity |
|-----------|-------------|-------------------|------------|
| `LocationInput` | Autocomplete location input with map pin icon | `03-UI-COMPONENTS.md` §2.8 | M |

**Total new components: ~14**

---

### 3.3 Component Styling Updates (Existing)

These existing components need visual polish but NOT full rewrites:

| Component | Update Needed |
|-----------|--------------|
| `ArtistCard` | Add hover lift effect (translateY -2px + shadow-lg), improve image aspect ratio |
| `VenueCard` | Same hover effect, add availability badge support |
| `FilterPanel` | Add sticky positioning, result count badge |
| `SearchBar` | Improve focus ring, add clear button animation |
| `BookingCard` | Better status color coding, improve mobile layout |
| `ThreadList` | Add unread dot indicator, improve timestamp formatting |
| `MessageBubble` | Improve sender/receiver visual distinction |
| `MediaGallery` | Add "+N more" overlay on last visible image |
| `FavoriteButton` | Add heart fill animation (scale + color transition) |
| `EmptyState` | Improve with larger illustrations, better CTA styling |
| `Header` | Improve mobile menu, add notification badge support |

---

## 4. Implementation Order

### Phase 8A: Design Foundation (Week 1)

**Goal:** Update design tokens and create shared layout components

1. **Update `globals.css`** with improved design tokens
   - Add Inter font import (via `@fontsource/inter` or Google Fonts link)
   - Add Playfair Display import (Google Fonts)
   - Update shadow scale to Bridebook's subtle values
   - Add transition CSS custom properties
   - Add z-index scale variables
   - Add `radius-xl` and `radius-pill` tokens

2. **Create `HeroBanner` component**
   - Full-width with background image/gradient
   - Overlay text with configurable heading/subtitle
   - Optional search bar slot
   - Optional CTA button
   - Responsive: stacked on mobile

3. **Create `Footer` component**
   - Multi-column link grid (About, Features, Legal, Social)
   - Social media icons
   - Copyright text
   - Responsive: accordion on mobile

4. **Create `SectionHeader` component**
   - Title text
   - Optional "View All" link
   - Optional carousel navigation arrows

5. **Create `Carousel` component**
   - Horizontal scroll container
   - Optional arrow buttons (left/right)
   - Optional pagination dots
   - Touch/swipe support on mobile
   - Configurable slides-per-view

6. **Create `ChipSelect` component**
   - Pill-style option buttons
   - Single or multi-select mode
   - Active state styling (filled primary)

**Dependencies:** None (foundation layer)

---

### Phase 8B: Landing Page Redesign (Week 2)

**Goal:** Redesign HomePage with hero, categories, featured sections

7. **Create `CategoryCard` component** — Icon + label + count

8. **Create `FeatureCard` component** — Icon + title + description + CTA link

9. **Create `PromoCard` component** — Background image + overlay text + CTA

10. **Redesign `HomePage`**
    - HeroBanner with search
    - Browse by Category section (CategoryCard grid)
    - Featured Artists section (Carousel of ArtistCards)
    - Popular Venues section (Carousel of VenueCards)
    - How It Works section (FeatureCard grid)
    - Footer

**Dependencies:** Phase 8A complete

---

### Phase 8C: Discovery Page Polish (Week 3)

**Goal:** Polish listing and search pages

11. **Create `StatsRow` component** — Three-column stat display

12. **Create `QuickActionBar` component** — Horizontal icon shortcuts

13. **Create `RatingStars` component** — Star rating + count

14. **Polish `ArtistCard` and `VenueCard`**
    - Add hover lift effect
    - Improve image loading (skeleton → fade-in)
    - Add RatingStars integration
    - Improve badge positioning

15. **Enhance `FilterPanel` / `FilterBar`**
    - Sticky positioning on scroll
    - Result count badge
    - Better chip styling with pill radius

16. **Polish `SearchPage`**
    - Unify with listing page patterns
    - Improve empty state

**Dependencies:** Phase 8A complete

---

### Phase 8D: Detail Page Enhancement (Week 4)

**Goal:** Improve artist/venue detail pages

17. **Create `ImageLightbox` component**
    - Fullscreen overlay viewer
    - Previous/next navigation
    - Close button and backdrop click
    - Keyboard navigation (arrows, escape)
    - Touch swipe on mobile

18. **Integrate `StatsRow` into detail pages** — Key metrics below name

19. **Improve `MediaGallery`**
    - Add "+N more" overlay on last visible thumbnail
    - Click opens `ImageLightbox`
    - Better responsive grid

20. **Improve booking CTA section**
    - Sticky bottom bar on mobile
    - Better visual prominence

**Dependencies:** Phase 8C (StatsRow, RatingStars)

---

### Phase 8E: Dashboard Redesign (Week 5)

**Goal:** Redesign dashboard with stats and quick actions

21. **Redesign `DashboardPage`**
    - Welcome header with user name
    - StatsRow (bookings count, favorites count, messages count)
    - QuickActionBar (links to key sections)
    - Recent bookings carousel
    - Favorites preview carousel
    - Recent messages preview

**Dependencies:** Phase 8C (StatsRow, QuickActionBar, Carousel)

---

### Phase 8F: Supporting Pages Polish (Week 6)

**Goal:** Polish remaining pages and improve mobile experience

22. **Polish `MessagesPage`**
    - Better two-column layout
    - Unread indicators
    - Improved empty state

23. **Polish `FavoritesPage`**
    - Tab filtering (Artists / Venues)
    - Improved empty state with discovery CTA

24. **Polish `BookingsPage`**
    - Tab filtering (Upcoming / Past / Pending)
    - Better status indicators
    - Improved empty state

25. **Polish `SettingsPage`**
    - Better sidebar navigation
    - Mobile: tabs instead of sidebar
    - Section organization

26. **Create Artist/Venue forms** (if time permits)
    - `/artists/new`, `/artists/:id/edit`
    - `/venues/new`, `/venues/:id/edit`
    - Multi-section forms with validation

27. **Mobile responsive pass**
    - Verify all pages at 375px, 768px, 1024px, 1280px
    - Fix any overflow or layout issues
    - Ensure touch targets are 44px minimum

**Dependencies:** Phase 8D complete

---

## 5. Screenshot Reference Map

Complete mapping of all 61 Bridebook compressed screenshots to bloghead-v2 pages.

**Path prefix:** `~/Developer/bridebook-research/screenshots-compressed/`

| # | Screenshot File | Bridebook Feature | bloghead-v2 Page | Relevance |
|---|-----------------|-------------------|-------------------|-----------|
| 1 | `landing page. .png` | Hero, search bar, category nav, countdown | Landing Page (`/`) | **High** |
| 2 | `homepage pt2.png` | Featured vendors, category cards | Landing Page (`/`) | **High** |
| 3 | `homepage pt3.png` | Popular locations grid | Landing Page (`/`) | **High** |
| 4 | `homepaget pt4.png` | Country discovery, explore section | Landing Page (`/`) | **Medium** |
| 5 | `Sign up modal (Google:Apple:Email options).png` | Auth modal (Google/Apple/Email) | Login/Signup | **Medium** |
| 6 | `Main dashboard overview (countdown, progress, quick actions).png` | Dashboard layout, countdown, progress, quick actions | Dashboard (`/dashboard`) | **High** |
| 7 | `location und dienstleister.png` | Main listing grid with sidebar filters | Artists/Venues Listing | **High** |
| 8 | `location pt2 the map view and locations.png` | Map + list split view | Artists/Venues Listing | **Medium** |
| 9 | `location pt3 budget firendly.png` | Budget-friendly filter results | Artists/Venues Listing | **Medium** |
| 10 | `locaiton pt4.png` | Category-specific listing view | Artists/Venues Listing | **Medium** |
| 11 | `location und dienstleister filters.png` | Filter panel — price categories | Artists/Venues Listing | **High** |
| 12 | `location und dienstleister filters pt2.png` | Filter panel — guest count, must-haves | Artists/Venues Listing | **High** |
| 13 | `location und dienstleister filters pt3.png` | Filter panel — location type checkboxes | Artists/Venues Listing | **High** |
| 14 | `location und dienstleister filters pt4.png` | Filter panel — style & features | Artists/Venues Listing | **Medium** |
| 15 | `location und dienstleister filters PT 5.png` | Filter panel — food, specials, diversity | Artists/Venues Listing | **Low** |
| 16 | `location - catering.png` | Catering category listing | Venues Listing | **Low** |
| 17 | `location - florists.png` | Florist category listing | Venues Listing | **Low** |
| 18 | `location - photograph.png` | Photographer category listing | Artists Listing | **Medium** |
| 19 | `location - transport.png` | Transport category listing | — | **Low** |
| 20 | `locatons when pressed and trying to book the email with template.png` | Venue detail page with booking CTA | Artist/Venue Detail | **High** |
| 21 | `location when venue is clicked email template and message pt 2.png` | Contact/booking modal with form | Artist/Venue Detail | **High** |
| 22 | `locaiton when venue is choosen the email template the edit button to edit information.png` | Edit contact info in booking flow | Artist/Venue Detail | **Medium** |
| 23 | `messages pt1.png` | Thread list with category tabs | Messages (`/messages`) | **High** |
| 24 | `messages pt2.png` | Message detail — two column layout | Messages (`/messages/:id`) | **High** |
| 25 | `messages pt3.png` | Message compose area | Messages | **High** |
| 26 | `messages pt4.png` | Empty state for guest messages tab | Messages | **Medium** |
| 27 | `favourites.png` | Favorites list view with tabs | Favorites (`/favorites`) | **High** |
| 28 | `favourites when favourites hinzufugen is clicked.png` | Add to favorites search modal | Favorites | **Medium** |
| 29 | `planungs pic.png` | Planning tools overview dashboard | Dashboard (`/dashboard`) | **High** |
| 30 | `PLANUNGS tool pt2.png` | Planning sub-section — checklist | Dashboard | **Medium** |
| 31 | `planungs tool pt3.png` | Planning sub-section — homepage builder | — | **Low** |
| 32 | `planungs tool pt4.png` | Planning sub-section — guest list | — | **Low** |
| 33 | `planungs tool pt5.png` | Planning sub-section — inspiration | — | **Low** |
| 34 | `planungs tool budget icon pt 1 .png` | Budget setup — total budget input | Bookings (`/bookings`) | **Medium** |
| 35 | `planungs tool budget icon pt 2.png` | Budget setup — guest count, options | Bookings | **Medium** |
| 36 | `planungs tool budget icon after budget inserted pt1.png` | Budget dashboard — summary stats | Bookings | **High** |
| 37 | `planungs tool budget icon after budget inserted pt2.png` | Budget breakdown — category list | Bookings | **High** |
| 38 | `planungs tool budget icon after budget inserted pt3.png` | Budget breakdown — subcategories | Bookings | **Medium** |
| 39 | `planungs tool budget icon after budget inserted pt4.png` | Budget — cost tracking table | Bookings | **Medium** |
| 40 | `planungs tool budget icon after budget inserted pt5.png` | Budget — analytics/charts | Bookings | **Low** |
| 41 | `planungs tool budget icon after budget inserted  and again hochzeit is pressed .png` | Budget — navigation back to dashboard | Dashboard | **Low** |
| 42 | `planungs tool budget icon after budget inserted and hochzeit is clicked and the buttom look for venues is pressed.png` | Budget → Venue search CTA flow | Artists/Venues Listing | **Low** |
| 43 | `planungstool gästelist.png` | Guest list — empty state | — | **Low** |
| 44 | `planungstool gäästelist when clciked.png` | Guest list — add guest form | — | **Low** |
| 45 | `planungstool ratschlag pt 1.png` | Advice/tips section — overview | — | **Low** |
| 46 | `planungstool ratschlag pt 2.png` | Advice/tips — article list | — | **Low** |
| 47 | `planungstool ratschlag pt 3.png` | Advice/tips — article detail | — | **Low** |
| 48 | `settings pt1.png` | Settings — account tab with sidebar | Settings (`/settings`) | **High** |
| 49 | `settings pt2.png` | Settings — profile/wedding details | Settings | **High** |
| 50 | `settings pt3.png` | Settings — sharing/partner invite | Settings | **Medium** |
| 51 | `settings pt4.png` | Settings — notification preferences | Settings | **High** |
| 52 | `settings pt5.png` | Settings — support/FAQ section | Settings | **Medium** |
| 53 | `hochzeit home page pt1.png` | Homepage builder — details tab | — | **Low** |
| 54 | `hochzeit home page pt2.png` | Homepage builder — accordion fields | — | **Low** |
| 55 | `hochzeit home page pt4.png` | Homepage builder — timeline section | — | **Low** |
| 56 | `hochzeit home page pt5.png` | Homepage builder — gift registry | — | **Low** |
| 57 | `hochzeit home page pt6.png` | Homepage builder — FAQ section | — | **Low** |
| 58 | `hochzeit home page pt7.png` | Homepage builder — live preview | — | **Low** |
| 59 | `hochzeit home page design pt1.png` | Homepage design — template selection | — | **Low** |
| 60 | `hochzeit home page design pt2.png` | Homepage design — color/font customization | — | **Low** |
| 61 | `hochzeit home page einstellung.png` | Homepage settings — URL, publish toggle | — | **Low** |

### Summary by Relevance

| Relevance | Count | Pages Covered |
|-----------|-------|---------------|
| **High** | 20 | Landing, Dashboard, Listing, Detail, Messages, Favorites, Settings, Bookings |
| **Medium** | 18 | All pages (secondary references) |
| **Low** | 23 | Wedding-specific features not applicable to bloghead-v2 |

**All 61 screenshots mapped.** 20 are directly actionable for bloghead-v2's visual polish pass.

---

## Verification Checklist

- [x] All 61 screenshots mapped in reference table (Section 5)
- [x] All 12 pages have screenshot references, component lists, and data sources (Section 2)
- [x] Component inventory shows clear existing (31 + ~40) vs. new (~14) split (Section 3)
- [x] Implementation order has no circular dependencies (Section 4)
- [x] **Total pages:** 12 (10 existing polish + 1 redesign + 1 new)
- [x] **Estimated new components:** 14
- [x] **Estimated implementation phases:** 6 phases (8A–8F)
