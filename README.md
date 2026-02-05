# EA Platform (bloghead-v2)

> Artists, Venues, and Organizers marketplace for the German entertainment industry.

## Overview

EA Platform connects German artists with venues and event organizers through a single marketplace - eliminating fragmented booking and giving everyone visibility into the local entertainment scene.

### User Types

| User Type | Description |
|-----------|-------------|
| **Artists** | Musicians, DJs, performers, entertainers seeking gigs |
| **Venues** | Clubs, bars, event spaces, hotels, restaurants |
| **Organizers** | Event promoters, wedding planners, corporate event managers |
| **Customers** | End consumers attending events, booking entertainment |

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18 + Vite + TypeScript |
| Styling | TailwindCSS 4 |
| Backend | Supabase (Auth + DB + Storage + Realtime) |
| Database | PostgreSQL 15+ with Row Level Security |
| Hosting | Vercel (frontend) + Supabase Cloud |
| Payments | Stripe (future) |
| Monitoring | Sentry + UptimeRobot |

## Project Structure

```
bloghead-v2/
├── .github/              # GitHub templates and workflows
├── docs/                 # Project documentation
│   ├── PHASE-TRACKER.md  # Development phase status
│   ├── phase-00-discovery/
│   ├── phase-01-planning/
│   ├── phase-02-setup/
│   ├── phase-03-database/
│   └── decisions/        # Architecture Decision Records
├── src/                  # Application source (coming soon)
├── CONVENTIONS.md        # Coding and naming conventions
└── README.md             # This file
```

## Documentation

- [Phase Tracker](docs/PHASE-TRACKER.md) - Current development status
- [PRD](docs/phase-00-discovery/PRD.md) - Product Requirements Document
- [MVP Scope](docs/phase-00-discovery/MVP-SCOPE.md) - P0 features for launch
- [Conventions](CONVENTIONS.md) - Coding standards and naming rules

## Getting Started

```bash
# Clone the repository
git clone https://github.com/ElSalvatore-sys/bloghead-v2.git
cd bloghead-v2

# Install dependencies
npm install

# Start development server
npm run dev
```

## Development Phases

| Phase | Status | Description |
|-------|--------|-------------|
| 0 - Discovery | DONE | Research, PRD, personas, MVP scope |
| 1 - Planning | DONE | Tech specs, architecture decisions |
| 2 - Setup | DONE | Project scaffolding, CI/CD |
| 3 - Database | PENDING | Schema design, migrations |
| ... | ... | See [PHASE-TRACKER.md](docs/PHASE-TRACKER.md) |

## Research Base

This project is informed by extensive research from the Bridebook wedding platform, adapted for the German entertainment/artist marketplace. See the [research documents](docs/phase-00-discovery/research/) for detailed analysis.

## License

Proprietary - Oasis Technologies

---

Built with [Claude Code](https://claude.ai/claude-code)
